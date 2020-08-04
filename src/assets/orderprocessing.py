#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Aug  3 18:56:55 2020

@author: CDowey
"""

import pandas as pd

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
    path_df = pd.read_csv(path, usecols = ['STATION', 'DATE', 'SNWD'])
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
station_data = df[df['STATION']==stations[0]]

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
for index, row in station_data.iloc[0:1].iterrows():
    
    # get index where value goes in array for snow year
    date_tuple = (row['DATE'].date().month, row['DATE'].date().day)
    year_index = date_tuples.index(date_tuple)

    print(year_index)
    
    
    



chartDate = {}









