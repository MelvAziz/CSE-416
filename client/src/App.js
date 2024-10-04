import './stylesheets/App.css';
import StateDistrictAnalyzer from './components/stateDistrictAnalyzer';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import Graphs from './components/plots.js';
import { useState } from 'react';




function App() {
  const [plotData, setPlotData] = useState([
    {
      x: ["White", "Black", "Hispanic", "Other"],
      y: [20000, 15000, 6000],
      type: 'bar',
      mode: 'lines+markers',
      marker: { color: 'blue' },
    },
  ])

  const [plotLayout, setPlotLayout] = useState({
    title: 'Alabama Pop. by Race',
    width: 600,
    height: 400,
  });

  const updatePlotData = (type, location) => {
    if (type === 'State') {
      setPlotData([
        {
          x: ["White", "Black", "Hispanic", "Other"],
          y: [20000, 15000, 6000],
          type: 'bar',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        },
      ]);
    } else if (type === 'Precinct') {
      setPlotData([
        {
          x: ["White", "Black", "Hispanic", "Other"],
          y: [200, 150, 60],
          type: 'bar',
          mode: 'lines+markers',
          marker: { color: 'green' },
        },
      ]);
    } else if (type === 'County') {
      setPlotData([
        {
          x: ["White", "Black", "Hispanic", "Other"],
          y: [2000, 1500, 600],
          type: 'bar',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
      ]);
    }
    setPlotLayout({
      title: `${location} Pop. by Race`,
      width: 600,
      height: 400,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <StateDistrictAnalyzer />
      </header>
      <div className="Plots">
        <Graphs data={plotData} layout={plotLayout}/>
        <button onClick={() => updatePlotData('State', 'Alabama')}>State Level</button>
        <button onClick={() => updatePlotData('Precinct', 'Precinct 1060')}>Precinct Level</button>
        <button onClick={() => updatePlotData('County', 'Autauga')}>County Level</button>
      </div>
    </div>
  );
}
// All data that we use from the Redistricting Hub should be marked "This analysis was conducted using data from the Redistricting Data Hub." 

export default App;
