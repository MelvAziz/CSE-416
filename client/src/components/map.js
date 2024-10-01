import React from 'react'
import BasicMap from './basicMap.js'
import MapMenu from './mapMenu.js'

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.zoom = this.props.zoom;
        this.height = this.props.height;
        this.center = this.props.center;
        this.setSort = this.setSort.bind(this);
        this.setCheck = this.setCheck.bind(this);
        this.setView = this.setView.bind(this);
        this.setSingleMap = this.setSingleMap.bind(this);
        this.state = {state: "", precinct: false, county: false, district: false, viewMode: 0, sortBy: "", selected: ""};
    }
    setCheck(option) {
        console.log(option);
        if(option === 0)this.setState({selected: "", precinct: !this.state.precinct});
        else if(option === 1)this.setState({selected: "", county: !this.state.county});
        else if(option === 2)this.setState({selected: "", district: !this.state.district});
      };
      setSingleMap(option) {
        console.log(option)
        this.setState({selected: option, precinct: false, county: false, district: false});
      }
      setView(option) {
        this.setState({viewMode: option, sortBy: "", selected: "", precinct: false, county: false, district: false});
      };
      setSort(option) {
        this.setState({sortBy: option, selected: this.state.selected});
      };
    render() {
        let data = [];
        let colors = ["lightgray", "gray", "black"];
        if(this.state.precinct === true || this.state.selected === "p")    data.push(this.data[0]);
        if(this.state.county === true || this.state.selected === "c")      data.push(this.data[1]);
        if(this.state.district === true || this.state.selected === "d")    data.push(this.data[2]);
        let map = <BasicMap center={this.center} zoom={this.zoom} height={this.height} key={data.length + "_" + data.selected+"_" + this.state.selected + "_" + this.state.sortBy} data={data} color={colors} viewMode={this.state.viewMode} sortBy={this.state.sortBy}/>;  
        let menu = <MapMenu setSort={this.setSort} setCheck={this.setCheck} setView={this.setView} sortBy={this.state.sortBy} viewMode={this.state.viewMode} singleMap={this.setSingleMap} selected={this.state.selected}/>; 
        return (
            <div class="map-options">
                {map}
                {menu}
            </div>
        ); 
    }
}


export default Map;