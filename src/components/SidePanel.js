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
    const [data, setData] = useState({ dates: [], data: {} });




    // to use useEffect similar to ComponentDidMount pass second argument of an array 
    useEffect(() => {

        const fetchData = async (site) => {

            const url_prefix = 'http://localhost:4000/'
            const url = url_prefix + site + '/data.json'
            const res = await fetch(url);
            setData({ dates: [], data: res.json() })
            console.log('res', res)
        }

        fetchData(station);

        console.log(data)
    });

    return (
        <div className='sidePanel'>
            <div className='chartContainer'>
                {/* * Use this conditional statement to change what is return based on isLoading */}
                {/* {isLoading
                ? 'loading'
                : <LineChart data={snowdepths} />
                } */}
                <LineChart className='lineChart'
                    data={data} />
            </div>
            <MapInfo station_id={props.station_id} />
            <NavPanel className='NavPanel' />
        </div>

    );
};

export default SidePanel;