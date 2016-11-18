#!/usr/bin/env python
# Name: Eline Jacobse
# Student number: 11136235

'''
Program that imports a csv file with data and saves it as a JSON file
'''

import csv
import json

csvfile = open('data.csv', 'r')

# Change each fieldname to the appropriate field name
reader = csv.DictReader(csvfile, fieldnames = ("country", "per_thousand", "refugees"))
# Parse the CSV into JSON 
out = json.dumps([row for row in reader], sort_keys=False, indent=4, separators=(',', ': '), ensure_ascii=False)
# Save the JSON
f = open('data.json', 'w')
f.write(out)
