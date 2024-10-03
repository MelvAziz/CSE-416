import React from 'react';
import NavBar from './navbar.js';
import OptionsMap from './optionsMap.js';
import ControlPanel from './controlPanel.js';
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
        this.state = {selectedState: 1};
    }
    switchState() {
        this.setState({selectedState: (this.state.selectedState+1)%2});
    }
    render() {
        let name = "Massachusetts";
        let data = [alabama_precincts, alabama_counties, alabama_congressional_districts];
        let center = [32.3182, -86.9023];
        if(this.state.selectedState === 1) {
            name ="Alabama";
            data = [massachusetts_precincts, massachusetts_counties, massachusetts_congressional_districts];
            center = [42.4072, -71.3824];
        }
        let map = <OptionsMap key={"map_state_"+name} center={center} data={data}/>;
        return (
            <div class="container">
                <NavBar key={"navbar_"+name} selectState={name} dOptions={this.switchState}/>
                <div class="map-container">
                    {map}
                    <ControlPanel className="ControlPanel"/>
                </div>
            </div>
        );
    }
}

export default StateDistrictAnalyzer;