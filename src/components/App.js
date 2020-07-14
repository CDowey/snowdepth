import '../css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import SidePanel from './SidePanel';

const App = () =>{

  const [station, setStation] = useState('USC00435416')

  const changeStation = (newStationID) => {
    setStation(newStationID);
  }

  console.log('App station', station)



  return (
    <div className="App">
      <Header/>
      <div className='rowContainer'>
        <LeafletMap changeStation={changeStation} station_id = {station}/>
        <SidePanel station_id = {station}/>
      </div>
    </div>
  );
}

export default App;
