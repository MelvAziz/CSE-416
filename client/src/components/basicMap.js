import React from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
// import alabama from '../GeoData/alabama.json'

class BasicMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.color = this.props.color;
    }
    render() {
        // let data = <GeoJSON data={this.data[0]} style={this.color}/>
        // let data = "";
        // for(let i = 0; i < this.data.length; i++) {
        //     data+=`<GeoJSON data={this.data[${i}]} style={this.color}/>`;
        // }
        let i = 0;
        let j = 0;
        const data = this.data.map(d => <GeoJSON key={"Data-"+(i++)} data={d} style={{color:this.color[j++]}}/>);
        // console.log(data);
        return (
            <MapContainer id="map" center={[32.3182, -86.9023]} zoom={7} stye={{height: "20vw"}}scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <GeoJSON data={this.data} style={this.color}/> */}
                {data}
            </MapContainer>
        );
    }
}


export default BasicMap;