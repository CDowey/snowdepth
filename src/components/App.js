import React from 'react';
import LeafletMap from './LeafletMap'
import SidePanel from './SidePanel'
import '../css/App.css';

function App() {
  return (
    <div className="App">
      <div className='row1-container'>
        {/* <LeafletMap className='leaflet-container' /> */}

        <SidePanel />
      </div>
    </div>
  );
}

export default App;
