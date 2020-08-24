import '../css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import SidePanel from './SidePanel';
import LineChart from './LineChart';
import MapInfo from './MapInfo'
import NavPanel from './NavPanel';


const App = () => {

  const [station, setStation] = useState('USC00435416')
  const [isLoading, setIsLoading] = useState(true)
  const [snowData, setSnowData] = useState({})



  const changeStation = (newStationID) => {
    setStation(newStationID);
   // setIsLoading(true)
  }

  console.log('App station', station)

  const fetchData = async (station) => {

    const url_prefix = 'http://localhost:4000/'
    const url = url_prefix + station + '/data.json'
    const res = await fetch(url);
    const res_data = await res.json();
    setSnowData(res_data)
    setIsLoading(false)
    console.log('res_data', snowData)
  }

  useEffect(() => {

    fetchData(station)

  }, [station]

  )

  return (
    <div className="App">
      <Header />
      <div className='rowContainer'>
        <LeafletMap changeStation={changeStation} station_id={station} />
        <div className='sidePanel'>
          <div className='chartContainer'>
            {/* * Use this conditional statement to change what is return based on isLoading */}
            {isLoading
                ? ''
                : <LineChart chartData={snowData.data.chartData} />
                }
            {/* <LineChart className='lineChart'
                    data={snowData} station={station} loading={isLoading}/> */}
          </div>
          {isLoading
            ? ''
            : <MapInfo mapInfoData={snowData.data.info} />}
          <NavPanel className='NavPanel' />
        </div>
      </div>
    </div>
  );
}



export default App;