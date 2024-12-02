import React from 'react';
import NavBar from './navbar.js';
import MapContainer from './mapContainer.js';
import DataContainer from './dataContainer.js';
import axios from 'axios'
import {Page, MapLevel} from '../constants.js';

class StateDistrictAnalyzer extends React.Component {
    constructor(props) {
        super(props);
        this.switchState = this.switchState.bind(this); 
        this.setView = this.setView.bind(this);
        this.setData = this.setData.bind(this);
        this.setMapLevel = this.setMapLevel.bind(this);
        this.setSortEco = this.setSortEco.bind(this);
        this.state = {selectedState: "Alabama", mapLevel: MapLevel.precinct, viewMode: Page.SelectStatePage, tableData: [], sortBy: "wht", currentMap: {}, updated: true, alabamaPrecinctMap: {}, massachusettsPrecinctMap: {}};
    }
    async componentDidMount() {
        const usMap =                       await axios.get('http://localhost:8000/api/map?type=usa');
        const alabamaPrecinctMap =          await axios.get('http://localhost:8000/api/map?state=Alabama&type=precincts');
        const massachusettsPrecinctMap =    await axios.get('http://localhost:8000/api/map?state=Massachusetts&type=precincts');
        this.setState({currentMap: usMap.data, alabamaPrecinctMap: alabamaPrecinctMap.data, massachusettsPrecinctMap: massachusettsPrecinctMap.data});
    }
    setMapLevel(option) {
        this.setState({mapLevel: option, updated:false});
    }
    setSortEco(sort) {
        this.setState({sortBy: sort});
    }
    switchState(state) {
        let tableData = [state, undefined]
        axios.get('http://localhost:8000/api/map?state=' + state + '&type=congressional_districts').then(response => {this.setState({ selectedState: state, viewMode: Page.OverviewPage, tableData: tableData, currentMap: response.data, updated: true})});
    }
    setView(options) {
        let tableData = [this.state.selectedState, undefined];
        if (options === Page.ElectionPage) {
            if(this.state.selectedState === "Alabama") tableData[0] = this.state.selectedState + " (Senator)";
            else tableData[0] = this.state.selectedState + " (President)";
        }
        if(options === Page.SelectStatePage) 
            axios.get('http://localhost:8000/api/map?type=usa').then(response => {
                this.setState({ viewMode: options, tableData: tableData, currentMap: response.data, updated: true})
            });
        else if (options === "Overview") this.setState({viewMode: options, mapLevel: "dis", tableData: tableData, updated: false});
        else this.setState({viewMode: options, mapLevel: MapLevel.precinct, tableData: tableData, updated: false});
    }
    setData(title, data) {
        let inputData = [title, data];
        this.setState({tableData: inputData, viewMode: this.state.viewMode});
    }

    render() {
        let name = "Alabama";
        let center = [32.3182, -86.9023]; //Apprioriate coordinates for displaying Alabama
        let zoom = 7;
        let data = this.state.currentMap;
        if(this.state.updated === false) {
            if(this.state.viewMode === Page.SelectStatePage)  
                axios.get('http://localhost:8000/api/map?type=usa').then(response => 
                {
                    this.setState({ currentMap: response.data, updated: true})
                });
            else if(this.state.viewMode === Page.OverviewPage || this.state.mapLevel === MapLevel.district) 
                axios.get('http://localhost:8000/api/map?state=' + this.state.selectedState + '&type=congressional_districts').then(response => 
                {
                    this.setState({ currentMap: response.data, updated: true})
                });
            else if(this.state.mapLevel === MapLevel.county)  
                axios.get('http://localhost:8000/api/map?state=' + this.state.selectedState + '&type=counties').then(response => 
                {
                    this.setState({ currentMap: response.data, updated: true})
                });
            else if(this.state.selectedState === "Alabama")  this.setState({ currentMap: this.state.alabamaPrecinctMap, updated: true});     
            else this.setState({updated: true, currentMap: this.state.massachusettsPrecinctMap});  
        }
        if(this.state.selectedState === "Massachusetts") {
            name ="Massachusetts";
            center = [42.4072, -71.3824];
            zoom = 8;
        }
        if(this.state.viewMode === Page.SelectStatePage) {
            name = "United States";
            zoom = 5;
            center = [37.3182, -92.9023];            
        }
        let right = "";
        if(this.state.viewMode !== 0) right = <DataContainer key={this.state.tableData + "_" + this.state.viewMode + "_"   } sortBy={this.state.sortBy} data={data} viewMode={this.state.viewMode} tableData={this.state.tableData} setView={this.setView}/>;
        return (
            <div class="container">
                <NavBar 
                    key={"navbar_"+name+"_"+this.state.sortBy} 
                    sortBy={this.state.sortBy} 
                    selectedState={this.state.selectedState} 
                    selectedStates={["Massachusetts", "Alabama"]} 
                    dOptions={this.switchState}
                />
                <MapContainer 
                    key={"map_state_"+name+"_"+this.state.viewMode + "_"+this.state.currentMap._id+"_"+this.state.mapLevel} 
                    mapLevel={this.state.mapLevel} 
                    switchState={this.switchState} 
                    setSortEco={this.setSortEco} 
                    setMapLevel={this.setMapLevel} 
                    viewMode={this.state.viewMode} 
                    setData={this.setData} 
                    center={center} 
                    data={data} 
                    zoom={zoom} 
                    selectedState={this.state.selectedState}
                />;
                {right}
            </div>
        );
    }
}

export default StateDistrictAnalyzer;