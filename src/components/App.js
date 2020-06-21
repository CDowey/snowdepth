import React from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import SidePanel from './SidePanel';
import '../css/App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <div className='row1-container'>
        <LeafletMap className='leaflet-container' />
        <SidePanel />
      </div>
    </div>
  );
}

export default App;
