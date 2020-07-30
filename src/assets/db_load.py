#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul 27 21:42:51 2020

@author: CDowey
"""

import pandas as pd
import psycopg2
from sqlalchemy import create_engine



## Load data from noaa to postgres database

## Get csv file

station = 'USC00435416'

url = f"https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&stations={station}&startDate=1930-01-01&endDate=2020-07-13&dataTypes=SNWD&includeAttributes=true&includeStationName=false&inclueStationLocation=false&units=standard&format=csv"

path = r'/Users/CDowey/github/snowdepth/src/assets/Mansfield_FullData.csv'
df = pd.read_csv(path)



depths = df[['STATION', 'DATE', 'SNWD']].copy()

# Convert mm to in if needed
# depths['SNWD'] = depths['SNWD'] * 0.0393701

#set date to a date type
depths['DATE'] = pd.to_datetime(depths['DATE'])

# change field names to match depths table
depths = depths.rename(
        columns={
                'STATION': 'station_id', 
                'DATE': 'date',
                'SNWD': 'depth_in'
                }
        )

# Need to fill forward and nulls
# Pair it down by filtering between 09-01 and 6-30
months = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6]

# create month col
depths['Month'] = [x.month for x in depths['date']]
depths['Day'] = [x.day for x in depths['date']]
depths = depths[depths['Month'].isin(months)]

# Set rows with Month = 9 and Day = 1 to 0
for index, row in depths.iterrows():
    if ((row['Month'] == 9) and (row['Day'] == 1)):
        depths.loc[index]['depth_in'] = 0
        
# Any custom clean up
depths.loc[index]['depth_in'] = 0
        





# Connect to Db and run inserts
alchemyEngine = create_engine('postgresql+psycopg2://postgres:trek220@localhost/SnowDepths');

postgreSQLConnection = alchemyEngine.connect();
postgreSQLTable = "depths";


depths.to_sql(postgreSQLTable, postgreSQLConnection, if_exists='append', index = False);


postgreSQLConnection.close();

