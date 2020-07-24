import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import LineChart from './LineChart';
import NavPanel from './NavPanel';
import MapInfo from './MapInfo'
import mansfieldHistoric from '../assets/MansfieldHistoric.json';

const SidePanel = (props) => {

    // Set up moment for dates

    //useState to set state and functions for changing state
    //   const [hasError, setError] = useState(false);
    const [station, setStation] = useState(props.station_id) //not sure if best to set this from props here, but doing it first in useEffect didn't seem to work
    const [data, setdata] = useState({ dates: [], depths: [] });
    const [historicdata, setHistoricData] = useState([]);
    console.log('data', data)

    const historicsnowdepths = mansfieldHistoric

    console.log('snowdepths', data.depths)
    console.log('dates', data.dates)

    // to use useEffect similar to ComponentDidMount pass second argument of an array 
    useEffect(() => {

        // Set station id from props
      //  setStation(props.station_id)


        // Set up abort controller for clean up https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
        const abortController = new AbortController();

        const moment = extendMoment(Moment);
        const [startDate, endDate] = ['2019-09-01', '2020-06-30']

        const range = moment().range(startDate, endDate) /*can handle leap year*/
        const dateArray = []
        Array.from(range.by("days")).map(m => {
            dateArray.push(m.format("MMM Do"))
        });;

        //
        // Create array of dataset opbjects to pass to Line chart
        // historicsnowdepths.forEach(item => {
        //     console.log('item', item)
        // })
        const gatherHistoricData = () => {
            const historicdatasets = []

            for (let [key, value] of Object.entries(historicsnowdepths)) {

                const dataset = {
                    label: key,
                    data: value,
                    backgroundColor: 'rgba(27,27,27, 0.6)',
                    borderColor: 'rgba(27,27,27, .15)',
                    pointRadius: 0,
                    lineTension: 0.5,
                    borderWidth: 1,
                    fill: false
                }

                if (key === 'Average Season') {
                    dataset['borderColor'] = 'rgba(230, 76, 76, 0.9)'
                    dataset['borderWidth'] = 2
                }
                historicdatasets.push(dataset)
            }
            return historicdatasets
        }

        const gatheredhistoricdata = gatherHistoricData()
        setHistoricData(gatheredhistoricdata)
        console.log('historicdata state', historicdata)
        //     setHistoricData(historicdata) this function to set the state neverworked...dunno why but the above does??

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
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '05.json',
                'https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/VT-snow-depth-' + nextyear.toString() + '06.json'

            ]

            return url_array
        }
        

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

        }

        fetchData(station);

        // Clean up
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <div className='sidePanel'>
            <div className='chartContainer'>
                {/* * Use this conditional statement to change what is return based on isLoading */}
                {/* {isLoading
                ? 'loading'
                : <LineChart data={snowdepths} />
                } */}
                <LineChart className='lineChart'
                    historicdata={historicdata}
                    data={data} />
            </div>
            <MapInfo station_id={props.station_id}/>
            <NavPanel className='NavPanel'/> 
        </div>

    );
};

export default SidePanel;