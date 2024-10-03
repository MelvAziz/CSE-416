import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import MapLegend from './mapLegend';

class BasicMap extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.center = this.props.center;
        this.zoom = this.props.zoom;
        this.height = this.props.height;
        this.viewMode = this.props.viewMode;
        this.sortBy = this.props.sortBy;
        this.min = this.props.min;
        this.max = this.props.max;
    }
    render() {
        let opacity = 0.5;
        let selectedPopup;
        let selectedFeature;
        let selectedFeatureColor;
        let legend;
        if(this.viewMode !== 0) opacity = 0.85;
        if(this.viewMode === 1  && this.sortBy === "m") legend = <MapLegend colors={["#FF0000", "#CC0033", "#990066", "#660099",  "#3300CC", "#0000FF", "darkblue"]} labels={ ["<45k", "45-60k", "60-75k", "75-100k", "100-125k", "125-150k", ">150k"]}/>
        if(this.viewMode === 2 || (this.viewMode === 1 && this.sortBy === "i")) legend = <MapLegend colors={["#ffff3f", "#eeef20", "#dddf00", "#d4d700", "#bfd200", "#aacc00", "#80b918", "#55a630", "#2b9348", "#007f5f"]} labels={ ["<10%", "10-20%", "20-30%", "30-40%", "40-50%", "50-60%", "60-70%", "70-80%", "80-90%", "90-100"]}/>
        function readableNum(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
        const countyHover = (feature, layer) =>{
            const countyName = feature.properties.COUNTY;   
            let districtName = feature.properties.DISTRICT
            let precinctName = feature.properties.NAME10;  ;
            if(precinctName === undefined) precinctName = feature.properties.Precinct; 
            if(districtName === undefined) districtName = feature.properties.DIST;   
            let popup = "";          
            if(countyName !== undefined) popup = "<p>" + countyName + "</p>";
            else if(precinctName !== undefined) popup = "<p>" + precinctName + "</p>";
            else if(districtName !== undefined)  popup = "<p>" + districtName + "</p>";
            if(this.viewMode === 1) {
                let brackets = [feature.properties.LESS_10K22, feature.properties["10K_15K22"], feature.properties["15K_20K22"], feature.properties["20K_25K22"], feature.properties["25K_30K22"], feature.properties["30K_35K22"], feature.properties["35K_40K22"], feature.properties["40K_45K22"],  feature.properties["45K_50K22"], feature.properties["50K_60K22"], feature.properties["60K_75K22"], feature.properties["75K_100K22"], feature.properties["100_125K22"], feature.properties["125_150K22"], feature.properties["150_200K22"], feature.properties["200K_MOR22"] ];
                let medInc = feature.properties.MEDN_INC22;   
                let tot =  feature.properties.TOT_HOUS22;
                if(medInc === undefined) {
                    tot = 0;
                    for(let i = 0; i < 16; i++) tot += Number(brackets[i]);
                    let count = 0;
                    for(let i = 0; i < 16; i++) {
                        count+=Number(brackets[i]);
                        if(count > tot/2) {
                            let frac = (tot/2 - (count - Number(brackets[i])))/Number(brackets[i]);
                            if(i === 0) medInc = 10000*frac;
                            else if(i > 0 && i < 9) medInc = 10000 + 5000*(i-1) + 5000*frac;
                            else if(i === 9) medInc = 50000 + 10000*frac;
                            else if(i === 10) medInc = 60000 + 15000*frac;
                            else if(i > 10 && i < 14) medInc = 75000 + 25000*(i-11) + 25000*frac;
                            else if(i === 14) medInc = 150000 + 50000*frac;
                            else if(i === 15) medInc = 200000;
                            break;
                        }
                    }
                    
                }
                if(this.sortBy === "m") {
                    if(feature.properties.MEDN_INC22 !== undefined) popup += "<p>Median Income: $" + readableNum(medInc) + "</p>";
                    else popup += "<p>Median Income (Estimate): $" + readableNum(Number(medInc).toFixed(0)) + "</p>";
                    if(medInc < 30000) layer.options.fillColor = "#FF0000";
                    else if(medInc < 60000) layer.options.fillColor = "#CC0033";
                    else if(medInc < 75000) layer.options.fillColor = "#990066";
                    else if(medInc < 100000) layer.options.fillColor = "#660099";
                    else if(medInc < 125000) layer.options.fillColor = "#3300CC";
                    else if(medInc < 150000) layer.options.fillColor = "#0000FF";
                    else layer.options.fillColor = "darkblue";
                }
                else {
                    let count = 0;
                    for(let i = this.min; i < this.max; i++) count+= Number(brackets[i]);
                    let frac = ((count/tot)*100).toFixed(10);
                    if(frac < 10) layer.options.fillColor = "#ffff3f";
                    else if(frac < 20) layer.options.fillColor = "#eeef20";
                    else if(frac < 30) layer.options.fillColor = "#dddf00";
                    else if(frac < 40) layer.options.fillColor = "#d4d700";
                    else if(frac < 50) layer.options.fillColor = "#bfd200";
                    else if(frac < 60) layer.options.fillColor = "#aacc00";
                    else if(frac < 70) layer.options.fillColor = "#80b918";
                    else if(frac < 80) layer.options.fillColor = "#55a630";
                    else if(frac < 90) layer.options.fillColor = "#2b9348";
                    else layer.options.fillColor = "darkgreen";
                }
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
                if(frac < 10) layer.options.fillColor = "#ffff3f";
                else if(frac < 20) layer.options.fillColor = "#eeef20";
                else if(frac < 30) layer.options.fillColor = "#dddf00";
                else if(frac < 40) layer.options.fillColor = "#d4d700";
                else if(frac < 50) layer.options.fillColor = "#bfd200";
                else if(frac < 60) layer.options.fillColor = "#aacc00";
                else if(frac < 70) layer.options.fillColor = "#80b918";
                else if(frac < 80) layer.options.fillColor = "#55a630";
                else if(frac < 90) layer.options.fillColor = "#2b9348";
                else layer.options.fillColor = "007f5f";

                if(feature.properties.TOT_POP22 !== undefined)popup += "<p>Total Population: " + readableNum(feature.properties.TOT_POP22) + "</p>";
                popup += "<table><thead><tr><th>Race</th><th>Population</th><th>Percent of Total</th></tr></thead><tbody>";
                if(feature.properties.WHT_NHSP22 !== undefined && feature.properties.WHT_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>White</td><td>" +    readableNum(feature.properties.WHT_NHSP22) + "</td><td>" + ((feature.properties.WHT_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.BLK_NHSP22 !== undefined && feature.properties.BLK_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Black</td><td>" +    readableNum(feature.properties.BLK_NHSP22) + "</td><td>" + ((feature.properties.BLK_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.HSP_POP22 !== undefined && feature.properties.HSP_POP22 > feature.properties.TOT_POP22/100) popup +=    "<tr><td>Hispanic</td><td>" + readableNum(feature.properties.HSP_POP22)  + "</td><td>" + ((feature.properties.HSP_POP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.ASN_NHSP22 !== undefined && feature.properties.ASN_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Asian</td><td>" +    readableNum(feature.properties.ASN_NHSP22) + "</td><td>" + ((feature.properties.ASN_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.AIA_NHSP22 !== undefined && feature.properties.AIA_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Native</td><td>" +   readableNum(feature.properties.AIA_NHSP22) + "</td><td>" +((feature.properties.AIA_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                popup+="</tbody></table>";
            }

            layer.on('mouseover', function (e) {
                if(popup !== undefined) {
                    document.getElementById("map_popup").style.visibility = 'visible';
                    document.getElementById("map_popup").innerHTML = popup;
                }
            });
            layer.on('mouseout', function(e){
                if(selectedPopup !== undefined) {
                    document.getElementById("map_popup").style.visibility = 'visible';
                    document.getElementById("map_popup").innerHTML = selectedPopup;
                }
                else document.getElementById("map_popup").style.visibility = 'hidden';
            })
            layer.on('click', function (e) {
                if(popup !== undefined) {
                    document.getElementById("map_popup").style.visibility = 'visible';
                    document.getElementById("map_popup").innerHTML = popup;
                }
                if(selectedFeature !== layer) {
                    selectedPopup = popup;
                    if(selectedFeature !== undefined) selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                    selectedFeature = layer;
                    selectedFeatureColor = layer.options.fillColor;
                    layer.setStyle({fillColor: "black", fillOpacity: "1"});
                }
                else {
                    selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                    selectedFeature = undefined;
                    selectedFeatureColor = undefined;
                    selectedPopup = undefined;
                    document.getElementById("map_popup").style.visibility = 'hidden';
                }
            });
        }
        let i = 0;
        const data = this.data.map(d => <GeoJSON onEachFeature={countyHover} key={"Data-"+(i++)+"-o-"+opacity} data={d.features} style={{color: "black", fillOpacity: opacity, weight: 1}}/>);
        return (
            <div class="map_countainer">
                <MapContainer id="main_map" center={this.center} zoom={this.zoom} scrollWheelZoom={false} >
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    />
                    {data}
                </MapContainer>
                {legend}
                <div id="map_popup"></div>
            </div>
        );
    }
}


export default BasicMap;