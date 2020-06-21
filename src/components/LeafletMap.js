import React from 'react';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import VT_Boundary from '../assets/VT_Data_-_State_Boundary.json'
import Stations from '../assets/stations.json'
import '../css/App.css';
import { render } from '@testing-library/react';

function LeafletMap() {

  const state_bound_style = () => {
    return {
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0
    };

  }

  const buildMarkerLocs = () => {
    const station_info = Stations
    const locations = []

    for (let [key, value] of Object.entries(station_info)) {
      locations.push([parseFloat(station_info[key].lat), parseFloat(station_info[key].lon)])
    }


  }

  const markerLocations = buildMarkerLocs()
  console.log(markerLocations)

const pos = [44.91,-73.27]

  return (
    <Map center={[43.85, -72.5]} zoom={8}>
      <Marker position={pos} />
      <GeoJSON key='1' data={VT_Boundary} style={state_bound_style} />
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
        attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>



  );

}

export default LeafletMap;