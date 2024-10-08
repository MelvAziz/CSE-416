import './stylesheets/App.css';
import StateDistrictAnalyzer from './components/stateDistrictAnalyzer';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import React from 'react';
function App() {

  return (
    <div className="App">
      <header className="App-header">
        <StateDistrictAnalyzer />
      </header>
    </div>
  );
}
// All data that we use from the Redistricting Hub should be marked "This analysis was conducted using data from the Redistricting Data Hub." 

export default App;
