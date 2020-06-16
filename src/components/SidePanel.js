import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import LineChart from './LineChart';
import mansfieldHistoric from '../assets/MansfieldHistoric.json'

const SidePanel = () => {

    // Set up moment for dates

    //useState to set state and functions for changing state
    const [hasError, setError] = useState(false);
    const [snowdepths, setsnowdepths] = useState([]);

    const historicsnowdepths = mansfieldHistoric

    // Create array of dates from Sept 1 to May 31st
    // const getDates = (startDate, stopDate) => {
    //     var dateArray = [];
    //     var currentDate = moment(startDate);
    //     var endDate = moment(stopDate);
    //     while (currentDate <= endDate) {
    //         dateArray.push( moment(currentDate).format('MM-DD') )
    //         currentDate = moment(currentDate).add(1, 'days');
    //     }
    //     return dateArray;
    // }

    const getDaysArray = function (s, e) { for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) { a.push(new Date(d)); } return a; };




    // Create array of dataset opbjects to pass to Line chart
    const historicdatasets = []

    // {
    //     label: year,
    //     data: depthsfor that year,
    //     backgroundColor: 'rgba(27,27,27, 0.6)'
    //   }

    console.log('historic', historicsnowdepths)

    // Use this variable to determine if snowdepths has been updated
    // an indicator that the api response was resolved
    const isLoading = snowdepths.length === 0
    console.log('isLoading', isLoading)
    console.log('snowdepths', snowdepths)


    // to use useEffect similar to ComponentDidMount pass second argument of an array 
    useEffect(() => {
        // Set up abort controller for clean up https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
        const abortController = new AbortController();

        const moment = extendMoment(Moment);
        const [startDate, endDate] = ['2019-09-01', '2020-05-31']

        const range = moment().range(startDate, endDate) /*can handle leap year*/
        const dateArray = []
        Array.from(range.by("days")).map(m => {
            dateArray.push(m.format("MMM Do"))
        });; 

        // Need to figure out how to handle Feb 29
        // On non-leap year just assign it the value of Feb 28

        // Build urls
        const buildUrls = (year) => {
            const nextyear = year + 1
            const url_array = [
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + year.toString() + '09.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + year.toString() + '10.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + year.toString() + '11.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + year.toString() + '12.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '01.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '02.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '03.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '04.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '05.json'
            ]

            return url_array
        }

        console.log(buildUrls(2019))

        // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
        const asyncForEach = async (array, callback) => {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        const fetchData = async (site, year) => {

            // I want all the api calls to happen in parallel
            // I could write a generic function and then pass an array of urls
            // Goal is to append a single list
            const urls = buildUrls(year)

            let processed_data = []

            // Needs to be async so we can use await within and we need to use
            // asyncForEach
            const urlsForEach = async () => {
                await asyncForEach(urls, async (url) => {
                    const month_res = await fetch(url, { signal: abortController.signal });
                    const month_data = await month_res.json()
                    // site comes from function parameter
                    const mans_month_data = month_data.data[site]
                    console.log('mmd', mans_month_data)

                    // get starting date
                    const year = mans_month_data.date.substring(0, 4);
                    const month = '0' + (parseInt(mans_month_data.date.substring(4, 6)) - 1).toString()

                    for (const [day, depth] of Object.entries(mans_month_data.values)) {
                        let row = {
                            'date': new Date(year, month, day),
                            'depth': depth
                        }

                        processed_data.push(row)
                    }
                });
            }

            // need to await for all promises to resolve
            await urlsForEach();

            // Fill in missing values
            for (const [i, { date, depth }] of processed_data.entries()) {
                if (depth === 'M') {
                    processed_data[i].depth = processed_data[i - 1].depth
                }
            }

            console.log(processed_data.length)
            setsnowdepths(processed_data)
        }

        fetchData('USC00435416', 2017);

        // Clean up
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <div>
            {/* Use this conditional statement to change what is return based on isLoading */}
            {/* {isLoading
                ? 'loading'
                : <LineChart data={snowdepths} />
            } */}
            <LineChart data={snowdepths} />

        </div>

    );
};

export default SidePanel;