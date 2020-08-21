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


    useEffect(() => {

    }, []);



  //  const { county, date_range, elevation, stationID, stationName } = props.MapInfoData

    return (
        <div className='MapInfo'>
            {reformatName(props.mapInfoData.Station_Name)}
            <br></br>
            <table className='mapStationTable'>
                <tbody>
                    <tr>                        <td>
                        <span className='stationAttributeName'>Station: </span>
                        <span className='stationAttributeValue'>{props.mapInfoData.Station_ID}</span>
                    </td>

                        <td>
                            <span className='stationAttributeName'>Current Date: </span>
                            <span className='stationAttributeValue'>__/__/__</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className='stationAttributeName'>Elevation: </span>
                            {/* <span className='stationAttributeValue'>{elevation} ft</span> */}
                        </td>
                        <td>
                            <span className='currentSnowDepthName'>Current Snow Depth: </span>
                            <span className='currentSnowDepthAttribute'>___ in</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className='stationAttributeName'>County: </span>
                            {/* <span className='stationAttributeValue'>{county}</span> */}
                        </td>
                        <td>
                            <span className='avgSnowDepthName'>Average Snow Depth: </span>
                            <span className='avgSnowDepthAttribute'>___ in</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default MapInfo