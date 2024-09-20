import './stylesheets/App.css';
import NavBar from './components/navbar.js';
import OptionsMap from './components/optionsMap.js';
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar/>
        <OptionsMap />
      </header>
    </div>
  );
}
// All data that we use from the Redistricting Hub should be marked "This analysis was conducted using data from the Redistricting Data Hub." 

export default App;
