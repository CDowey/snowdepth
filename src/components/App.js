import '../css/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import LineChart from './LineChart';
import MapInfo from './MapInfo'
import OptionsPane from './OptionsPane'
import NavPanel from './NavPanel';
import { Button, Toast } from 'react-bootstrap'
import { findAllByTestId } from '@testing-library/react';

const urlPrefix = window.location.hostname.includes('localhost') ? 'http://localhost:4000/' : 'http://157.245.243.254/'

const App = () => {

  const [station, setStation] = useState('USC00435416')
  const [isLoading, setIsLoading] = useState(true)
  const [snowData, setSnowData] = useState({})
  const [options, setOptions] = useState({})

  const changeStation = (newStationID) => {
    setStation(newStationID);
    // setIsLoading(true)
  }

  console.log('App station', station)

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

  // Set up functions to allow options toggling from Options Pane
  const toggleOptions = (optionsType, option) => {
    console.log('toggle', optionsType, options)

    // get current options object
    const newOptions = options
    // switch the value of the current option of interest
    newOptions[optionsType][option] = !newOptions[optionsType][option]
    // set new options object
    setOptions(newOptions)
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

    setOptions(initialOptions)

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