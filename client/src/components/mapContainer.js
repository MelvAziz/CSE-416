import React from 'react'
import Map from './map.js'
import MapMenu from './mapMenu.js'
import {Page, MapLevel, SortingMethod} from '../constants.js';


class MapContainer extends React.Component {
  constructor(props) {
      super(props);
      this.data = this.props.data;
      this.zoom = this.props.zoom;
      this.center = this.props.center;
      this.setData = this.props.setData;
      this.setMapLevel = this.props.setMapLevel;
      this.changeSort = this.props.changeSort;
      this.mapLevel = this.props.mapLevel;
      this.setSort = this.setSort.bind(this);
      this.setMapLevel = this.setMapLevel.bind(this);
      this.setRange = this.setRange.bind(this);
      this.state = {state: this.props.selectedState, viewMode: this.props.viewMode, sortBy: SortingMethod.medianIncome, min: 3, max: 10};
  }
  setMapLevel(option) {
    this.setMapLevel(option);
  }
  setSort(option) {
    this.changeSort(option);
    this.setState({sortBy: option});
  };
  setRange(e) {
    this.setState({min: e.minValue, max: e.maxValue})
  }
  render() {
      let data = this.data;
      let electionModeSelected = this.state.sortBy === SortingMethod.bothPartiesElection || this.state.sortBy === SortingMethod.democraticElection || this.state.sortBy === SortingMethod.republicanElection;
      let raceModeSelected = this.state.sortBy === SortingMethod.whiteRace || this.state.sortBy === SortingMethod.blackRace || this.state.sortBy === SortingMethod.hispanicRace;
      if (this.state.viewMode === Page.electionPage && !electionModeSelected) this.setState({sortBy: SortingMethod.bothPartiesElection});
      if (this.state.viewMode === Page.racePage && !raceModeSelected) this.setState({sortBy: SortingMethod.whiteRace});
      return (
          <div class="map-options">
              <Map 
                key={"_" + data.name + "_" + this.mapLevel + "_" + this.state.sortBy + "_" + this.state.min + "_" + this.state.max}
                switchState={this.props.switchState} 
                setData={this.setData} 
                min={this.state.min} 
                max={this.state.max} 
                center={this.center} 
                zoom={this.zoom} 
                data={data} 
                viewMode={this.state.viewMode} 
                sortBy={this.state.sortBy}
              />;  
              <MapMenu 
                selectedState={this.state.state} 
                setRange={this.setRange} 
                setSort={this.setSort} 
                setCheck={this.setCheck} 
                setView={this.setView} 
                sortBy={this.state.sortBy} 
                viewMode={this.state.viewMode} 
                setMapLevel={this.setMapLevel} 
                mapLevel={this.mapLevel}
              />; 
          </div>
      ); 
  }
}


export default MapContainer;