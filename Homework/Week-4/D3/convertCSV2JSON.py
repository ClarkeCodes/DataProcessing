# Name: Eline Jacobse
# Student number: 11136235

'''
Program that imports a csv file with data and saves it as a JSON file
'''

import csv
import json

csvfile = open('toerisme-utrecht.csv', 'r')

# add field names to the columns and parse JSON data
reader = csv.DictReader(csvfile)
out = json.dumps([row for row in reader], sort_keys=False, indent=4, separators=(',', ': '), ensure_ascii=False)

# output the JSON file
f = open('toerisme-utrecht.json', 'w')
f.write(out)
