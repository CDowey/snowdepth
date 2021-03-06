import React, { useState, useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import bbox from '@turf/bbox'
import MapIcon from './MapIcon'
import L from 'leaflet';
//import esri from 'esri-leaflet';
import VT_Boundary from '../assets/VT_Data_-_State_Boundary.json'
import VT_Mask from '../assets/VT_Mask.json'
//import Stations from '../assets/stations.json'
import Snow_Data from '../assets/snow_data.json'
import '../css/App.css';
import ReactDOMServer from 'react-dom/server';


const LeafletMap = (props) => {

    // Markers are going to be built from state
    const [markers, setMarkers] = useState([]);

    // Selected Marker Station ID in state
    const [selectedStationID, setSelectedStationID] = useState()

    // Snow depths loaded
    const [loaded, setLoaded] = useState(false);

    // Map Center
    const [mapCenter, setMapCenter] = useState([43.89, -72.5])

    // Markers Visible
    const [markerVisible, setMarkerVisible] = useState(props.options.Stations)
    console.log('markers vis', markerVisible)


    const bound_style = () => {
        return {
            weight: 2,
            opacity: 0.5,
            color: 'grey',
            fillOpacity: 0
        };
    }

    const mask_style = () => {
        return {
            weight: 0,
            opacity: 1,
            color: 'white',
            fillOpacity: 1
        };
    }

    // create map and group refs useRef for functional components
    const mapRef = useRef();
    const stateBoundayRef = useRef();
    const stateMask = useRef();

    //Marker OnClick function
    const handleClick = e => {
        const station_id = e.target.options.station_id
        setSelectedStationID(station_id)
        // Need to trigger function to change the value in the MapInfo through SidePanel state/props from App state/props
        const changeStationParent = props.changeStation
        changeStationParent(station_id)
        setMapCenter([43.89, -72.5])
    }

    useEffect(() => {

        // // Get Map options
        // const options = props.options
        // console.log('use effect', options)


        //Set Marker Locations 
        const stationLocations = []

        // Stations with useful records based on consistency and recording interval
        const good_stations = ['USC00435416',
            'USC00432773',
            'US1VTOL0001',
            'USC00435542',
            'USC00430193',
            'USC00434120',
            'US1VTES0003',
            'USC00438169',
            'US1VTOL0009',
            'US1VTLM0007',
            'USC00434290',
            'USC00434261',
            'USC00437607',
            'USW00014742',
            'USC00436391',
            'USW00094705',
            'USC00438556',
            'US1VTAD0020',
            'USC00438640',
            'USC00436335'
        ]



        // Set selected marker from props from App
        setSelectedStationID(props.station_id)


        // API call to get current snowdepth for all stations

        // Create comma separated string of all station ids
        // Get all keys from stations.json



        //Example url
        // https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-year&dataTypes=DP01,DP05,DP10,DSND,DSNW,DT00,DT32,DX32,DX70,DX90,SNOW,PRCP&stations=ASN00084027&startDate=1952-01-01&endDate=1970-12-31&includeAttributes=true&format=json


        const getDailySummaries = async () => {

            const ids = good_stations;

            // Set dates
            const today = new Date();
            const seven_days_before = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

            const startDate = seven_days_before.toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            const endDate = today.toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });

            // console.log('DATES', startDate, endDate)

            // I think the data range should be a week and if they haven't reported in the week prior then show that
            // otherwise find the most recent SNWD value in what is returned

            const url = new URL("https://www.ncei.noaa.gov/access/services/data/v1")

            url.search = new URLSearchParams({
                dataset: 'daily-summaries',
                stations: ids,
                startDate: startDate,
                endDate: endDate,
                dataTypes: 'SNWD',
                includeAttributes: true,
                includeStationName: true,
                includeStationLocation: true,
                units: 'standard',
                format: 'json'
            })

            console.log('fetch url', url)
            const ds_res = await fetch(url);
            const ds_data = await ds_res.json()

            // narrow data down to most recent reading for each station
            // Get results for each station
            let results = ds_data.map(({ STATION, SNWD, DATE }) => ({ STATION, SNWD, DATE }))

            // Create obj for storing most recent depth for each station
            let station_depths = {}

            good_stations.forEach(station => {
                // let station_results = results.find(x => x.STATION === station)
                let station_results = results.map((e) => e.STATION === station ? e.SNWD : null)
                station_results = station_results.filter(x => x != null)
                // console.log('station_results', station_results)

                // if station_results has no results then return 'N/A'
                if (station_results.length === 0) {
                    let last_measurement = ['']
                    station_depths[station] = last_measurement
                }
                else {
                    // get last non null item in array this is the most recent measurement
                    let last_measurement = parseInt(station_results.reduce((acc, curr) => curr ? curr : acc)).toString()
                    station_depths[station] = last_measurement
                }
            });


            // Get result with date closest today? always first or last?

            // console.log('daily_summaries_prior_week', station_depths)

            for (let key of Object.keys(Snow_Data)) {
                if (good_stations.includes(key)) {
                    const station_id = key
                    const station_name = Snow_Data[key].info.Station_Name
                    const lat = Snow_Data[key].location.Latitude
                    const long = Snow_Data[key].location.Longitude
                    const depth = station_depths[key]

                    stationLocations.push(
                        {
                            'station_id': station_id,
                            'station_name': station_name,
                            'lat': lat,
                            'long': long,
                            'depth': depth
                        }
                    )
                }
            }

            
            setMarkers(stationLocations)
            setLoaded(true)
            setMapCenter([43.89, -72.5])
        }

        setMarkerVisible(props.options.Stations)
        getDailySummaries()

        // LAT AND LONG from the daily summaries might be more precise! 4 dec

        // fetch(url)        //    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        //    fetch(url).then(...)
        // https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation

        //  https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&stations=USC00435416&startDate=2020-06-07&endDate=2020-06-14&&
        //format=json&&includeAttributes=true&includeStationName=true&includeStationLocation=true&units=standard
        //      unsupported dataset daily-snow
        //         daily-summaries works and has the attribute SNWD which is Snow Depth in inches

        // const map = this.mapRef.current.leafletElement;
        // const group = this.groupRef.current.leafletElement;
        // map.fitBounds(group.getBounds());

        // Destructure mapRef
        const { current = {} } = mapRef;        // sets it to empty object if mapRef not defined
        const { leafletElement: map } = current;

        // need geojson ref
        const { statebounday = {} } = stateBoundayRef;

        // console.log('geojson ref', statebounday)

        // use turf/bbox to get bounding box (I couldn't figure out the GeoJSON refs...for Leaflet)

        const bboxArray = bbox(VT_Boundary);
        const VT_bounds = [
            [bboxArray[1], bboxArray[0]],
            [bboxArray[3], bboxArray[2]]
        ]

        map.fitBounds(VT_bounds)   // This works but doesn't allow for the partial zoom steps like zoomSnap does. 
        // Needs better way for the container to resize based on available space and width/heigh ratio

        setMapCenter([43.89, -72.5])

        // Use fitBounds to set zoom and extent
        // map.fitBounds(statebounday.getBounds()); https://stackoverflow.com/questions/40451506/react-leaflet-how-to-set-zoom-based-on-geojson

        //API call to get the current snowdepth for all the stations
        // const getCurrentDepths = async () => {
        //     // get station names from stations.json
        //     const station_names = Object.keys(Stations)


        // }

        // getCurrentDepths()

    }, [mapRef, props.station_id, selectedStationID, props.options]);

    // This allows the marker to be dynamic, perhaps reflecting the latest measurement at the site?
    // Would be a lot of requests to get that info unless it is available a different way

    // number of digits
    const numDigits = (x) => {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    // function for calc x position
    const calc_xpos = (depth) => {
        // get length of string to set xpos
        const len = numDigits(depth)

        if (len === 1) {
            return '43%'
        }
        if (len === 2) {
            return '37%'
        }
        if (len === 3) {
            return '30%'
        }
    }

    // Grey Border
    const icon = (depth) => {

        const xpos = calc_xpos(depth)

        return (L.divIcon({
            className: 'custom-icon',
            iconAnchor: [10, 10],
            html: ReactDOMServer.renderToString(< MapIcon depth={depth}
                xpos={xpos}
                bgColor={'#ffffff00'}
                strokeColor={'#202020'} />)
        }))
    }

    // Red Border
    const selectedIcon = (depth) => {

        const xpos = calc_xpos(depth)

        return (L.divIcon({
            className: 'custom-icon',
            iconAnchor: [10, 10],
            html: ReactDOMServer.renderToString(< MapIcon depth={depth}
                xpos={xpos}
                bgColor={'#ffffff00'}
                strokeColor={'#4A81FF'}
                stroke={10}
                textColor={'blue'}
            />)
        }))
    };



    return (
        <div className='mapContainer' >

            <Map className='Map'
                ref={mapRef}
                center={mapCenter}
                zoom={8}
                // zoomSnap={7.5} //ideally this could be adjusted based on screensize (use fitBounds for this)
                maxZoom={8}
                minZoom={8}
                zoomControl={false}
                attributionControl={false} >
                {
                    markers.map((stationobj, idx) => {
                        // Tunery Operator within the map was the only way I could get this to work with two diff markers
                        // could also change marker size..
                        return stationobj.station_id === selectedStationID ?
                            < Marker key={`marker-${stationobj.station_name}`}
                                station_id={stationobj.station_id}
                                station_name={stationobj.station_name}
                                position={[stationobj.lat, stationobj.long]}
                                opacity={markerVisible? 100 : 0}
                                icon={selectedIcon(stationobj.depth)}
                                onClick={handleClick}
                            >
                                <Popup >
                                    <span > Station Name < br /> {stationobj.station_name} </span>
                                </Popup>
                            </Marker>

                            :

                            < Marker key={`${stationobj.station_name}`}
                                station_id={stationobj.station_id}
                                station_name={stationobj.station_name}
                                position={[stationobj.lat, stationobj.long]}
                                opacity={markerVisible? 100 : 0}
                                icon={icon(stationobj.depth)}
                                onClick={handleClick}
                            >
                                <Popup >
                                    <span > Station Name < br /> {stationobj.station_name} </span>
                                </Popup>
                            </Marker>
                    })
                }


                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />


                <GeoJSON
                    ref={stateBoundayRef}
                    key='1'
                    data={VT_Boundary}
                    style={bound_style}
                />
                <GeoJSON
                    ref={stateMask}
                    key='2'
                    data={VT_Mask}
                    style={mask_style}
                />

            </Map>
            <div className='mapHeader' >
                {loaded
                    ?
                    <div>
                        <div className='mapHeader-header'>Last Reported Snow Depths</div>
                        <div>Select Marker to view comparison with past seasons.</div>
                        <div>If marker is blank, no Snow Depth Report is available in past 7 days.</div>
                    </div>
                    :
                    <div>Loading Last Reported Snow Depths</div>
                }
            </div>
        </div >

    );

}

export default LeafletMap;