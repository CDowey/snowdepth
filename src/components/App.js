import '../css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import LineChart from './LineChart';
import MapInfo from './MapInfo'
import OptionsPane from './OptionsPane'
import NavPanel from './NavPanel';
import 'semantic-ui-css/semantic.min.css'
import { Button, Toast } from 'react-bootstrap'
import { findAllByTestId } from '@testing-library/react';

const urlPrefix = window.location.hostname.includes('localhost') ? 'http://localhost:4000/' : 'http://157.245.243.254/'

const App = () => {

  const [station, setStation] = useState('USC00435416')
  const [isLoading, setIsLoading] = useState(true)
  const [snowData, setSnowData] = useState({})

  // Initial Graph and Map options configuration
  const initialOptions = {
    'Graph Options':
    {
      'Average': true,
      'Median': false,
      '1-σ': false,
      '2-σ': false
    },
    'Map Options':
    {
      'Stations': true,
      'Modelled Snow Depth': false
    }
  }

  let options = initialOptions

  const changeStation = (newStationID) => {
    setStation(newStationID);
    // setIsLoading(true)
  }

  console.log('App station', station)


  // Set up functions to allow options toggling from Options Pane
  const toggleOptions = (optionsType, option) => {
    console.log('toggle from App', optionsType, option)
    // switch the value of the current option of interest
    options[optionsType][option] = !options[optionsType][option]
    
    // Set Parameters In Line Chart

  }



  useEffect(() => {

    const fetchData = async (station) => {

      const url = urlPrefix + station + '/data.json'
      const res = await fetch(url);
      const res_data = await res.json();
      setSnowData(res_data)
      setIsLoading(false)
    }

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
          <div className='belowChartContainer'>
            {isLoading
              ? ''
              : <>
                <MapInfo mapInfoData={snowData.data.info} />
                <OptionsPane title='Graph Options' options={options['Graph Options']} toggle={toggleOptions} />
                <OptionsPane title='Map Options' options={options['Map Options']} toggle={toggleOptions} />
              </>
            }

          </div>
          <NavPanel className='NavPanel' />
        </div>
      </div>
    </div>
  );
}



export default App;