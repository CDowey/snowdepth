import React, { useState, useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import bbox from '@turf/bbox'
import MapIcon from './MapIcon'
import L from 'leaflet';
import VT_Boundary from '../assets/VT_Data_-_State_Boundary.json'
import Stations from '../assets/stations.json'
import '../css/App.css';
import ReactDOMServer from 'react-dom/server';

const LeafletMap = (props) => {

    // Markers are going to be built from state
    const [markers, setMarkers] = useState([]);

    // Selected Marker Station ID in state
    const [selectedStationID, setSelectedStationID] = useState()

    const bound_style = () => {
        return {
            weight: 1,
            opacity: 1,
            color: 'grey',
            fillOpacity: 0
        };

    }

    // create map and group refs useRef for functional components
    const mapRef = useRef();
    const stateBoundayRef = useRef();

    //Marker OnClick function
    const handleClick = e => {
        const station_id = e.target.options.station_id
        console.log('click event target id', station_id)
        setSelectedStationID(station_id)
        // Need to trigger function to change the value in the MapInfo through SidePanel state/props from App state/props
        const changeStationParent = props.changeStation
        console.log('click props', changeStationParent)
        changeStationParent(station_id)

    }




    useEffect(() => {
        //Set Marker Locations {station name: {lat: , long: }}
        const stationLocations = []
        for (let [key, value] of Object.entries(Stations)) {

            const station_id = key
            const station_name = Stations[key].station_name

            stationLocations.push(

                {
                    'station_id': station_id,
                    'station_name': station_name,
                    'lat': parseFloat(Stations[key].lat),
                    'long': parseFloat(Stations[key].lon),
                }


            )
        }

        setMarkers(stationLocations)

        // Set selected marker from props from App
        setSelectedStationID(props.station_id)
        console.log('selectedStation', selectedStationID)

        //Example url
        // https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-year&dataTypes=DP01,DP05,DP10,DSND,DSNW,DT00,DT32,DX32,DX70,DX90,SNOW,PRCP&stations=ASN00084027&startDate=1952-01-01&endDate=1970-12-31&includeAttributes=true&format=json
        //        var url = new URL("https://geo.example.org/api"),
        //        params = {lat:35.696233, long:139.570431}
        //    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        //    fetch(url).then(...)
        // https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation

        // const map = this.mapRef.current.leafletElement;
        // const group = this.groupRef.current.leafletElement;
        // map.fitBounds(group.getBounds());

        // Destructure mapRef
        const { current = {} } = mapRef;        // sets it to empty object if mapRef not defined
        const { leafletElement: map } = current;

        // need geojson ref
        const { statebounday = {} } = stateBoundayRef;

        console.log('geojson ref', statebounday)

        // use turf/bbox to get bounding box (I couldn't figure out the GeoJSON refs...for Leaflet)

        const bboxArray = bbox(VT_Boundary);
        const VT_bounds = [
            [bboxArray[1], bboxArray[0]],
            [bboxArray[3], bboxArray[2]]
        ]

        map.fitBounds(VT_bounds)   // This works but doesn't allow for the partial zoom steps like zoomSnap does. 
        // Needs better way for the container to resize based on available space and width/heigh ratio
        console.log('VT bounds', VT_bounds)



        // Use fitBounds to set zoom and extent
        // map.fitBounds(statebounday.getBounds()); https://stackoverflow.com/questions/40451506/react-leaflet-how-to-set-zoom-based-on-geojson

        //API call to get the current snowdepth for all the stations
        const getCurrentDepths = async () => {
            // get station names from stations.json
            const station_names = Object.keys(Stations)


        }

        getCurrentDepths()

    }, [mapRef]);

    // This allows the marker to be dynamic, perhaps reflecting the latest measurement at the site?
    // Would be a lot of requests to get that info unless it is available a different way

    // Grey Border
    const icon = L.divIcon({
        className: 'custom-icon',
        iconAnchor: [10, 10],
        html: ReactDOMServer.renderToString(< MapIcon depth={10} bgColor={'#ffffff00'} strokeColor={'#5F5F5F'} />)
    });

    // Red Border
    const selectedIcon = L.divIcon({
        className: 'custom-icon',
        iconAnchor: [10, 10],
        html: ReactDOMServer.renderToString(< MapIcon depth={10} bgColor={'#0DF109'} strokeColor={'#027A00'} />)
    });





    // const isLoading = markerLocations.length === 0


    return (
        <div className='mapContainer' >
            <div className='mapHeader' >
                Last Reported Snow Depths - Select Marker to view comparison with past seasons.
            </div>
            <Map className='Map'
                ref={mapRef}
                center={[43.89, -72.5]}
                zoom={8}
                // zoomSnap={7.5} //ideally this could be adjusted based on screensize (use fitBounds for this)
                maxZoom={9}
                zoomControl={true}
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
                                icon={selectedIcon}
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
                                icon={icon}
                                onClick={handleClick}
                            >
                                <Popup >
                                    <span > Station Name < br /> {stationobj.station_name} </span>
                                </Popup>
                            </Marker>
                    })
                }
                <GeoJSON
                    ref={stateBoundayRef}
                    key='1'
                    data={VT_Boundary}
                    style={bound_style}
                />
                {/* <TileLayer
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
                    attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                /> */}

            </Map>
        </div >

    );

}

export default LeafletMap;