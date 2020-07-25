const express = require('express');
const cors = require('cors')
const fetch = require('node-fetch');

const app = express()
const port = 4000

const corsOptions = {
    origin: true
}

app.options('*', cors())


app.get('/:station/data.json', cors(corsOptions), async (req, res) => {

  ////  req.setHeader('Access-Control-Allow-Origin', 'http://localhost:1/')
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
    const endDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

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

        if (date.getUTCMonth() + 1 >= 7) {
            return (date.getUTCFullYear() + '-' + (parseInt(date.getUTCFullYear()) + 1).toString())
        }
        else {
            return ((parseInt(date.getUTCFullYear()) - 1).toString() + '-' + date.getUTCFullYear())
        }
    }

    // Get snow depth value index for given snow-year based on date
    const getDaysArray = (start, end) => {
        for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt).toISOString().slice(5, 10));
        }
        return arr;
    };

    const daysArray = getDaysArray(new Date('09-01-2019'), new Date('06-30-2020'))

    // use index of to properly insert values into a list
    // get month day pair from the response if it has a SNWD
    // function to apply to each item in response object that builds and inserts (best way to do this??)
    // The number of elements in the array for each snow year is 304 (this is inclusive number of days from 9/1 to 6/30 with 2/29)


    const processSnowDepthRes = (res_obj) => {

        // get snowYear
        const snowYear = getSnowYear(res_obj.DATE)
        if (!sorted_st_ds.hasOwnProperty(snowYear)) {
            sorted_st_ds[snowYear] = new Array(daysArray.length).fill('Unknown')
        }

        // get index of month/day in daysArray
        const date = new Date(res_obj.DATE).toISOString().slice(5, 10)
        const index = daysArray.indexOf(date)

        // if res_obj has SNWD property
        if (res_obj.hasOwnProperty('SNWD')) {
            sorted_st_ds[snowYear][index] = parseInt(res_obj.SNWD)
        }
        else {
            sorted_st_ds[snowYear][index] = 'Unknown'
        }

        return sorted_st_ds

    }

    // const processed_data = [processSnowDepthRes(st_ds_data[0]), processSnowDepthRes(st_ds_data[1])]

    // Iterate through the response and 'apply' processSnowDepthRes to each object in array
    st_ds_data.map(processSnowDepthRes)

    // Fill in intial zero and then fill in forward through nulls, and 'M's


    for (const [key, value] of Object.entries(sorted_st_ds)) {
        const depth_array = value
        //set intial value to zero
        depth_array[0] = 0

        depth_array.forEach((item, i) => {
            if ((item === 'Unknown') || (item == null)) {
                depth_array[i] = depth_array[i - 1];
            };
        })

        sorted_st_ds[key] = depth_array
    }

    // Might need to change the above or check for all 0 arrays...


    res.json({
        station_id: station,
        station_data: sorted_st_ds
    })

})

// Endpoint for markers
app.get('/:station/mostrecentdepth.json', async (req, res) => {

})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))