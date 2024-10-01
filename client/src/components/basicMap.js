import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
// import alabama from '../GeoData/alabama.json'

class BasicMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.color = this.props.color;
        this.center = this.props.center;
        this.zoom = this.props.zoom;
        this.height = this.props.height;
        this.viewMode = this.props.viewMode;
        this.sortBy = this.props.sortBy;
    }
    render() {
        let opacity = 0.6;
        if(this.viewMode !== 0) opacity = 0.9;
        const countyHover = (feature, layer) =>{
            const countyName = feature.properties.COUNTY;   
            let districtName = feature.properties.DISTRICT
            let precinctName = feature.properties.NAME10;  ;
            if(precinctName === undefined) precinctName = feature.properties.Precinct; 
            if(districtName === undefined) districtName = feature.properties.DIST; 
            let popup = "";
            if(this.viewMode === 1) popup = "<p>Median Income: $" + feature.properties.MEDN_INC22 + "</p>";
            else if(this.viewMode === 2) {
                popup = "<p>Total Population: " + feature.properties.TOT_POP22 + "</p>";
                if(feature.properties.WHT_NHSP22 !== undefined && feature.properties.WHT_NHSP22 > feature.properties.TOT_POP22/100) popup += "<p>White: "    + feature.properties.WHT_NHSP22 + "(" + ((feature.properties.WHT_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%)</p>";
                if(feature.properties.BLK_NHSP22 !== undefined && feature.properties.BLK_NHSP22 > feature.properties.TOT_POP22/100) popup += "<p>Black: "    + feature.properties.BLK_NHSP22 + "(" + ((feature.properties.BLK_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%)</p>";
                if(feature.properties.HSP_POP22 !== undefined && feature.properties.HSP_POP22 > feature.properties.TOT_POP22/100) popup += "<p>Hispanic: " + feature.properties.HSP_POP22 + "(" + ((feature.properties.HSP_POP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%)</p>";
                if(feature.properties.ASN_NHSP22 !== undefined && feature.properties.ASN_NHSP22 > feature.properties.TOT_POP22/100) popup += "<p>Asian: "    + feature.properties.ASN_NHSP22 + "(" + ((feature.properties.ASN_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%)</p>";
                if(feature.properties.AIA_NHSP22 !== undefined && feature.properties.AIA_NHSP22 > feature.properties.TOT_POP22/100) popup += "<p>Native: "   + feature.properties.AIA_NHSP22 + "(" + ((feature.properties.AIA_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%)</p>";
            }
            const medInc = feature.properties.MEDN_INC22;   
            layer.on('mouseover', function (e) {
               if(countyName !== undefined) layer.bindPopup("<p>" + countyName + "</p>" + popup).openPopup();
               else if(precinctName !== undefined)layer.bindPopup("<p>" + precinctName + "</p>" + popup).openPopup();
               else if(districtName !== undefined) layer.bindPopup("<p>District " + districtName + "</p>" + popup).openPopup();
            });
            if(this.viewMode === 1) {
                if(medInc < 45000) layer.options.color = "#FF0000";
                else if(medInc < 60000) layer.options.color = "#CC0033";
                else if(medInc < 75000) layer.options.color = "#990066";
                else if(medInc < 90000) layer.options.color = "#660099";
                else if(medInc < 115000) layer.options.color = "#3300CC";
                else layer.options.color = "#0000FF";
            }
            else if(this.viewMode === 2) {
                let total = feature.properties.TOT_POP22;
                let pop = 0;
                if(this.sortBy === "w") pop = feature.properties.WHT_NHSP22;
                else if(this.sortBy === "b") pop = feature.properties.BLK_NHSP22;
                else if(this.sortBy === "h") pop = feature.properties.HSP_POP22;
                else if(this.sortBy === "a") pop = feature.properties.ASN_NHSP22;
                else if(this.sortBy === "n") pop = feature.properties.AIA_NHSP22;
                else pop = 100;
                let frac = ((pop/total)*100).toFixed(10);
                if(frac < 10) layer.options.color = "#ffff3f";
                else if(frac < 20) layer.options.color = "#eeef20";
                else if(frac < 30) layer.options.color = "#dddf00";
                else if(frac < 40) layer.options.color = "#d4d700";
                else if(frac < 50) layer.options.color = "#bfd200";
                else if(frac < 60) layer.options.color = "#aacc00";
                else if(frac < 70) layer.options.color = "#80b918";
                else if(frac < 80) layer.options.color = "#55a630";
                else if(frac < 90) layer.options.color = "#2b9348";
                else layer.options.color = "007f5f";
            }
        }

        let i = 0;
        let j = this.color.length - this.data.length;
        const data = this.data.map(d => <GeoJSON onEachFeature={countyHover} key={"Data-"+(i++)+"-o"+opacity} data={d.features} style={{color:this.color[j++], fillOpacity: opacity}}/>);
        return (
            <MapContainer id={"map_"+this.height} center={this.center} zoom={this.zoom} scrollWheelZoom={false}>
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    
                />
                {data}
            </MapContainer>
        );
    }
}


export default BasicMap;