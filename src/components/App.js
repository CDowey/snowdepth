import '../css/App.css';
import React from 'react';
import Header from './Header';
import LeafletMap from './LeafletMap';
import SidePanel from './SidePanel';

function App() {
  return (
    <div className="App">
      <Header/>
      <div className='rowContainer'>
        <LeafletMap />
        <SidePanel />
      </div>
    </div>
  );
}

export default App;
