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
        this.setView = this.setView.bind(this);
        this.setSingleMap = this.setSingleMap.bind(this);
        this.setRange = this.setRange.bind(this);
        this.state = {state: "", viewMode: 1, sortBy: "med", selected: "pre", min: 3, max: 10};
    }
      setSingleMap(option) {
        this.setState({selected: option});
      }
      setView(option) {
        if(option === 1) this.setState({viewMode: option, sortBy: "inc"});
        else if(option === 2) this.setState({viewMode: option, sortBy: "blk"});
        else if(option === 3) this.setState({viewMode: option, sortBy: "sen1"});
      };
      setSort(option) {
        this.setState({sortBy: option, selected: this.state.selected});
      };
      setRange(e) {
        this.setState({min: e.minValue, max: e.maxValue})
      }
    render() {
        let data = [];
        if(this.state.selected === "pre")       data.push(this.data[0]);
        else if(this.state.selected === "cnt")  data.push(this.data[1]);
        else if(this.state.selected === "dis")  data.push(this.data[2]);
        let map = <BasicMap min={this.state.min} max={this.state.max} center={this.center} zoom={this.zoom} height={this.height} key={data.length + "_" + data.selected + "_" + this.state.selected + "_" + this.state.sortBy + "_" + this.state.min + "_" + this.state.max} data={data} viewMode={this.state.viewMode} sortBy={this.state.sortBy}/>;  
        let menu = <MapMenu setRange={this.setRange} setSort={this.setSort} setCheck={this.setCheck} setView={this.setView} sortBy={this.state.sortBy} viewMode={this.state.viewMode} singleMap={this.setSingleMap} selected={this.state.selected}/>; 
        return (
            <div class="map-options">
                {map}
                {menu}
            </div>
        ); 
    }
}


export default Map;