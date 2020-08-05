#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Aug  3 18:56:55 2020

@author: CDowey
"""

import pandas as pd
import json

# Read in all csv's to single dataframe

paths = [
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236308.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236310.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236311.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236313.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236314.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236318.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236319.csv',
        '/Users/CDowey/github/snowdepth/src/assets/orders/2236321.csv'
        ]

df = pd.DataFrame()

for path in paths:
    path_df = pd.read_csv(path, usecols = ['STATION', 'LATITUDE', 'LONGITUDE', 'DATE', 'SNWD'])
    df = df.append(path_df)
    
df['DATE']= pd.to_datetime(df['DATE'])

# Get list of unique stations
stations = list(set(df['STATION']))

# create dict/JSON object with all data

snow_data = {key: {
        'chartData': {},
        'location': {},
        'info': {}
        } for key in stations} 



# Examine data for station USC00431580
station_data = df #[df['STATION']==stations[0]]

# Drop rows with SNWD as Null and dates outside 9-01 to 6-31 (304 days if leap year)
start_date = pd.to_datetime('09-01-2019', format='%m-%d-%Y').date()
end_date = pd.to_datetime('06-30-2020', format='%m-%d-%Y').date()
date_tuples = [(x.date().month, x.date().day) for x in list(pd.date_range(start_date, end_date,freq='d'))]

station_data = station_data.dropna(subset=['SNWD'])
station_data.reset_index(drop=True, inplace=True)

# filter for months Sept to June
months = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6]
station_data = station_data[station_data['DATE'].dt.month.isin(months)]

# filter for years that appear at least 100 times
year_counts = station_data['DATE'].dt.year.value_counts()
year_counts = year_counts[year_counts >= 100]
years = list(year_counts.index)
years.sort()

station_data = station_data[station_data['DATE'].dt.year.isin(years)]

# build dates array for snow depths years that meet above criteria
for index, row in station_data.iterrows():
    
    # The key in the dict is going to be the station ID
    key = row['STATION']
    
    # Get snow year (format "2012-2013")
    month = row['DATE'].month
    year = row['DATE'].year
    
    if month > 6:
        snow_year = str(year) + '-' + str(year+1)
    else:
        snow_year = str(year-1) + '-' + str(year)
        
    # get index where value goes in array for snow year
    date_tuple = (row['DATE'].date().month, row['DATE'].date().day)
    year_index = date_tuples.index(date_tuple)
        
    # Check if snow_year exists as a key in chartData
    # if so insert in proper place in array
    # if not create it as a list of None with length 304 then insert
    if snow_year in snow_data[key]['chartData']:
        snow_data[key]['chartData'][snow_year][year_index] = int(row['SNWD'])
    else:
        snow_data[key]['chartData'][snow_year] = [None] * 304
        snow_data[key]['chartData'][snow_year][0] = 0
        snow_data[key]['chartData'][snow_year][year_index] = int(row['SNWD'])
        
# Fill forward for each snow_year and station
        
        
        
        
        
        
# Fill in locations
for station in stations:
    # get first row with with that station
    station_row = df[df['STATION'] == station].reset_index().iloc[0]
    Lat = station_row['LATITUDE']
    Long = station_row['LONGITUDE']
    
    snow_data[station]['location'] = {
            'Latitude': Lat,
            'Longitude': Long
            }
    
    print(station, Lat, Long)
    
# Fill in station info
    
# read in station json where there was other station data assembled

with open("/Users/CDowey/github/snowdepth/src/assets/station_details.json", "r") as read_file:
    stations_json = json.load(read_file)
    
for station in stations:
    if station in stations_json:
        
        start_year = list(snow_data[station]['chartData'].keys())[0].split('-')[0]
        date_range = str(start_year) + ' - Present'
        
        
        snow_data[station]['info'] = {'Station_Name': stations_json[station]['Station_Name'],
                                        'Station_ID': station,
                                        'Date_Range': date_range,
                                        'Elevation': stations_json[station]['Elevation'],
                                        'County': stations_json[station]['County']
                                        }


    else:
        snow_data[station]['info'] = {'Station_Name': '',
                                        'Station_ID': station,
                                        'Date_Range': '',
                                        'Elevation': '',
                                        'County': ''
                                        }
# Export to json
        

    
    
    
