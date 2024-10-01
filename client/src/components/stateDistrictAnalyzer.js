import React from 'react';
import NavBar from './navbar.js';
import Map from './map.js';
import alabama_precincts from '../GeoData/alabama/alabama_precincts.json'
import alabama_counties from '../GeoData/alabama/alabama_counties.json'
import alabama_congressional_districts from '../GeoData/alabama/alabama_congressional_districts.json'
import massachusetts_precincts from '../GeoData/massachusetts/massachusetts_precincts.json'
import massachusetts_counties from '../GeoData/massachusetts/massachusetts_counties.json'
import massachusetts_congressional_districts from '../GeoData/massachusetts/massachusetts_congressional_districts.json'

class StateDistrictAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.switchState = this.switchState.bind(this);
        this.state = {selectedState: "Alabama"};
    }
    switchState(state) {
        this.setState({selectedState: state});
    }
    render() {
        let name = "Alabama";
        let data = [alabama_precincts, alabama_counties, alabama_congressional_districts];
        let center = [32.3182, -86.9023];
        let zoom = 7;
        let height = "0";
        if(this.state.selectedState === "Massachusetts") {
            name ="Massachusetts";
            data = [massachusetts_precincts, massachusetts_counties, massachusetts_congressional_districts];
            center = [42.4072, -71.3824];
            zoom = 8;
            height = "1";
        }
        let map = <Map key={"map_state_"+name} center={center} data={data} zoom={zoom} height={height}/>;
        return (
            <div class="container">
                <NavBar key={"navbar_"+name} selectedState={this.state.selectedState} selectedStates={["Massachusetts", "Alabama"]} dOptions={this.switchState}/>
                {map}
            </div>
        );
    }
}

export default StateDistrictAnalyzer;