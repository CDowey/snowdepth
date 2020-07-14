import React, { useState, useEffect } from 'react'
import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';




const MapInfo = (props) => {


    return (
        <div className='MapInfo'>
            {props.station_id}
            <br></br>
            Map-fed station related info here.
            Upon initial load the station should be Mount Mansfield. With the chart loading above and the marker highlighted.
            This card can provide station information including lat, long, elevation, length of the record.
            Current snow depth and average snow depth on the current day.
        </div>
    )
}
 export default MapInfo