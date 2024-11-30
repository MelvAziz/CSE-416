import React from 'react'
import Map from './map.js'
import MapMenu from './mapMenu.js'
import {Page, MapLevel} from '../constants.js';


class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.zoom = this.props.zoom;
        this.center = this.props.center;
        this.setData = this.props.setData;
        this.setMapLevel = this.props.setMapLevel;
        this.mapLevel = this.props.mapLevel;
        this.setSort = this.setSort.bind(this);
        this.setMapLevel = this.setMapLevel.bind(this);
        this.setRange = this.setRange.bind(this);
        this.state = {state: this.props.selectedState, viewMode: this.props.viewMode, sortBy: "med", min: 3, max: 10};
    }
      setMapLevel(option) {
        this.setMapLevel(option);
      }
      setSort(option) {
        this.props.setSortEco(option);
        this.setState({sortBy: option});
      };
      setRange(e) {
        this.setState({min: e.minValue, max: e.maxValue})
      }
    render() {
        let data = this.data;
        if(this.state.viewMode === Page.ElectionPage && (this.state.sortBy !== "elec1" && this.state.sortBy !== "elec2" && this.state.sortBy !== "elec3")) this.setState({sortBy: "elec1"});
        return (
            <div class="map-options">
                <Map switchState={this.props.switchState} setData={this.setData} min={this.state.min} max={this.state.max} center={this.center} zoom={this.zoom} key={"_" + data.name + "_" + this.mapLevel + "_" + this.state.sortBy + "_" + this.state.min + "_" + this.state.max} data={data} viewMode={this.state.viewMode} sortBy={this.state.sortBy}/>;  
                <MapMenu selectedState={this.state.state} setRange={this.setRange} setSort={this.setSort} setCheck={this.setCheck} setView={this.setView} sortBy={this.state.sortBy} viewMode={this.state.viewMode} setMapLevel={this.setMapLevel} mapLevel={this.mapLevel}/>; 
            </div>
        ); 
    }
}


export default MapContainer;