const express = require('express');
const cors = require('cors')
const fetch = require('node-fetch');
const moment = require('moment')

const app = express()
const port = process.env.PORT || 4000


const corsOptions = {
    origin: true
}

app.options('*', cors())

// Read in station data
const snow_data = require('../assets/snow_data.json');

// Get snow year from date string
const getSnowYear = (date) => {
    //  const date = new Date(date_string)

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


app.get('/:station/data.json', cors(corsOptions), async (req, res) => {

    // Get Station ID from the url
    const station = req.params.station

    // Read in the data from the snow_data.json
    const station_snow_data = snow_data[station]

    // Perform query and append to chartData object with key of current snow year

    // Get current snow-year
    const today = new Date()
    const current_snow_year = getSnowYear(today)
    const daysArray = getDaysArray(new Date('09-01-2019'), new Date('06-30-2020'))



    //     const today = new Date()
    //     const endDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];



    // Calculate Average Depth
    // Get every value
    const transpose = (a) => {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) { return r[c]; });
        });
    }

    // create copy of station_snow_data
    let depth_arrays = Object.values(station_snow_data.chartData)
    let average_season = []
    // transpose
    depth_arrays = transpose(depth_arrays)

    // Calculate average for each day array
    depth_arrays.map(
        array => {
            const average = array.reduce((a, b) => a + b, 0) / array.length
            // ^ is a way of rounding to an int
            average_season.push(average ^ 0);
        }
    )

    // Add Average Season to chartData
    station_snow_data.chartData['Average Season'] = average_season

    // Get Current Season Data

    // Set Up Fetch Request
    const getSnowDepths = async (station) => {

        //const endDate = moment(today).format("YYYY-MM-DD")

        const params = new URLSearchParams({
            dataset: 'daily-summaries',
            stations: station,
            startDate: current_snow_year.substr(0, 4) + '-09-01',
            endDate: moment(today).format("YYYY-MM-DD"),
            dataTypes: 'SNWD',
            units: 'standard',
            includeStationName: 'false',
            format: 'json',

        })


        try {
            const response = await fetch('https://www.ncei.noaa.gov/access/services/data/v1?' + params);
            const json = await response.json();
            return json
        } catch (error) {
            console.log(error);
            return error
        }
    };

    const current_depths_response = await getSnowDepths(station)
    let current_depths = current_depths_response.map(a => parseInt(a.SNWD));

    // Set initial value to 0 and then fill forward to fill any gaps
    current_depths[0] = 0

    for (const [i, value] of current_depths.entries()) {
        if(Number.isNaN(value)) {
            current_depths[i] = current_depths[i-1]
        }
    }

    // Need to add something here so that Feb 29th is filled in with Feb28th value, unless it doesn't exist....

   // for testing with non zero depths
  // current_depths = [0, 2, 3, 9, 12, 12, 12, 14, 14, 0, 0, 2, 3, 20,20,20,20,20,20,20,20,20,20, 0, 2, 3, 9, 12, 12, 12, 14, 14, 0, 0, 2, 3, 20,20,20,20,20,20,20,20,20,20, 0, 2, 3, 9, 12, 12, 12, 14, 14, 0, 0, 2, 3, 20,20,20,20,20,20,20,20,20,20, 0, 2, 3, 9, 12, 12, 12, 14, 14, 0, 0, 2, 3, 20,20,20,20,20,20,20,20,20,6]
   const indexlastmeasurement = current_depths.length

    // To allow for proper calculating averages fill remaining values with nulls
    const nulls = new Array(304 - current_depths.length).fill(null)
    current_depths = current_depths.concat(nulls)

   

    station_snow_data.chartData['Current Season'] = current_depths
    station_snow_data.info['Current_Depth'] = current_depths[indexlastmeasurement-1]
    station_snow_data.info['Average_Depth'] = average_season[indexlastmeasurement-1]

