import React from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
// import alabama from '../GeoData/alabama.json'

class BasicMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
    }
    render() {
        return (
            <MapContainer id="map" center={[32.3182, -86.9023]} zoom={7} stye={{height: "20vw"}}scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={this.data} style={{color: "blue"}}/>
            </MapContainer>
        );
    }
}


export default BasicMap;