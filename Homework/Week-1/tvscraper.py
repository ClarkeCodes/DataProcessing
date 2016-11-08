#!/usr/bin/env python
# Name: Eline Jacobse
# Student number: 11136235
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # set up array for tv shows and actors/actresses
    tvseries = []
    actors = []

    # for each show, add data to array tvseries
    for e in dom.by_tag('div.lister-item-content'):
        # store title to array tvseries
        tvseries.append(e.by_tag('a')[0].content.encode('ascii', 'ignore'))
        # add rating to array tvseries
        tvseries.append(float(e.by_tag('span.value')[0].content))
        # add genres to array tvseries
        tvseries.append(e.by_class('genre')[0].content.encode('ascii', 'ignore').strip())
        # add actors to tvseries as one string, seperated by comma
        for a in e.by_tag('p'):
            for actor in a.by_tag('a'):
                actors.append(actor.content.encode('ascii', 'ignore'))
        tvseries.append(', '.join(actors))
        actors = []
        # add runtime to array tvseries
        tvseries.append(int(e.by_class('runtime')[0].content[0:2]))

    return tvseries


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    #for each row, write data for tv-show
    i, j = 0, 5
    for data in range(0, len(tvseries)):
        writer.writerow([tvseries][0][i:j])
        i += 5
        j += 5

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download(cached=True)

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
