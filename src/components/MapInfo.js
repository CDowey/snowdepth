import React, { useState, useEffect } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stations from '../assets/stations.json'


const reformatName = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};




const MapInfo = (props) => {

    const station_id = props.station_id

    const station_info = Stations[station_id]

    const { station_name, lat, long, state, county, elev, date } = station_info

    return (
        <div className='MapInfo'>
            {reformatName(station_name)}
            <br></br>
            <table className='mapStationTable'>
                <tr>
                    <td>
                        <span className='stationAttributeName'>Elevation: </span><span className='stationAttributeValue'>{elev}'</span>
                    </td>
                    <td>
                        <span className='stationAttributeName'>Current Date: </span><span className='stationAttributeValue'>__/__/__</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className='stationAttributeName'>Station: </span><span className='stationAttributeValue'>{station_id}</span>
                    </td>
                    <td>
                        <span className='stationAttributeName'>Current Snow Depth: </span><span className='stationAttributeValue'>___ inches</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className='stationAttributeName'>County: </span><span className='stationAttributeValue'>{county}</span>
                    </td>
                    <td>
                        <span className='stationAttributeName'>Current Snow Depth: </span><span className='stationAttributeValue'>___ inches</span>
                    </td>
                </tr>
            </table>
        </div>
    )
}
export default MapInfo