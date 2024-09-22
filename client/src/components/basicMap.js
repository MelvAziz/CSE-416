import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
// import alabama from '../GeoData/alabama.json'

class BasicMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.color = this.props.color;
        this.center = this.props.center;
    }
    render() {
        let i = 0;
        let j = 0;
        const data = this.data.map(d => <GeoJSON key={"Data-"+(i++)} data={d} style={{color:this.color[j++]}}/>);
        return (
            <MapContainer id="map" center={this.center} zoom={7} stye={{height: "20vw"}}scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data}
            </MapContainer>
        );
    }
}


export default BasicMap;