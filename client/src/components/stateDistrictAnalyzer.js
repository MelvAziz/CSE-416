import React from 'react';
import NavBar from './navbar.js';
import Map from './map.js';
import alabama_precincts from '../GeoData/alabama/alabama_precincts.json'
import alabama_counties from '../GeoData/alabama/alabama_counties.json'
import alabama_congressional_districts from '../GeoData/alabama/alabama_congressional_districts.json'
import massachusetts_precincts from '../GeoData/massachusetts/massachusetts_precincts.json'
import massachusetts_counties from '../GeoData/massachusetts/massachusetts_counties.json'
import massachusetts_congressional_districts from '../GeoData/massachusetts/massachusetts_congressional_districts.json'
import RightControl from './rightControl.js';
class StateDistrictAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.switchState = this.switchState.bind(this);
        this.setView = this.setView.bind(this);
        this.setData = this.setData.bind(this);
        this.state = {selectedState: "Alabama", viewMode: 1, tableData: []};
    }
    switchState(state) {
        this.setState({selectedState: state, viewMode: 1});
    }
    setView(options) {
        if (options === "Economics") this.setState({viewMode: 1, tableData: []});
        else if (options === "Race") this.setState({viewMode: 2,  tableData: []});
        else if (options === "Election") this.setState({viewMode: 3,  tableData: []});
        else if (options === "Gingles") this.setState({viewMode: 4,  tableData: []});
        else if (options === "Ecological") this.setState({viewMode: 5,  tableData: []});
        else if (options === "Ensemble") this.setState({viewMode: 6,  tableData: []});

    }
    setData(title, data) {
        let inputData = [title, data];
        this.setState({tableData: inputData, viewMode: this.state.viewMode});
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
        let map = <Map key={"map_state_"+name+"_"+this.state.viewMode} viewMode={this.state.viewMode} setData={this.setData} center={center} data={data} zoom={zoom} height={height} selectedState={this.state.selectedState}/>;
        let right = <RightControl key={this.state.tableData} viewMode={this.state.viewMode} tableData={this.state.tableData} setView={this.setView}/>;
        return (
            <div class="container">
                <NavBar key={"navbar_"+name} selectedState={this.state.selectedState} selectedStates={["Massachusetts", "Alabama"]} dOptions={this.switchState}/>
                {map}
                {right}
            </div>
        );
    }
}

export default StateDistrictAnalyzer;