import '../css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import SidePanel from './SidePanel';

const App = () => {

  const [station, setStation] = useState('USC00435416')
  const [chartData, setChartData] = useState({})


  const changeStation = (newStationID) => {
    setStation(newStationID);
  }

  console.log('App station', station)

  useEffect(() => {

    // Get data from endpoints for the station set in App state

    const fetchData = async (station) => {

      const url_prefix = 'http://localhost:4000/'
      const url = url_prefix + station + '/data.json'
      console.log('url', url)
      const res = await fetch(url);
      const res_data = await res.json();
      setChartData(res_data)
      console.log('res_data', res_data)
    }

    fetchData(station)
  }

  )

  return (
    <div className="App">
      <Header />
      <div className='rowContainer'>
        <LeafletMap changeStation={changeStation} station_id={station} />
        <SidePanel chartData={chartData} />
      </div>
    </div>
  );
}



export default App;