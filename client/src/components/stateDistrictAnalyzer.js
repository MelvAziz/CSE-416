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
import axios from 'axios';
class StateDistrictAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.switchState = this.switchState.bind(this);
        this.setView = this.setView.bind(this);
        this.setData = this.setData.bind(this);
        this.setSortEco = this.setSortEco.bind(this);
        this.state = {selectedState: "Alabama", viewMode: 1, tableData: [], sortBy: "wht"};
    }
    setSortEco(sort) {
        this.setState({sortBy: sort});
    }


    async fetchData() {
        try {
            const response = await axios.get('http://localhost:8000/api/data');
            console.log(response);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    switchState(state) {
        let tableData = [state, undefined]
        this.setState({selectedState: state, viewMode: 1, tableData: tableData});
    }
    setView(options) {
        let tableData = [this.state.selectedState, undefined];
        console.log(tableData);
        if (options === "Economics") this.setState({viewMode: 1, tableData: tableData});
        else if (options === "Race") this.setState({viewMode: 2,  tableData: tableData});
        else if (options === "Election") {
            if(tableData[0].includes("Senator") || tableData[0].includes("Governor") || tableData[0].includes("President")) {
                this.setState({viewMode: 3,  tableData: tableData});
            }
            else if(this.state.selectedState === "Alabama") tableData = [this.state.selectedState + " (Governor)", undefined];
            else tableData = [this.state.selectedState + " (President)", undefined];
            this.setState({viewMode: 3,  tableData: tableData});
        }
        else if (options === "Gingles") this.setState({viewMode: 4,  tableData: tableData});
        else if (options === "Ecological") this.setState({viewMode: 5, tableData: tableData});
        else if (options === "Ensemble") this.setState({viewMode: 6,  tableData: tableData});

        console.log(this.state.tableData); 

    }
    setData(title, data) {
        let inputData = [title, data];
        this.setState({tableData: inputData, viewMode: this.state.viewMode});
    }

    render() {
        this.fetchData();
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
        let map = <Map key={"map_state_"+name+"_"+this.state.viewMode} setSortEco={this.setSortEco} viewMode={this.state.viewMode} setData={this.setData} center={center} data={data} zoom={zoom} height={height} selectedState={this.state.selectedState}/>;
        let right = <RightControl key={this.state.tableData + "_" + this.state.viewMode + "_"   } sortBy={this.state.sortBy} data={data} viewMode={this.state.viewMode} tableData={this.state.tableData} setView={this.setView}/>;
        return (
            <div class="container">
                <NavBar key={"navbar_"+name+"_"+this.state.sortBy} sortBy={this.state.sortBy} selectedState={this.state.selectedState} selectedStates={["Massachusetts", "Alabama"]} dOptions={this.switchState}/>
                {map}
                {right}
            </div>
        );
    }
}

export default StateDistrictAnalyzer;