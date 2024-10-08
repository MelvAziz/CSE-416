import './stylesheets/App.css';
import StateDistrictAnalyzer from './components/stateDistrictAnalyzer';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import axios from 'axios';
import React, { useState } from 'react';
function App() {
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/data');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
