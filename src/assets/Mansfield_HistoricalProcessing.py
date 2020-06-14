# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

# Ned to read in csv of historic data into dicts/json objects

import pandas as pd
import json

fp = r'/Users/CDowey/github/snowdepth/src/assets/MansfieldHistoicSnowDepth.csv'

df = pd.read_csv(fp).set_index('year').T

# Get array in order for each year and build dict
vals = {}

for col in df.columns:
    # Some of the years have nulls values, I am going to fill these with prior value..
    l = list(df[col].replace(to_replace=None, method='ffill'))
    # If the first value is missing set it to zero
   # l = [0 if v is None else v for v in l]

    
    vals[col] = l
    
    
with open('MansfieldHistoric.json', 'w') as json_fp:
    json.dump(vals, json_fp)


