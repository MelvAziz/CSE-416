import React from 'react'
import BasicMap from './basicMap.js'
import alabama_precincts from '../GeoData/alabama_precincts.json'
import alabama_counties from '../GeoData/alabama_counties.json'
import alabama_congressional_districts from '../GeoData/alabama_congressional_districts.json'

class OptionsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {state: "", precinct: false, county: false, district: false};
    }
    render() {
        return (
            <div class="map-options">
                <BasicMap data={[alabama_precincts, alabama_counties, alabama_congressional_districts]} color={["lightgreen", "green", "black"]}/>
                {/* <input type="checkbox" name={this.type = 10}/> */}
            </div>
        ); 
    }
}


export default OptionsMap;