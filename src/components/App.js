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

    const fetchData = async (site) => {

      const url_prefix = 'http://localhost:4000/'
      const url = url_prefix + site + '/data.json'
      console.log('url', url)
      try {
        let res = await fetch(url);
      } catch (error) {
        console.log('error', error)
      }

      const res_data = res.json();
      setChartData({ data: res_data })
      console.log('res', chartData)
    }

    fetchData(station)
  }

  )

  return (
    <div className="App">
      <Header />
      <div className='rowContainer'>
        <LeafletMap changeStation={changeStation} station_id={station} />
        <SidePanel station_id={station} />
      </div>
    </div>
  );
}



export default App;