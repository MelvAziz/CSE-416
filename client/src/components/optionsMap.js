import React from 'react'
import BasicMap from './basicMap.js'

class OptionsMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.center = this.props.center;
        this.setCheck = this.setCheck.bind(this);
        this.state = {state: "", precinct: false, county: false, district: false};
    }
    setCheck(option) {
        if(option === 0)this.setState({precinct: !this.state.precinct});
        else if(option === 1)this.setState({county: !this.state.county});
        else if(option === 2)this.setState({district: !this.state.district});
      };
    render() {
        let data = [];
        let colors = ["lightgreen", "green", "black"];
        if(this.state.precinct === true)    data.push(this.data[0]);
        if(this.state.county === true)      data.push(this.data[1]);
        if(this.state.district === true)    data.push(this.data[2]);
        let map = <BasicMap center={this.center} key={data.length} data={data} color={colors}/>;        
        return (
            <div class="map-options">
                {map}
                <div class="map_menu">
                    <div class="map_checkbox_container">
                        <input class="map_checkboxes" type="checkbox" onChange={(e) => this.setCheck(0)}/>
                        <p class="map_checkbox_text">Precincts</p>
                    </div>
                    <div class="map_checkbox_container">
                        <input class="map_checkboxes" type="checkbox" onChange={(e) => this.setCheck(1)}/>
                        <p class="map_checkbox_text">Counties</p>
                    </div>
                    <div class="map_checkbox_container">
                        <input class="map_checkboxes" type="checkbox" onChange={(e) => this.setCheck(2)}/>
                        <p class="map_checkbox_text">Districts</p>
                    </div>
                </div>
            </div>
        ); 
    }
}


export default OptionsMap;