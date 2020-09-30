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

    // Destructure Props
    let { Average_Depth, County, Current_Depth, Date_Range, Elevation, Station_ID, Station_Name } = props.mapInfoData

    // Build Station URL
    const Station_URL = 'https://www.ncdc.noaa.gov/cdo-web/datasets/GHCND/stations/GHCND:' + Station_ID + '/detail'

    return (
        <div className='MapInfo'>
            {reformatName(Station_Name)}
            <br></br>
            <table className='mapStationTable'>
                <tbody>
                    <tr>                        <td>
                        <span className='stationAttributeName'>Station: </span>
                        <span className='stationAttributeValue'><a href={Station_URL} target="_blank" rel="noopener noreferrer">{Station_ID}</a></span>
                    </td>
                        <td>
                            <span className='stationAttributeName'>Current Snow Depth: </span>
                            <span className='currentSnowDepthAttribute'>{Current_Depth} in</span>
                        </td>

                    </tr>
                    <tr>
                        <td>
                            <span className='stationAttributeName'>Elevation: </span>
                            <span className='stationAttributeValue'>{Elevation} ft</span>
                        </td>
                        <td>
                            <span className='stationAttributeName'>Average Depth On This Date: </span>
                            <span className='avgSnowDepthAttribute'>{Average_Depth} in</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className='stationAttributeName'>County: </span>
                            <span className='stationAttributeValue'>{reformatName(County)}</span>
                        </td>
                        <td>
                            <span className='stationAttributeName'>Available Date Range: </span>
                            <span className='stationAttributeValue'>{Date_Range}</span>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default MapInfo