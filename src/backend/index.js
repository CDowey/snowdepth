const express = require('express');
const cors = require('cors')
const fetch = require('node-fetch');
const moment = require('moment');
const path = require('path');
const app = express()
const port = process.env.PORT || 4000  //4000


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

    // Where statistics are calculated
    let average_season = []
    let median_season = []
    let average_plus_onesd = []
    let average_minus_onesd = []
    let average_plus_twosd = []
    let average_minus_twosd = []

    // define statistical functions
    const median = (arr) => {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };

    const standardDeviation = (array) => {
        const n = array.length
        const mean = array.reduce((a, b) => a + b) / n
        return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    }


    // transpose
    depth_arrays = transpose(depth_arrays)

    // Calculate average for each day array
    depth_arrays.map(
        array => {

            // Average
            const average_val = array.reduce((a, b) => a + b, 0) / array.length
            // ^ is a way of rounding to an int
            average_season.push(average_val ^ 0);

            // Median
            const median_val = median(array)
            median_season.push(median_val)

            // Standard Deviations
            const standardDeviation_val = standardDeviation(array)

            const avg_plus_onesd_corrected = ((average_val + standardDeviation_val) > 0) ?
                (average_val + standardDeviation_val) : 0
            average_plus_onesd.push(avg_plus_onesd_corrected ^ 0)

            const avg_minus_onesd_corrected = ((average_val - standardDeviation_val) > 0) ?
                (average_val - standardDeviation_val) : 0
            average_minus_onesd.push(avg_minus_onesd_corrected ^ 0)

            const avg_plus_twosd_corrected = ((average_val + (2 * standardDeviation_val)) > 0) ?
                (average_val + (2 * standardDeviation_val)) : 0
            average_plus_twosd.push(avg_plus_twosd_corrected ^ 0)

            const avg_minus_twosd_corrected = ((average_val - (2 * standardDeviation_val)) > 0) ?
                (average_val - (2 * standardDeviation_val)) : 0
            average_minus_twosd.push(avg_minus_twosd_corrected ^ 0)

            // average_minus_onesd.push(average_val - standardDeviation_val)
            // average_plus_twosd.push(average_val + (standardDeviation_val*2))
            // (average_val - (standardDeviation_val*2)) > 0 ? average_minus_twosd.push(average_val - (standardDeviation_val*2)) : average_minus_twosd.push(0)
            // //average_minus_twosd.push(average_val - (standardDeviation_val*2))

        }
    )

    // Add Season statistics to chartData
    station_snow_data.chartData['Average Season'] = average_season
    station_snow_data.chartData['Median Season'] = median_season
    station_snow_data.chartData['SD_plus Season'] = average_plus_onesd
    station_snow_data.chartData['SD_minus Season'] = average_minus_onesd
    station_snow_data.chartData['SD_twoplus Season'] = average_plus_twosd
    station_snow_data.chartData['SD_twominus Season'] = average_minus_twosd


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

    let current_depths_response = await getSnowDepths(station)

    // If you get a bad response it will be an object
    if (typeof current_depths_response === 'object' && current_depths_response !== null && !Array.isArray(current_depths_response)
    ){
        current_depths = []
    } else {
        let current_depths = current_depths_response.map(a => parseInt(a.SNWD));
    }

    // Set initial value to 0 and then fill forward to fill any gaps
    current_depths[0] = 0

    for (const [i, value] of current_depths.entries()) {
        if (Number.isNaN(value)) {
            current_depths[i] = current_depths[i - 1]
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
    station_snow_data.info['Current_Depth'] = current_depths[indexlastmeasurement - 1]
    station_snow_data.info['Average_Depth'] = average_season[indexlastmeasurement - 1]

    res.json({
        'data': station_snow_data
    })
})







// Endpoint for markers
app.get('/:station/mostrecentdepth.json', async (req, res) => {
    const station = req.params.station

    res.json({
        body: `tested ${station}`
    })
})
const buildpath = path.join(__dirname, '..', '..', 'build')
app.use('/snowdepths', express.static(buildpath))
app.use('/', express.static(buildpath)) // rafael did this, don't do this forever

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))