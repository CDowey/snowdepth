const express = require('express')
const fetch = require('node-fetch');

// const ___ = require(rfp)
const app = express()
const port = 4000


app.get('/:station/data.json', async (req, res) => {

    // Get Station ID from the url
    const station = req.params.station


    // req.query for query string

    // can await ie NOAA node-fetch calls

    // fs will read 

    // Write a function here that will for a given station name 
    // in req.params query for all historic data from year ____ and return
    // The historic data ready for the plot, current and average snow depth on that date, 
    // perhaps current depth for marker or that could be 

    // The best way to access full records is from the Daily Summaries dataset
    const url = new URL("https://www.ncei.noaa.gov/access/services/data/v1")


    // Set dates
    // Start date is Jan 1 1930 since that is the oldest one on record
    const startDate = "1930-01-01"
    const today = new Date()
    const endDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];

    url.search = new URLSearchParams({
        dataset: 'daily-summaries',
        stations: station,
        startDate: startDate,
        endDate: endDate,
        dataTypes: 'SNWD', //This is the snowdepth attribute (seems to be in inches)
        includeAttributes: true,
        includeStationName: false,
        includeStationLocation: false,
        units: 'standard',
        format: 'json'
    })
    

    const st_ds = await fetch(url);
    const st_ds_data = await st_ds.json()

    // Need to sort the response in to depths for each complete snow-year

    // Create Empty Data Object with keys like this  "2019-2020"
    const sorted_st_ds = {}

    // Create keys with empty arrays?
    // Get year from first response and last response?
    const res_start = st_ds_data[0]
    const res_start_date = new Date(res_start.DATE).getFullYear()
    const res_start_month = new Date(res_start.DATE).getMonth() + 1

    // Get snow year function
    const getSnowYear = (date_string) => {
        const date = new Date(date_string)

        if(date.getUTCMonth() + 1 >= 7){
            return (date.getUTCFullYear()+ '-' +  (parseInt(date.getUTCFullYear()) + 1).toString())
        }
        else{
            return ((parseInt(date.getUTCFullYear()) - 1).toString() + '-' + date.getUTCFullYear())
        }
    }


    const res_end = st_ds_data[st_ds_data.length - 1]

    // The number of elements in the array for each snow year is 304 (this is inclusive number of days from 9/1 to 6/30 with 2/29)






    debugger


    res.json({
        data: station,
        station_data: st_ds_data
    })

})

// Endpoint for markers
app.get('/:station/mostrecentdepth.json', async (req, res) => {

})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))