res.json({
    'data': station_snow_data
})
})






////  req.setHeader('Access-Control-Allow-Origin', 'http://localhost:1/')
// Get Station ID from the url
//     const station = req.params.station


//     // req.query for query string

//     // can await ie NOAA node-fetch calls

//     // fs will read 

//     // Write a function here that will for a given station name 
//     // in req.params query for all historic data from year ____ and return
//     // The historic data ready for the plot, current and average snow depth on that date, 
//     // perhaps current depth for marker or that could be 

//     // The best way to access full records is from the Daily Summaries dataset
//     const url = new URL("https://www.ncei.noaa.gov/access/services/data/v1")


//     // Set dates
//     // Start date is Jan 1 1930 since that is the oldest one on record
//     const startDate = "1930-01-01"
//     const today = new Date()
//     const endDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

//     url.search = new URLSearchParams({
//         dataset: 'daily-summaries',
//         stations: station,
//         startDate: startDate,
//         endDate: endDate,
//         dataTypes: 'SNWD', //This is the snowdepth attribute (seems to be in inches)
//         includeAttributes: true,
//         includeStationName: false,
//         includeStationLocation: false,
//         units: 'standard',
//         format: 'json'
//     })

//     // working url https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&stations=USC00435416&startDate=1930-01-01&endDate=2020-07-13&dataTypes=SNWD&includeAttributes=true&includeStationName=false&inclueStationLocation=false&units=standard&format=json

//     const st_ds = await fetch(url);
//     const st_ds_data =  await st_ds.json()

//     // Need to sort the response in to depths for each complete snow-year

//     // Create Empty Data Object with keys like this  "2019-2020"
//     const sorted_st_ds = {}

//     // Create keys with empty arrays?
//     // Get year from first response and last response?
//     const res_start = st_ds_data[0]
//     const res_start_date = new Date(res_start.DATE).getFullYear()
//     const res_start_month = new Date(res_start.DATE).getMonth() + 1

//     // Get snow year function
//     const getSnowYear = (date_string) => {
//         const date = new Date(date_string)

//         if (date.getUTCMonth() + 1 >= 7) {
//             return (date.getUTCFullYear() + '-' + (parseInt(date.getUTCFullYear()) + 1).toString())
//         }
//         else {
//             return ((parseInt(date.getUTCFullYear()) - 1).toString() + '-' + date.getUTCFullYear())
//         }
//     }



//     const daysArray = getDaysArray(new Date('09-01-2019'), new Date('06-30-2020'))

//     // use index of to properly insert values into a list
//     // get month day pair from the response if it has a SNWD
//     // function to apply to each item in response object that builds and inserts (best way to do this??)
//     // The number of elements in the array for each snow year is 304 (this is inclusive number of days from 9/1 to 6/30 with 2/29)


//     const processSnowDepthRes = (res_obj) => {

//         // get snowYear
//         const snowYear = getSnowYear(res_obj.DATE)
//         if (!sorted_st_ds.hasOwnProperty(snowYear)) {
//             sorted_st_ds[snowYear] = new Array(daysArray.length).fill('Unknown')
//         }

//         // get index of month/day in daysArray
//         const date = new Date(res_obj.DATE).toISOString().slice(5, 10)
//         const index = daysArray.indexOf(date)

//         // if res_obj has SNWD property
//         if (res_obj.hasOwnProperty('SNWD')) {
//             sorted_st_ds[snowYear][index] = parseInt(res_obj.SNWD)
//         }
//         else {
//             sorted_st_ds[snowYear][index] = 'Unknown'
//         }

//         return sorted_st_ds





// Endpoint for markers
app.get('/:station/mostrecentdepth.json', async (req, res) => {
    const station = req.params.station

    res.json({
        body: `tested ${station}`
    })
})

app.use('/snowdepths', express.static('../../build'))
app.use('/', express.static('../../build')) // rafael did this, don't do this forever

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))