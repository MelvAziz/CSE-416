import React from 'react'
import * as turf from '@turf/turf';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import MapLegend from './mapLegend';
import {Page, MapLevel, SortingMethod} from '../constants.js';


class Map extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.center = this.props.center;
        this.zoom = this.props.zoom;
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
        let urbanMap = this.sortBy === SortingMethod.urbanRural || this.sortBy === SortingMethod.urban || this.sortBy === SortingMethod.suburban || this.sortBy === SortingMethod.rural;
        let showMedianIncome = this.sortBy === SortingMethod.medianIncome 
                        || this.sortBy === SortingMethod.E0to25
                        || this.sortBy === SortingMethod.E25to50
                        || this.sortBy === SortingMethod.E50to75
                        || this.sortBy === SortingMethod.E75to100
                        || this.sortBy === SortingMethod.E100to125
                        || this.sortBy === SortingMethod.E125to150
                        || this.sortBy === SortingMethod.E150more;

        if (this.viewMode !== Page.selectStatePage) opacity = 0.85;
        if(this.viewMode === Page.overviewPage) opacity = 0.7;
        else if (showMedianIncome) 
            legend = <MapLegend 
                        colors={["#FF0000", "#CC0033", "#990066", "#660099",  "#3300CC",  "#0000FF", "darkblue"]} // Red -> Dark Blue
                        labels={["<25k",    "25-50k",  "50-75k",  "75-100k",  "100-125k", "125-150k",">150k"]}
                    />
        else if(this.sortBy === SortingMethod.politicalIncome) {
            legend = <MapLegend 
            colors={[null,          "#000066", "#000099", "#0000CC", "#0000ff", "#3333FF", "#6666FF", "#9999FF", "#FF9999", "#FF6666", "#FF4C4C", "#ff0000", "#CC0000", "#990000", "#660000", null]} // Blue -> Red
            labels={["Democratic",  "150k+",   "125-150k","100-125k","75-100k", "50-75k",  "25-50k",  ">25k",    ">25k",    "25-50k",  "50-75k",  "75-100k", "100-125k","125-150k","150k+", "Republican"]}
        />;
        }
        else if (this.sortBy === SortingMethod.whiteRace || this.sortBy === SortingMethod.blackRace || this.sortBy === SortingMethod.whiteRaceIncome || this.sortBy === SortingMethod.blackRaceIncome) 
            legend = <MapLegend 
                        colors={["#ffff3f", "#eeef20", "#dddf00", "#d4d700", "#bfd200", "#aacc00", "#80b918", "#55a630", "#2b9348", "#007f5f"]} // Light Green -> Dark Green
                        labels={["<10%",    "10-20%",  "20-30%",  "30-40%",  "40-50%",  "50-60%",  "60-70%",  "70-80%",  "80-90%",  "90-100"]}
                    />
        else if (this.viewMode === Page.electionPage && this.sortBy === SortingMethod.bothPartiesElection) 
            legend = <MapLegend 
                        colors={[null,          "#000066", "#000099", "#0000CC", "#0000ff", "#3333FF", "#FF4C4C", "#ff0000", "#CC0000", "#990000", "#660000", null]} // Blue -> Red
                        labels={["Democratic",  "90-100%", "75-90%",  "60-75%",  "45-60%",  "30-45%",  "30-45%",  "45-60%",  "60-75%",  "75-90%",  "90-100%", "Republican"]}
                    />;
        else if (this.viewMode === Page.electionPage && this.sortBy === SortingMethod.democraticElection) 
            legend = <MapLegend 
                        colors={["#000066", "#000099", "#0000CC", "#0000ff", "#3333FF", "#6666FF", "#9999FF"]}  //light blue -> Blue
                        labels={["90-100%", "75-90%",  "60-75%",  "45-60%",  "30-45%",  "15-30%",  "0-15%"]}
                    />;
        else if (this.viewMode === Page.electionPage && this.sortBy === SortingMethod.republicanElection) 
            legend = <MapLegend 
                        colors={["#660000", "#990000", "#CC0000", "#ff0000", "#FF3333", "#FF6666", "#FF9999"]} //light red -> Red
                        labels={["90-100%", "75-90%",  "60-75%",  "45-60%",  "30-45%",  "15-30%",  "0-15%"]}
                    />;
        else if (urbanMap) 
            legend = <MapLegend 
                        colors={["yellow", "darkorange", "purple"]} 
                        labels={["Rural",  "Suburban",   "Urban"]}
                    />;
        function readableNum(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        const countyHover = (feature, layer) =>{
            let currentState = this.data.name.split('_')[0];
            const name = feature.properties.NAME;
            let popup =  "<p>" + name + "</p>";;  
            let viewMode = this.viewMode;  
            let switchState = this.props.switchState; 
            if (viewMode === Page.selectStatePage) {
                if (feature.properties.name === "Alabama" || feature.properties.name === "Massachusetts")
                    layer.options.fillOpacity = 0.8;
                else layer.options.fillOpacity = 0.2;
                popup = "";
            }
            else if (viewMode === Page.overviewPage) {
                layer.options.fillColor = "white";
                layer.options.fillOpacity = 0.6;
            
            }
            else if (viewMode === Page.economicPage || urbanMap || showMedianIncome) {
                let brackets = [
                    feature.properties.LESS_10K22 
                        + feature.properties["10K_15K22"] 
                        + feature.properties["15K_20K22"] 
                        + feature.properties["20K_25K22"], 
                    feature.properties["25K_30K22"] 
                        + feature.properties["30K_35K22"] 
                        + feature.properties["35K_40K22"] 
                        + feature.properties["40K_45K22"] 
                        + feature.properties["45K_50K22"], 
                    feature.properties["50K_60K22"] 
                        + feature.properties["60K_75K22"], 
                    feature.properties["75K_100K22"], 
                    feature.properties["100_125K22"], 
                    feature.properties["125_150K22"], 
                    feature.properties["150_200K22"] + feature.properties["200K_MOR22"]
                ];
                let medianIncome = feature.properties.MEDN_INC22;   
                let totalHouses =  feature.properties.TOT_HOUS22;
                if (medianIncome === undefined) {
                    totalHouses = 0;
                    for (let i = 0; i < 6; i++) totalHouses += Number(brackets[i]);
                    let count = 0;
                    for (let i = 0; i < 6; i++) {
                        count+=Number(brackets[i]);
                        if(count > totalHouses/2) {
                            medianIncome = count + 25000*(i + (totalHouses/2 - (count - Number(brackets[i])))/Number(brackets[i]));
                            break;
                        }
                    }
                }
                if (feature.properties.MEDN_INC22 !== undefined) popup += "<p>Median Income: $" + readableNum(medianIncome) + "</p>";
                else popup += "<p>Median Income (Estimate): $" + readableNum(Number(medianIncome).toFixed(0)) + "</p>";
                if (showMedianIncome) {
                    if (medianIncome < 25000) layer.options.fillColor = "#FF0000";
                    else if (medianIncome < 50000) layer.options.fillColor = "#CC0033";
                    else if (medianIncome < 75000) layer.options.fillColor = "#990066";
                    else if (medianIncome < 100000) layer.options.fillColor = "#660099";
                    else if (medianIncome < 125000) layer.options.fillColor = "#3300CC";
                    else if (medianIncome < 150000) layer.options.fillColor = "#0000FF";
                    else layer.options.fillColor = "darkblue";
                }
                else if (urbanMap) {
                    // https://www.mass.gov/doc/rural-definition-detail-0/download
                    // let area = turf.area(layer.toGeoJSON())/(1000000);
                    let popDensity = feature.properties.TOT_POP22/(Number(feature.properties.ALAND20)/1000000);
                    // console.log(feature.properties.REGION);
                    if(feature.properties.REGION === "U") layer.options.fillColor = "purple";
                    else if(feature.properties.REGION === "S") layer.options.fillColor = "darkorange";
                    else if(feature.properties.REGION === "R") layer.options.fillColor = "yellow";

                    popup += "<p>Pop. Density: " + Number(popDensity).toFixed(2) + "</p>";

                }
                else {
                    let count = 0;
                    for (let i = this.min; i < this.max; i++) count += Number(brackets[i]);
                    let frac = ((count/totalHouses)*100).toFixed(10);
                    if (frac < 10) layer.options.fillColor = "#ffff3f"; //light green
                    else if (frac < 20) layer.options.fillColor = "#eeef20";
                    else if (frac < 30) layer.options.fillColor = "#dddf00";
                    else if (frac < 40) layer.options.fillColor = "#d4d700";
                    else if (frac < 50) layer.options.fillColor = "#bfd200";
                    else if (frac < 60) layer.options.fillColor = "#aacc00";
                    else if (frac < 70) layer.options.fillColor = "#80b918";
                    else if (frac < 80) layer.options.fillColor = "#55a630";
                    else if (frac < 90) layer.options.fillColor = "#2b9348";
                    else layer.options.fillColor = "darkgreen";
                }
            }
            else if (this.sortBy === SortingMethod.whiteRace || this.sortBy === SortingMethod.blackRace || this.sortBy === SortingMethod.whiteRaceIncome || this.sortBy === SortingMethod.blackRaceIncome) {
                let totalPopulation = feature.properties.TOT_POP22;
                let selectedPopulation = feature.properties.WHT_NHSP22;
                if (this.sortBy === SortingMethod.blackRace || this.sortBy === SortingMethod.blackRaceIncome)       selectedPopulation = feature.properties.BLK_NHSP22;
                // else if (this.sortBy === "hsp")  selectedPopulation = feature.properties.HSP_POP22;
                let frac = ((selectedPopulation/totalPopulation)*100).toFixed(10);
                if (frac < 10 || selectedPopulation === undefined) layer.options.fillColor = "#ffff3f";
                else if (frac < 20) layer.options.fillColor = "#eeef20";
                else if (frac < 30) layer.options.fillColor = "#dddf00";
                else if (frac < 40) layer.options.fillColor = "#d4d700";
                else if (frac < 50) layer.options.fillColor = "#bfd200";
                else if (frac < 60) layer.options.fillColor = "#aacc00";
                else if (frac < 70) layer.options.fillColor = "#80b918";
                else if (frac < 80) layer.options.fillColor = "#55a630";
                else if (frac < 90) layer.options.fillColor = "#2b9348";
                else layer.options.fillColor = "#007f5f";

                if(feature.properties.TOT_POP22 !== undefined)
                    popup += "<p>Total Population: " + readableNum(feature.properties.TOT_POP22) + "</p>";
                popup += "<table><thead><tr><th>Race</th><th>Population</th><th>Percent of Total</th></tr></thead><tbody>";
                if(feature.properties.WHT_NHSP22 !== undefined && feature.properties.WHT_NHSP22 > feature.properties.TOT_POP22/100) 
                    popup   +=  "<tr><td>White</td><td>" 
                            + readableNum(feature.properties.WHT_NHSP22) 
                            + "</td><td>" 
                            + ((feature.properties.WHT_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) 
                            + "%</td></tr>";
                if(feature.properties.BLK_NHSP22 !== undefined && feature.properties.BLK_NHSP22 > feature.properties.TOT_POP22/100) 
                    popup   +=  "<tr><td>Black</td><td>" 
                            +  readableNum(feature.properties.BLK_NHSP22) 
                            + "</td><td>" 
                            + ((feature.properties.BLK_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) 
                            + "%</td></tr>";
                if(feature.properties.HSP_POP22 !== undefined && feature.properties.HSP_POP22 > feature.properties.TOT_POP22/100) 
                    popup   += "<tr><td>Hispanic</td><td>" 
                            + readableNum(feature.properties.HSP_POP22) 
                            + "</td><td>" 
                            + ((feature.properties.HSP_POP22/feature.properties.TOT_POP22) * 100).toFixed(2) 
                            + "%</td></tr>";
                if(feature.properties.ASN_NHSP22 !== undefined && feature.properties.ASN_NHSP22 > feature.properties.TOT_POP22/100) 
                    popup   +=  "<tr><td>Asian</td><td>" 
                            + readableNum(feature.properties.ASN_NHSP22) 
                            + "</td><td>" 
                            + ((feature.properties.ASN_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) 
                            + "%</td></tr>";
                if(feature.properties.AIA_NHSP22 !== undefined && feature.properties.AIA_NHSP22 > feature.properties.TOT_POP22/100) 
                    popup   +=  "<tr><td>Native</td><td>" 
                            + readableNum(feature.properties.AIA_NHSP22) 
                            + "</td><td>" 
                            + ((feature.properties.AIA_NHSP22/feature.properties.TOT_POP22) * 100).toFixed(2) 
                            + "%</td></tr>";
                popup +="</tbody></table>";
            }
            else if (viewMode === Page.electionPage || this.sortBy === SortingMethod.politicalIncome) {
                let totalVotes = 
                    Number(feature.properties.G22USSDBOY) 
                    + Number(feature.properties.G22USSLSOP) 
                    + Number(feature.properties.G22USSOWRI) 
                    + Number(feature.properties.G22USSRBRI);
                let democraticVotes = Number(feature.properties.G22USSDBOY);
                let republicanVotes = Number(feature.properties.G22USSRBRI);
                if (currentState === "alabama") {
                    popup += "<p>Total Votes: " + totalVotes + "</p><table><thead><tr><th>Candidate</th><th>Votes</th><th>Percent of Total</th></tr></thead><tbody>";
                    popup   += "<tr><td>(Dem)Will Boyd</td><td>" 
                            + democraticVotes 
                            + "</td><td>" 
                            + ((democraticVotes/totalVotes)*100).toFixed(2) 
                            + "%</td></tr>";
                    popup   += "<tr><td>(Rep)Katie Britt</td><td>" 
                            + republicanVotes 
                            + "</td><td>" 
                            + ((republicanVotes/totalVotes)*100).toFixed(2)  
                            + "%</td></tr>";
                    popup += "</tbody></table>";
                }
                else {
                    totalVotes = 
                        Number(feature.properties.G20PREDBID) 
                        + Number(feature.properties.G20PRERTRU) 
                        + Number(feature.properties.G20PRELJOR) 
                        + Number(feature.properties.G20PREGHAW) 
                        + Number(feature.properties.G20PREOWRI);
                    popup += "<p>Total Votes: " + totalVotes + "</p><table><thead><tr><th>Candidate</th><th>Votes</th><th>Percent of Total</th></tr></thead><tbody>";
                    
                    democraticVotes = Number(feature.properties.G20PREDBID);
                    republicanVotes = Number(feature.properties.G20PRERTRU);
                    popup   += "<tr><td>(Dem)Joe Biden</td><td>" 
                            + democraticVotes + "</td><td>" 
                            + ((democraticVotes/totalVotes)*100).toFixed(2)
                            + "%</td></tr>";
                    popup   += "<tr><td>(Rep)Donald Trump</td><td>" 
                            + republicanVotes 
                            + "</td><td>"
                            + ((republicanVotes/totalVotes)*100).toFixed(2)  
                            + "%</td></tr>";
                    popup   += "</tbody></table>";
                }
                if (this.sortBy === SortingMethod.bothPartiesElection) {
                    if (democraticVotes > republicanVotes)  {
                        if (democraticVotes/totalVotes > 0.9) layer.options.fillColor = "#000066"; // dark blue
                        else if (democraticVotes/totalVotes > 0.75) layer.options.fillColor = "#000099";
                        else if (democraticVotes/totalVotes > 0.6) layer.options.fillColor = "#0000CC";
                        else if (democraticVotes/totalVotes > 0.45) layer.options.fillColor = "#0000ff";
                        else if (democraticVotes/totalVotes > 0.3) layer.options.fillColor = "#3333FF"; // lighter blue
                    }
                    else if (republicanVotes > democraticVotes)  {
                        if (republicanVotes/totalVotes > 0.9) layer.options.fillColor = "#660000"; // dark red
                        else if (republicanVotes/totalVotes > 0.75) layer.options.fillColor = "#990000";
                        else if (republicanVotes/totalVotes > 0.6) layer.options.fillColor = "#CC0000";
                        else if (republicanVotes/totalVotes > 0.45) layer.options.fillColor = "#ff0000";
                        else if (republicanVotes/totalVotes > 0.3) layer.options.fillColor = "#FF4C4C"; // lighter red
                    }
                }
                else if (this.sortBy === SortingMethod.democraticElection) {
                    if (democraticVotes/totalVotes > 0.9) layer.options.fillColor = "#000066"; // dark blue
                    else if (democraticVotes/totalVotes > 0.75) layer.options.fillColor = "#000099";
                    else if (democraticVotes/totalVotes > 0.6) layer.options.fillColor = "#0000CC";
                    else if (democraticVotes/totalVotes > 0.45) layer.options.fillColor = "#0000ff";
                    else if (democraticVotes/totalVotes > 0.3) layer.options.fillColor = "#3333FF";
                    else if (democraticVotes/totalVotes > 0.15) layer.options.fillColor = "#6666FF"; // lighter red
                    else layer.options.fillColor = "#9999FF"; // dark blue
                }
                else if(this.sortBy === SortingMethod.republicanElection) {
                    if (republicanVotes/totalVotes > 0.9) layer.options.fillColor = "#660000"; // dark red
                    else if (republicanVotes/totalVotes > 0.75) layer.options.fillColor = "#990000";
                    else if (republicanVotes/totalVotes > 0.6) layer.options.fillColor = "#CC0000";
                    else if (republicanVotes/totalVotes > 0.45) layer.options.fillColor = "#ff0000";
                    else if (republicanVotes/totalVotes > 0.3) layer.options.fillColor = "#FF3333";
                    else if (republicanVotes/totalVotes > 0.15) layer.options.fillColor = "#FF6666"; // lighter red
                    else layer.options.fillColor = "#FF9999";
                }
                else {
                    let brackets = [
                        feature.properties.LESS_10K22 
                            + feature.properties["10K_15K22"] 
                            + feature.properties["15K_20K22"] 
                            + feature.properties["20K_25K22"], 
                        feature.properties["25K_30K22"] 
                            + feature.properties["30K_35K22"] 
                            + feature.properties["35K_40K22"] 
                            + feature.properties["40K_45K22"] 
                            + feature.properties["45K_50K22"], 
                        feature.properties["50K_60K22"] 
                            + feature.properties["60K_75K22"], 
                        feature.properties["75K_100K22"], 
                        feature.properties["100_125K22"], 
                        feature.properties["125_150K22"], 
                        feature.properties["150_200K22"] + feature.properties["200K_MOR22"]
                    ];
                    let medianIncome = feature.properties.MEDN_INC22;   
                    let totalHouses =  feature.properties.TOT_HOUS22;
                    if (medianIncome === undefined) {
                        totalHouses = 0;
                        for (let i = 0; i < 6; i++) totalHouses += Number(brackets[i]);
                        let count = 0;
                        for (let i = 0; i < 6; i++) {
                            count+=Number(brackets[i]);
                            if(count > totalHouses/2) {
                                medianIncome = count + 25000*(i + (totalHouses/2 - (count - Number(brackets[i])))/Number(brackets[i]));
                                break;
                            }
                        }
                    }
                    if (democraticVotes > republicanVotes)  {
                        if (medianIncome > 150000) layer.options.fillColor = "#000066"; // dark blue
                        else if (medianIncome > 125000) layer.options.fillColor = "#000099";
                        else if (medianIncome > 100000) layer.options.fillColor = "#0000CC";
                        else if (medianIncome > 75000) layer.options.fillColor = "#0000ff";
                        else if (medianIncome > 50000) layer.options.fillColor = "#3333FF"; 
                        else if (medianIncome > 25000) layer.options.fillColor = "#6666FF"; 
                        else layer.options.fillColor = "#9999FF"; // lighter blue
                    }
                    else if (republicanVotes > democraticVotes)  {
                        if (medianIncome > 150000) layer.options.fillColor = "#660000"; // dark red
                        else if (medianIncome > 125000) layer.options.fillColor = "#990000";
                        else if (medianIncome > 100000) layer.options.fillColor = "#CC0000";
                        else if (medianIncome > 75000) layer.options.fillColor = "#ff0000";
                        else if (medianIncome > 50000) layer.options.fillColor = "#FF3333";
                        else if (medianIncome > 25000) layer.options.fillColor = "#FF6666"; 
                        else layer.options.fillColor = "#FF9999";// lighter red
                    }
                }
            } 


            layer.on('mouseover', function (e) {
                if (popup !== undefined && viewMode !== Page.selectStatePage) {
                    document.getElementById("map_popup").style.visibility = 'visible';
                    document.getElementById("map_popup").innerHTML = popup;
                }
            });
            layer.on('mouseout', function(e){
                if (selectedPopup !== undefined && viewMode !== Page.selectStatePage) {
                    document.getElementById("map_popup").style.visibility = 'visible';
                    document.getElementById("map_popup").innerHTML = selectedPopup;
                }
                else document.getElementById("map_popup").style.visibility = 'hidden';
            })
            if(this.props.selectedElement === feature.properties.NAME) {
                selectedPopup = popup;
                if (selectedFeature !== undefined) selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                selectedFeature = layer;
                selectedFeatureColor = layer.options.fillColor;
                layer.setStyle({fillColor: "black", fillOpacity: "1"});
            }
            layer.on('click', function (e) {
                if (viewMode === Page.selectStatePage) {
                    switchState(feature.properties.name);
                }
                else {
                    if(popup !== undefined) {
                        document.getElementById("map_popup").style.visibility = 'visible';
                        document.getElementById("map_popup").innerHTML = popup;
                    }
                    let barTitle = name;
                    if (selectedFeature !== layer) {
                        if (viewMode === Page.economicPage)  
                            setData(
                                barTitle, 
                                [feature.properties.LESS_10K22 
                                    + feature.properties["10K_15K22"] 
                                    + feature.properties["15K_20K22"] 
                                    + feature.properties["20K_25K22"], 
                                feature.properties["25K_30K22"] 
                                    + feature.properties["30K_35K22"] 
                                    + feature.properties["35K_40K22"] 
                                    + feature.properties["40K_45K22"] 
                                    + feature.properties["45K_50K22"], 
                                feature.properties["50K_60K22"] 
                                    + feature.properties["60K_75K22"], 
                                feature.properties["75K_100K22"], 
                                feature.properties["100_125K22"], 
                                feature.properties["125_150K22"], 
                                feature.properties["150_200K22"] + feature.properties["200K_MOR22"]]
                            );
                        else if (viewMode === Page.racePage) 
                            setData(
                                barTitle, 
                                [feature.properties.WHT_NHSP22, 
                                feature.properties.BLK_NHSP22, 
                                feature.properties.HSP_POP22, 
                                Number(feature.properties.TOT_POP22) - Number(feature.properties.HSP_POP22) - Number(feature.properties.BLK_NHSP22) - Number(feature.properties.WHT_NHSP22)]
                            );
                        else if (viewMode === Page.electionPage) {
                            if (currentState === "massachusetts") 
                                setData(
                                    name + " (President)", 
                                    [
                                        [
                                            feature.properties.G20PREDBID, 
                                            feature.properties.G20PRERTRU, 
                                            Number(feature.properties.G20PRELJOR) + Number(feature.properties.G20PREOWRI) + Number(feature.properties.G20PREGHAW)
                                        ], 
                                        [
                                            "Joe Biden",
                                            "Donald Trump", 
                                            "Other"
                                        ]
                                    ]
                                );
                            else if (currentState === "alabama") 
                                setData(
                                    name + " (Senate)", 
                                    [
                                        [
                                            feature.properties.G22USSDBOY, 
                                            feature.properties.G22USSRBRI, 
                                            Number(feature.properties.G22USSOWRI) + Number(feature.properties.G22USSLSOP)
                                        ], 
                                        [
                                            "Will Boyd", 
                                            "Katie Britt", 
                                            "Other"
                                        ]
                                    ]
                                );
                        }
                        selectedPopup = popup;
                        if (selectedFeature !== undefined) selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                        selectedFeature = layer;
                        selectedFeatureColor = layer.options.fillColor;
                        layer.setStyle({fillColor: "black", fillOpacity: "1"});
                    }
                    else {
                        barTitle = currentState[0].toUpperCase() + currentState.substring(1, currentState.length);
                        if (viewMode === Page.electionPage) {
                            if(currentState === "massachusetts") barTitle += " (President)";
                            else barTitle += " (Senator)"
                        }
                        setData(barTitle, undefined);
                        selectedFeature.setStyle({fillColor: selectedFeatureColor, fillOpacity: opacity});
                        selectedFeature = undefined;
                        selectedFeatureColor = undefined;
                        selectedPopup = undefined;
                        document.getElementById("map_popup").style.visibility = 'hidden';
                    }
                }
            });
        }
        const data = 
            <GeoJSON 
                onEachFeature={countyHover} 
                key=    {"Data-"+(this.data.name)+"-o-"+opacity+"-s-"} 
                data=   {this.data.features} 
                style=  {{color: "black", fillOpacity: opacity, weight: 1}}
            />;
        let mapContainerId = "main_map";
        let mapPopupId = "map_popup";
        if (this.viewMode === Page.selectStatePage) mapContainerId = "homepage_map";
        if (this.viewMode === Page.overviewPage) {
            mapContainerId = "overview_map";
            mapPopupId = "overview_map_popup";
        }
        return (
            <div class="map_countainer">
                <MapContainer id={mapContainerId} center={this.center} zoom={this.zoom} scrollWheelZoom={false} >
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    />
                    {data}
                </MapContainer>
                {legend}
                <div id="map_popup" class={mapPopupId}></div>
            </div>
        );
    }
}


export default Map;