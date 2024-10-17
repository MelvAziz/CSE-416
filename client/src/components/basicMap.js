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
        this.setData = this.props.setData;
        this.min = this.props.min;
        this.max = this.props.max;
    }
    render() {
        let setData = this.setData;
        let opacity = 0.5;
        let selectedPopup;
        let selectedFeature;
        let selectedFeatureColor;
        let legend;
        if(this.viewMode !== 0) opacity = 0.85;
        if(this.viewMode === 1  && this.sortBy === "med") legend = <MapLegend colors={["#FF0000", "#CC0033", "#990066", "#660099",  "#3300CC", "#0000FF", "darkblue"]} labels={ ["<45k", "45-60k", "60-75k", "75-100k", "100-125k", "125-150k", ">150k"]}/>
        else if((this.viewMode === 2 || (this.viewMode === 1 && this.sortBy === "inc")) ||  this.sortBy === "ecowht" || this.sortBy === "ecoblk" || this.sortBy === "ecohsp") legend =     <MapLegend colors={["#ffff3f", "#eeef20", "#dddf00", "#d4d700", "#bfd200", "#aacc00", "#80b918", "#55a630", "#2b9348", "#007f5f"]} labels={ ["<10%", "10-20%", "20-30%", "30-40%", "40-50%", "50-60%", "60-70%", "70-80%", "80-90%", "90-100"]}/>
        else if(this.viewMode === 3 && (this.sortBy === "sen1" || this.sortBy === "gov1")) legend = <MapLegend colors={[null, "#000066", "#000099", "#0000CC", "#0000ff", "#3333FF", "#FF4C4C", "#ff0000", "#CC0000", "#990000", "#660000", null]} labels={["Democratic", "90-100%", "75-90%", "60-75%", "45-60%", "30-45%", "30-45%", "45-60%", "60-75%", "75-90%", "90-100%", "Republican"]}/>;
        else if(this.viewMode === 3 && (this.sortBy === "sen2" || this.sortBy === "gov2")) legend = <MapLegend colors={["#000066", "#000099", "#0000CC", "#0000ff", "#3333FF", "#6666FF", "#9999FF"]} labels={["90-100%", "75-90%", "60-75%", "45-60%", "30-45%", "15-30%", "0-15%"]}/>;
        else if(this.viewMode === 3 && (this.sortBy === "sen3" || this.sortBy === "gov3")) legend = <MapLegend colors={["#660000", "#990000", "#CC0000", "#ff0000", "#FF3333", "#FF6666", "#FF9999"]} labels={["90-100%", "75-90%", "60-75%", "45-60%", "30-45%", "15-30%", "0-15%"]}/>;
        function readableNum(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
        const countyHover = (feature, layer) =>{
            let currentState = this.data[0].name;
            const name = feature.properties.NAME;
            let popup =  "<p>" + name + "</p>";;  
            let viewMode = this.viewMode;  
            let sortBy = this.sortBy;      
            if(viewMode === 1 || this.sortBy === "ecoinc") {
                let brackets = [feature.properties.LESS_10K22, feature.properties["10K_15K22"], feature.properties["15K_20K22"], feature.properties["20K_25K22"], feature.properties["25K_30K22"], feature.properties["30K_35K22"], feature.properties["35K_40K22"], feature.properties["40K_45K22"],  feature.properties["45K_50K22"], feature.properties["50K_60K22"], feature.properties["60K_75K22"], feature.properties["75K_100K22"], feature.properties["100_125K22"], feature.properties["125_150K22"], feature.properties["150_200K22"], feature.properties["200K_MOR22"]];
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
                if(feature.properties.MEDN_INC22 !== undefined) popup += "<p>Median Income: $" + readableNum(medInc) + "</p>";
                else popup += "<p>Median Income (Estimate): $" + readableNum(Number(medInc).toFixed(0)) + "</p>";
                if(this.sortBy === "med" || this.sortBy === "ecoinc" ) {
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
            else if(viewMode === 2 || ((viewMode === 4 || viewMode === 5 || viewMode === 6) && this.sortBy !== "ecoinc")) {
                let total = feature.properties.TOT_POP22;
                let pop = 0;
                if(this.sortBy === "wht" || this.sortBy === "ecowht") pop = feature.properties.WHT_NHSP22;
                else if(this.sortBy === "blk" || this.sortBy === "ecoblk") pop = feature.properties.BLK_NHSP22;
                else if(this.sortBy === "hsp" || this.sortBy === "ecohsp") pop = feature.properties.HSP_POP22;
                else if(this.sortBy === "asn") pop = feature.properties.ASN_NHSP22;
                else if(this.sortBy === "aia") pop = feature.properties.AIA_NHSP22;
                else pop = 100;
                let frac = ((pop/total)*100).toFixed(10);
                if(frac < 10 || pop === undefined) layer.options.fillColor = "#ffff3f";
                else if(frac < 20) layer.options.fillColor = "#eeef20";
                else if(frac < 30) layer.options.fillColor = "#dddf00";
                else if(frac < 40) layer.options.fillColor = "#d4d700";
                else if(frac < 50) layer.options.fillColor = "#bfd200";
                else if(frac < 60) layer.options.fillColor = "#aacc00";
                else if(frac < 70) layer.options.fillColor = "#80b918";
                else if(frac < 80) layer.options.fillColor = "#55a630";
                else if(frac < 90) layer.options.fillColor = "#2b9348";
                else layer.options.fillColor = "#007f5f";

                if(feature.properties.TOT_POP22 !== undefined)popup += "<p>Total Population: " + readableNum(feature.properties.TOT_POP22) + "</p>";
                popup += "<table><thead><tr><th>Race</th><th>Population</th><th>Percent of Total</th></tr></thead><tbody>";
                if(feature.properties.WHT_NHSP22 !== undefined && feature.properties.WHT_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>White</td><td>" +    readableNum(feature.properties.WHT_NHSP22) + "</td><td>" + ((feature.properties.WHT_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.BLK_NHSP22 !== undefined && feature.properties.BLK_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Black</td><td>" +    readableNum(feature.properties.BLK_NHSP22) + "</td><td>" + ((feature.properties.BLK_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.HSP_POP22 !== undefined && feature.properties.HSP_POP22 > feature.properties.TOT_POP22/100) popup +=    "<tr><td>Hispanic</td><td>" + readableNum(feature.properties.HSP_POP22)  + "</td><td>" + ((feature.properties.HSP_POP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.ASN_NHSP22 !== undefined && feature.properties.ASN_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Asian</td><td>" +    readableNum(feature.properties.ASN_NHSP22) + "</td><td>" + ((feature.properties.ASN_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                if(feature.properties.AIA_NHSP22 !== undefined && feature.properties.AIA_NHSP22 > feature.properties.TOT_POP22/100) popup +=  "<tr><td>Native</td><td>" +   readableNum(feature.properties.AIA_NHSP22) + "</td><td>" +((feature.properties.AIA_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) + "%</td></tr>"
                popup+="</tbody></table>";
            }
            else if(viewMode === 3) {
                let tot = Number(feature.properties.G22USSDBOY) + Number(feature.properties.G22USSLSOP) + Number(feature.properties.G22USSOWRI) + Number(feature.properties.G22USSRBRI);
                let dem = Number(feature.properties.G22USSDBOY);
                let rep = Number(feature.properties.G22USSRBRI);
                popup += "<p>Total Votes: " + tot + "</p><table><thead><tr><th>Candidate</th><th>Votes</th><th>Percent of Total</th></tr></thead><tbody>";
                if(currentState === "alabama") {
                    if(this.sortBy === "gov1" || this.sortBy === "gov2" || this.sortBy === "gov3") {
                        tot = Number(feature.properties.G22GOVDFLO) + Number(feature.properties.G22GOVLBLA) + Number(feature.properties.G22GOVOWRI) + Number(feature.properties.G22GOVRIVE);
                        dem = Number(feature.properties.G22GOVDFLO);
                        rep = Number(feature.properties.G22GOVRIVE);
                        popup += "<tr><td>(Dem)Yolanda Flowers</td><td>" + dem + "</td><td>" + ((dem/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Rep)Kay Ivey</td><td>" + rep + "</td><td>" + ((rep/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Lib)James Blake</td><td>" + Number(feature.properties.G22GOVLBLA) + "</td><td>" + ((Number(feature.properties.G22GOVLBLA)/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "</tbody></table>";
                    }
                    else {
                        popup += "<tr><td>(Dem)Will Boyd</td><td>" + dem + "</td><td>" + ((dem/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Rep)Katie Britt</td><td>" + rep + "</td><td>" + ((rep/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Lib)John Sophocleus</td><td>" + Number(feature.properties.G22USSLSOP) + "</td><td>" + ((Number(feature.properties.G22USSLSOP)/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "</tbody></table>";
                    }
                }
                else {
                    if(this.sortBy === "gov1" || this.sortBy === "gov2" || this.sortBy === "gov3") {
                        tot = Number(feature.properties.G20PREDBID) + Number(feature.properties.G20PRERTRU) + Number(feature.properties.G20PRELJOR) + Number(feature.properties.G20PREGHAW) + Number(feature.properties.G20PREOWRI);
                        dem = Number(feature.properties.G20PREDBID);
                        rep = Number(feature.properties.G20PRERTRU);
                        popup += "<tr><td>(Dem)Joe Biden</td><td>" + dem + "</td><td>" + ((dem/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Rep)Donald Trump</td><td>" + rep + "</td><td>" + ((rep/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Lib)Jo Jorgensen</td><td>" + Number(feature.properties.G20PRELJOR) + "</td><td>" + ((Number(feature.properties.G20PRELJOR)/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Gre)Howie Hawkins</td><td>" + Number(feature.properties.G20PREGHAW) + "</td><td>" + ((Number(feature.properties.G20PREGHAW)/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "</tbody></table>";
                    }
                    else {
                        tot = Number(feature.properties.G20USSDMAR) + Number(feature.properties.G20USSROCO) + Number(feature.properties.G20USSOAYY) + Number(feature.properties.G20PREGHAW) + Number(feature.properties.G20USSOWRI);
                        dem = Number(feature.properties.G20USSDMAR);
                        rep = Number(feature.properties.G20USSROCO);
                        popup += "<tr><td>(Dem)Ed Markey</td><td>" + dem + "</td><td>" + ((dem/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Rep)Kevin O'Conner</td><td>" + rep + "</td><td>" + ((rep/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "<tr><td>(Ind)Shiva Ayyadurai</td><td>" + Number(feature.properties.G20USSOAYY) + "</td><td>" + ((Number(feature.properties.G20USSOAYY)/tot)*100).toFixed(2)  +"%</td></tr>";
                        popup += "</tbody></table>";
                    }
                }
                if(this.sortBy === "sen1" || this.sortBy === "gov1") {
                    if(dem > rep)  {
                        if(dem/tot > 0.9) layer.options.fillColor = "#000066";
                        else if(dem/tot > 0.75) layer.options.fillColor = "#000099";
                        else if(dem/tot > 0.6) layer.options.fillColor = "#0000CC";
                        else if(dem/tot > 0.45) layer.options.fillColor = "#0000ff";
                        else if(dem/tot > 0.3) layer.options.fillColor = "#3333FF";
                    }
                    else if(rep > dem)  {
                        if(rep/tot > 0.9) layer.options.fillColor = "#660000";
                        else if(rep/tot > 0.75) layer.options.fillColor = "#990000";
                        else if(rep/tot > 0.6) layer.options.fillColor = "#CC0000";
                        else if(rep/tot > 0.45) layer.options.fillColor = "#ff0000";
                        else if(rep/tot > 0.3) layer.options.fillColor = "#FF4C4C";
                    }
                }
                else if(this.sortBy === "sen2" || this.sortBy === "gov2") {
                    if(dem/tot > 0.9) layer.options.fillColor = "#000066";
                    else if(dem/tot > 0.75) layer.options.fillColor = "#000099";
                    else if(dem/tot > 0.6) layer.options.fillColor = "#0000CC";
                    else if(dem/tot > 0.45) layer.options.fillColor = "#0000ff";
                    else if(dem/tot > 0.3) layer.options.fillColor = "#3333FF";
                    else if(dem/tot > 0.15) layer.options.fillColor = "#6666FF";
                    else layer.options.fillColor = "#9999FF";
                }
                else if(this.sortBy === "sen3" || this.sortBy === "gov3") {
                    if(rep/tot > 0.9) layer.options.fillColor = "#660000";
                    else if(rep/tot > 0.75) layer.options.fillColor = "#990000";
                    else if(rep/tot > 0.6) layer.options.fillColor = "#CC0000";
                    else if(rep/tot > 0.45) layer.options.fillColor = "#ff0000";
                    else if(rep/tot > 0.3) layer.options.fillColor = "#FF3333";
                    else if(rep/tot > 0.15) layer.options.fillColor = "#FF6666";
                    else layer.options.fillColor = "#FF9999";
                }
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
                let barTitle = name;
                if(selectedFeature !== layer) {
                    console.log(viewMode);
                    if(viewMode === 1)setData(barTitle, [feature.properties.LESS_10K22, feature.properties["10K_15K22"], feature.properties["15K_20K22"], feature.properties["20K_25K22"], feature.properties["25K_30K22"], feature.properties["30K_35K22"], feature.properties["35K_40K22"], feature.properties["40K_45K22"],  feature.properties["45K_50K22"], feature.properties["50K_60K22"], feature.properties["60K_75K22"], feature.properties["75K_100K22"], feature.properties["100_125K22"], feature.properties["125_150K22"], feature.properties["150_200K22"], feature.properties["200K_MOR22"]]);
                    else if(viewMode === 2) setData(barTitle, [feature.properties.WHT_NHSP22, feature.properties.BLK_NHSP22, feature.properties.HSP_POP22, Number(feature.properties.TOT_POP22) - Number(feature.properties.HSP_POP22) - Number(feature.properties.BLK_NHSP22) - Number(feature.properties.WHT_NHSP22)]);
                    else if(viewMode === 3) {
                        if((sortBy === "gov1" || sortBy === "gov2"  || sortBy === "gov3") && currentState === "massachusetts") setData(name + " (President)", [[feature.properties.G20PREDBID, feature.properties.G20PRERTRU, Number(feature.properties.G20PRELJOR) + Number(feature.properties.G20PREOWRI) + Number(feature.properties.G20PREGHAW)], ["Donald Trump", "Joe Biden", "Other"]]);
                        else if((sortBy === "sen1" || sortBy === "sen2"  || sortBy === "sen3") && currentState === "massachusetts") setData(name + " (Senate)", [[feature.properties.G20USSDMAR, feature.properties.G20USSROCO, Number(feature.properties.G20USSOAYY) + Number(feature.properties.G20USSOWRI)], ["Ed Markey", "Kevin O'Connor", "Other"]]);
                        else if((sortBy === "gov1" || sortBy === "gov2"  || sortBy === "gov3") && currentState === "alabama") setData(name + " (Governor)", [[feature.properties.G22GOVDFLO, feature.properties.G22GOVRIVE, Number(feature.properties.G22GOVLBLA) + Number(feature.properties.G22GOVOWRI)], ["Yolanda Flowers", "Kay Ivey", "Other"]]);
                        else if((sortBy === "sen1" || sortBy === "sen2"  || sortBy === "sen3") && currentState === "alabama") setData(name + " (Senate)", [[feature.properties.G22USSDBOY, feature.properties.G22USSRBRI, Number(feature.properties.G22USSOWRI) + Number(feature.properties.G22USSLSOP)], ["Will Boyd", "Katie Britt", "Other"]]);
                    
                    }
                    selectedPopup = popup;
                    if(selectedFeature !== undefined) selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                    selectedFeature = layer;
                    selectedFeatureColor = layer.options.fillColor;
                    layer.setStyle({fillColor: "black", fillOpacity: "1"});
                }
                else {
                    barTitle = currentState[0].toUpperCase() + currentState.substring(1, currentState.length);
                    if(viewMode === 3) {
                        if((sortBy === "gov1" || sortBy === "gov2"  || sortBy === "gov3") && currentState === "massachusetts") barTitle += " (President)";
                        else if((sortBy === "gov1" || sortBy === "gov2"  || sortBy === "gov3") && currentState === "alabama") barTitle += " (Governor)";
                        else barTitle += " (Senator)"
                    }
                    setData(barTitle, undefined);
                    selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                    selectedFeature = undefined;
                    selectedFeatureColor = undefined;
                    selectedPopup = undefined;
                    document.getElementById("map_popup").style.visibility = 'hidden';
                }
            });
        }
        let i = 0;
        const data = this.data.map(d => <GeoJSON onEachFeature={countyHover} key={"Data-"+(i++)+"-o-"+opacity+"-s-"} data={d.features} style={{color: "black", fillOpacity: opacity, weight: 1}}/>);
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