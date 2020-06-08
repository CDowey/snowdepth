import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import '../css/App.css';

function LeafletMap() {
    return (
        
        <Map center={[44, -72.5]} zoom={8}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
        
    );
}

export default LeafletMap;