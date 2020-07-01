import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import MapIcon from './MapIcon'
import L from 'leaflet';
import VT_Boundary from '../assets/VT_Data_-_State_Boundary.json'
import Stations from '../assets/stations.json'
import '../css/App.css';
import ReactDOMServer from 'react-dom/server';

const LeafletMap = () => {

    const [markers, setMarkers] = useState([]);

    const bound_style = () => {
        return {
            weight: 2,
            opacity: 1,
            color: 'black',
            fillOpacity: 0
        };

    }
    useEffect(() => {
        //Set Marker Locations
        const locations = []
        for (let [key, value] of Object.entries(Stations)) {
            locations.push([parseFloat(Stations[key].lat), parseFloat(Stations[key].lon)])
        }

        setMarkers(locations)

        //Example url
        // https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-year&dataTypes=DP01,DP05,DP10,DSND,DSNW,DT00,DT32,DX32,DX70,DX90,SNOW,PRCP&stations=ASN00084027&startDate=1952-01-01&endDate=1970-12-31&includeAttributes=true&format=json
        //        var url = new URL("https://geo.example.org/api"),
        //        params = {lat:35.696233, long:139.570431}
        //    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        //    fetch(url).then(...)


        //API call to get the current snowdepth for all the stations
        const getCurrentDepths = async () => {

        }

    }, []);

    // This allows the marker to be dynamic, perhaps reflecting the latest measurement at the site?
    // Would be a lot of requests to get that info unless it is available a different way
    const icon = L.divIcon({
        className: 'custom-icon',
        iconAnchor: [10, 10],
        html: ReactDOMServer.renderToString(< MapIcon depth={10}
        />)
    });


    // const isLoading = markerLocations.length === 0

    return (
        <div className='mapContainer' >
            <div className='mapHeader' >
                Last Reported Snow Depths - Select Marker to view comparison with past seasons.
            </div>
            <Map className='Map'
            center={[43.89, -72.5]}
                zoom={8}
                maxZoom={9}
                zoomControl={false}
                attributionControl={false} > {
                    markers.map((position, idx) =>
                        <Marker key={`marker-${idx}`}
                            position={position}
                            icon={icon} >
                            <Popup >
                                <span > Test Pop up < br /> Easily customizable. </span>
                            </Popup>
                        </Marker>
                    )
                }
                <GeoJSON
                    key='1'
                    data={VT_Boundary}
                    style={bound_style}
                />
                <TileLayer
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
                    attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

            </Map>
        </div>

    );

}

export default LeafletMap;