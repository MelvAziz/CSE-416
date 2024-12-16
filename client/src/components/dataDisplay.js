import React from 'react'
import Graphs from "./plots.js"
import axios from 'axios'
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';
import OverviewPage from './overviewPage.js';
import KDEChart from './eiPlots.js';
import {Page, MapLevel, SortingMethod} from '../constants.js';
import ElectionPage from './electionPage.js';
import eiData from '../ei/mass/racial-president.json';
import * as turf from '@turf/turf';
import RegionPage from './regionPage.js';
import GinglesGraph from './ginglesGraph.js';


class DataDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sortBy = this.props.sortBy;
        this.viewMode = this.props.viewMode;
        this.state = {
            sortBy: this.props.sortBy,
            featureData: this.props.featureData, 
            fetchedData: {}, 
            selectedPlan: 0, 
            eiSelectionA: "race",
            eiSelectionC: "senator",
            eiSelectionD: 0
        }
    }

    async componentDidMount() {
       
        if (this.viewMode === Page.ensemblePage) {
            let sortBy = this.state.sortBy;
            if(!(sortBy === SortingMethod.whiteRace || sortBy ===  SortingMethod.blackRace
                || sortBy === SortingMethod.urban || sortBy ===  SortingMethod.suburban|| sortBy ===  SortingMethod.rural
                || sortBy === SortingMethod.E0to25 || sortBy ===  SortingMethod.E25to50 || sortBy ===  SortingMethod.E50to75 || sortBy ===  SortingMethod.E75to100 || sortBy ===  SortingMethod.E100to125 || sortBy ===  SortingMethod.E125to150 || sortBy ===  SortingMethod.E150more
            )) {
                sortBy = SortingMethod.whiteRace;
            }
            const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                + sortBy 
                + '&plan=1&state=' 
                + this.state.featureData[0].split('_')[0]);
            this.setState({fetchedData: response.data, sortBy: sortBy});
        }
        else if(this.viewMode === Page.ecologicalInferencePage) {
            const response = await axios.get('http://localhost:8000/api/ei?type=' 
                + this.state.eiSelectionA
                + '&state=' 
                + this.state.featureData[0].split('_')[0]
                + '&election=' 
                + this.state.eiSelectionC
            );
            this.setState({fetchedData: response.data.data});
        }
        else if(this.viewMode === Page.overviewPage) {
            const response = await axios.get('http://localhost:8000/api/attributes?type=summary&state=' 
                + (this.state.featureData[0].split('_')[0]).toLowerCase());
            this.setState({fetchedData: response.data});
        }
    }

    render() {        
        function readableNum(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        let display;
        let graphTitle = this.props.featureData[0];
        let yAxis = this.props.featureData[1];
        if (this.viewMode === Page.economicPage) 
            display = <EconomicPage key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
        else if (this.viewMode === Page.racePage) 
            display = <RacePage key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
        else if (this.viewMode === Page.electionPage) 
            display = <ElectionPage key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
        else if (this.viewMode === Page.ginglesPage) {
            const xData = [];
            const yDataDemocrat = [];
            const yDataRepublican = [];
            const ids = [];
            let sortBy = this.props.sortBy;
            let propName = "";
            let label = "";
            if (sortBy === SortingMethod.whiteRace) {
                propName = "WHT_NHSP22";
                label = "% White Pop";
            } else if (sortBy === SortingMethod.blackRace) {
                propName = "BLK_NHSP22";
                label = "% Black Pop";
            } else if (sortBy === SortingMethod.politicalIncome) {
                propName = "TOT_POP22";
                label = "Median Income";
            } else if (sortBy === SortingMethod.whiteRaceIncome) {
                propName = "WHT_NHSP22";
                label = "White + Income";
            } else if (sortBy === SortingMethod.blackRaceIncome) {
                propName = "BLK_NHSP22";
                label = "Black + Income";
            } else if (sortBy === SortingMethod.urbanRural) {
                propName = "TOT_POP22";
                label = "Population Density";
            } 
            let data = this.props.data;
            let totalVotes = 0;
            let highestIncome = 0;
            let highestDensity = 0;
            let maxWidth = 100;
            if(sortBy === SortingMethod.blackRaceIncome || sortBy === SortingMethod.whiteRaceIncome || sortBy === SortingMethod.politicalIncome) {
                // maxWidth = 1;
                for (var i = 0; i < data["features"].length; i++) {
                    let brackets = [
                        data["features"][i]["properties"].LESS_10K22 
                            + data["features"][i]["properties"]["10K_15K22"] 
                            + data["features"][i]["properties"]["15K_20K22"] 
                            + data["features"][i]["properties"]["20K_25K22"], 
                        data["features"][i]["properties"]["25K_30K22"] 
                            + data["features"][i]["properties"]["30K_35K22"] 
                            + data["features"][i]["properties"]["35K_40K22"] 
                            + data["features"][i]["properties"]["40K_45K22"] 
                            + data["features"][i]["properties"]["45K_50K22"], 
                        data["features"][i]["properties"]["50K_60K22"] 
                            + data["features"][i]["properties"]["60K_75K22"], 
                        data["features"][i]["properties"]["75K_100K22"], 
                        data["features"][i]["properties"]["100_125K22"], 
                        data["features"][i]["properties"]["125_150K22"], 
                        data["features"][i]["properties"]["150_200K22"] 
                            + data["features"][i]["properties"]["200K_MOR22"]
                    ];
                    let medianIncome = data["features"][i]["properties"].MEDN_INC22;   
                    let totalHouses =  data["features"][i]["properties"].TOT_HOUS22;
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
                    if(medianIncome > highestIncome) highestIncome = medianIncome;
                }
            }
            else if(sortBy === SortingMethod.urbanRural) {
                for (var i = 0; i < data["features"].length; i++) {
                    if((data["features"][i]["properties"]["TOT_POP22"])/(data["features"][i]["properties"]["ALAND20"]/1000000) > highestDensity) highestDensity=(data["features"][i]["properties"]["TOT_POP22"])/(data["features"][i]["properties"]["ALAND20"]/1000000);
                }
            }
            if(sortBy === SortingMethod.politicalIncome) maxWidth = highestIncome;
            else if(sortBy === SortingMethod.urbanRural) maxWidth = highestDensity;
            let shapes = [];
            if(sortBy === SortingMethod.urbanRural) 
                shapes = [
                    // {
                    //     type: 'box',
                    //     x0: 0,
                    //     x1: 500,
                    //     y0: 0,
                    //     y1: 1,
                    //     yref: 'paper', // Use 'paper' to make the line span the entire y-axis
                    //     line: {
                    //       color: 'yellow',
                    //       width: 5
                    //     }
                    // },
                    // {
                    //     type: 'box',
                    //     x0: 500,
                    //     x1: 1000,
                    //     y0: 0,
                    //     y1: 1,
                    //     yref: 'paper', // Use 'paper' to make the line span the entire y-axis
                    //     line: {
                    //       color: 'orange',
                    //       width: 5
                    //     }
                    // }
                ];
            let plotData = [
                {
                    x: xData,
                    y: yDataDemocrat,
                    ids: ids,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Democratic',
                    marker: { color: "#B9D9EB" }
                },
                {
                    x: xData,
                    y: yDataRepublican,
                    ids: ids,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Republican',
                    marker: { color: 'pink' }
                },
            ];
            let plotLayout = {
                title: '',
                xaxis: { title: label, range: [0, maxWidth] },
                yaxis: { title: '% Votes', range: [0, 100] },
                shapes: shapes,
                width: 600,
                height: 500
            };
            let tabularDisplay =  data["features"].map((d, i) => {
                ids.push(d["properties"]["NAME"]);
                let demVotes = 0;
                let repVotes = 0;
                let medianIncome = 0;
                if(data["name"].split('_')[0] === "alabama") {
                    totalVotes = Math.round(
                        d["properties"]["G22USSDBOY"] 
                        + d["properties"]["G22USSLSOP"] 
                        + d["properties"]["G22USSOWRI"] 
                        + d["properties"]["G22USSRBRI"]);
                    demVotes = d["properties"]["G22USSDBOY"];
                    repVotes = d["properties"]["G22USSRBRI"];
                    yDataDemocrat.push(Math.round(d["properties"]["G22USSDBOY"] / totalVotes * 100));
                    yDataRepublican.push(Math.round(d["properties"]["G22USSRBRI"] / totalVotes * 100));
                }
                else {
                    totalVotes = Math.round(
                        d["properties"]["G20PREDBID"]  //G20PREDBID - Joseph R. Biden (Democratic-Farmer-Labor Party)
                        + d["properties"]["G20PRERTRU"] //G20PRERTRU - Donald J. Trump (Republican Party)
                        + d["properties"]["G20PRELJOR"] //G20PRELJOR - Jo Jorgensen (Libertarian Party)
                        + d["properties"]["G20PREGHAW"] //G20PREGHAW - Howie Hawkins (Green Party)
                        + d["properties"]["G20PREOWRI"] //G20PREOWRI - Write-in Votes
                    );
                    demVotes = d["properties"]["G20PREDBID"];
                    repVotes = d["properties"]["G20PRERTRU"];
                    yDataDemocrat.push(Math.round(d["properties"]["G20PREDBID"] / totalVotes * 100));
                    yDataRepublican.push(Math.round(d["properties"]["G20PRERTRU"] / totalVotes * 100));
                }
                let brackets = [
                    d["properties"].LESS_10K22 
                        + d["properties"]["10K_15K22"] 
                        + d["properties"]["15K_20K22"] 
                        + d["properties"]["20K_25K22"], 
                    d["properties"]["25K_30K22"] 
                        + d["properties"]["30K_35K22"] 
                        + d["properties"]["35K_40K22"] 
                        + d["properties"]["40K_45K22"] 
                        + d["properties"]["45K_50K22"], 
                    d["properties"]["50K_60K22"] 
                        + d["properties"]["60K_75K22"], 
                    d["properties"]["75K_100K22"], 
                    d["properties"]["100_125K22"], 
                    d["properties"]["125_150K22"], 
                    d["properties"]["150_200K22"] 
                        + d["properties"]["200K_MOR22"]
                ];
                medianIncome = d["properties"].MEDN_INC22;   
                let totalHouses =  d["properties"].TOT_HOUS22;
                if (medianIncome === undefined) {
                    totalHouses = 0;
                    for (let index = 0; index < 6; index++) totalHouses += Number(brackets[index]);
                    let count = 0;
                    for (let index = 0; index < 6; index++) {
                        count+=Number(brackets[index]);
                        if(count > totalHouses/2) {
                            medianIncome = count + 25000*(index + (totalHouses/2 - (count - Number(brackets[index])))/Number(brackets[index]));
                            break;
                        }
                    }
                }
                if(sortBy === SortingMethod.urbanRural) {
                    xData.push((d["properties"]["TOT_POP22"])/(d["properties"]["ALAND20"]/1000000))
                }
                else if (sortBy !== SortingMethod.whiteRace && sortBy !== SortingMethod.blackRace) {
                    if(sortBy === SortingMethod.whiteRaceIncome || sortBy === SortingMethod.blackRaceIncome) 
                        xData.push((d["properties"][propName]*100 / (d["properties"]["TOT_POP22"]*2)) + (medianIncome*100/(2*highestIncome)));
                    else xData.push(Math.round(medianIncome))
                }
                else xData.push(Math.round(d["properties"][propName] / d["properties"]["TOT_POP22"] * 100))
                let selectedClass="";
                if(this.props.selectedFeature === d.properties.NAME) {
                    selectedClass = "selected_tabular_display"
                }
                return <tr class={selectedClass} id={d.properties.NAME}>
                    <td class="text_left">{d.properties.NAME}</td>
                    <td class="numbers_right">{readableNum(d.properties["TOT_POP22"])}</td>
                    <td>{d.properties["REGION"]}</td>
                    <td class="numbers_right">{readableNum(d.properties["WHT_NHSP22"])}</td>
                    <td class="numbers_right">{readableNum(d.properties["BLK_NHSP22"])}</td>
                    <td class="numbers_right">${readableNum(Number(medianIncome).toFixed(2))}</td>
                    <td class="numbers_right">{readableNum(demVotes)}</td>
                    <td class="numbers_right">{readableNum(repVotes)}</td>

                </tr>
            })
            let max = 100;
            if(sortBy === SortingMethod.politicalIncome) max = 100000;
            else if(sortBy === SortingMethod.urbanRural) max = 40000;
            display = 
            <div>
                <GinglesGraph plotData={plotData} layout={plotLayout} max={max} onClick={e => {
                    return this.props.setSelectedFeature(e.points["0"].id)}}/>
                <table class="gingles_tabular_display">
                    <thead><tr><th>Precinct Name</th><th>Population</th><th>Region</th><th>White Pop.</th><th>Black Pop.</th><th>Avg. Income</th><th>Republican Votes</th><th>Democratic Votes</th></tr></thead>
                    <tbody>
                        {tabularDisplay}
                    </tbody>
                </table>
            </div>;
            window.location.hash = this.props.selectedFeature;
        }
        else if(this.viewMode === Page.precinctAnalysis) {
            let raceData = undefined;
            let electionData = undefined;
            let economicData = undefined;
            let barTitle = this.state.featureData[0];
            let electionTitle = this.state.featureData[0];
            if(yAxis !== undefined) {
                raceData = yAxis[0]
                electionData = yAxis[2]
                economicData = yAxis[1]
                
                barTitle = this.props.featureData[0][0]
                electionTitle = this.props.featureData[0][2]
            }
            display = <div class="precinct_page"> 
            <div class="precinct_col_1">
                <RacePage graphTitle={barTitle}  key={raceData} yAxis={raceData}/>
                <ElectionPage graphTitle={electionTitle} key={electionData} yAxis={electionData}/>
            </div>
            <div class="precinct_col_2">
                <EconomicPage graphTitle={barTitle} key={economicData} yAxis={economicData}/>
                {/* <RegionPage graphTitle={graphTitle} key={this.props.featureData[1][3]} yAxis={this.props.featureData[1][3]}/> */}
            </div>
        </div>;
        }
        else if (this.viewMode === Page.ecologicalInferencePage) {
            let sortingOptionsA = ["race", "eco", "raceco", "region"];
            let sortingOptionsB = ["White", "Black", "Hispanic"];
            let electionTitle = "president";
            if(this.state.featureData[0].split('_')[0] === "Alabama") electionTitle = "governor"
            let sortingOptionsC = ["senator", electionTitle];
            let sortingOptionsD = ["Joe Biden (DEM)", "Donald Trump (REP)"]
            if(this.state.eiSelectionC === "senator") sortingOptionsD = ["Ed Markey (DEM)", "Kevin O'Connor (REP)"]
            if(this.state.featureData[0].split('_')[0] === "Alabama") {
                if(this.state.eiSelectionC === "senator") sortingOptionsD = ["Will Boyd (DEM)", "Katie Britt (REP)"]
                else sortingOptionsD = ["Yolanda Flowers (DEM)", "Kay Ivey (REP)"]
            }

            let selected = ["selected", "", "", ""];
            let selected2 = ["selected", ""];
            let selected3 = ["selected", ""];
            if(this.state.electionD === 1) selected3 = ["", "selected"];
            if(this.state.eiSelectionA === "raceco") {
                selected = ["", "", "selected", ""];
                sortingOptionsB = ["White Poverty","Black Poverty","Black High Income", "White High Income"];
            }
            if(this.state.eiSelectionA === "eco") {
                selected = ["", "selected", "", ""];
                sortingOptionsB = ["0-25k","25-50k","50-75k","75-100k", "100-125k", "125-150k", ">150k"];
            }
            else if(this.state.eiSelectionA === "region") {
                selected = ["", "", "", "selected"];
                sortingOptionsB = ["Rural","Suburban","Urban"];
            }
            if(this.state.eiSelectionC !== "senator") selected2 = ["", "selected"];
            let secondDropDown = sortingOptionsC.map((value, index) => {
                return <option value={index} {...selected2[index]}>{value.charAt(0).toUpperCase() + value.substring(1, value.length)}</option>
            })
            let thirdDropDown = sortingOptionsD.map((value, index) => {
                return <option value={index} {...selected2[index]}>{value}</option>
            })
            display = <div>
                <div name="ei_dropdown_container">
                    <select name="ensemble_plan_dropdown" class="ensemble_dropdown" id="ensemble_plan_dropdown_1" onChange={async e =>
                        {
                            {/*This call should get economic, racial, or regional-president.json
                            that we pass in directly to the graph */}
                            const response = await axios.get('http://localhost:8000/api/ei?type=' 
                                + sortingOptionsA[e.target.value]
                                + '&state='
                                + this.state.featureData[0].split('_')[0]
                                + '&election='
                                + this.state.eiSelectionC
                            );
                            return this.setState({fetchedData: response.data.data, eiSelectionA: sortingOptionsA[e.target.value]});
                        }
                    }>
                            <option value={0} {...selected[0]}>Race</option>
                            <option value={1} {...selected[1]}>Economic</option>
                            <option value={2} {...selected[2]}>Race/Economic</option>
                            <option value={3} {...selected[3]}>Region</option>
                    </select>
                    <select name="ensemble_plan_dropdown" class="ensemble_dropdown" id="ensemble_plan_dropdown_1" onChange={async e =>
                        {
                            {/*This call should get economic, racial, or regional-president.json
                            that we pass in directly to the graph */}
                            const response = await axios.get('http://localhost:8000/api/ei?type=' 
                                + this.state.eiSelectionA
                                + '&state='
                                + this.state.featureData[0].split('_')[0]
                                + '&election='
                                + sortingOptionsC[e.target.value]
                            );
                            return this.setState({fetchedData: response.data.data, eiSelectionC: sortingOptionsC[e.target.value]});
                        }
                    }>
                            {secondDropDown}
                    </select>
                    <select name="ensemble_plan_dropdown" class="ensemble_dropdown" id="ensemble_plan_dropdown_1" onChange={async e =>
                        {return this.setState({eiSelectionD: e.target.value});}
                    }>
                            {thirdDropDown}
                    </select>
                    <KDEChart key={this.state.eiSelectionD+""+this.state.eiSelectionA+""+this.state.eiSelectionC} 
                    data = {this.state.fetchedData} 
                    groups={sortingOptionsB} 
                    candidate={this.state.eiSelectionD} 
                    candidateList={sortingOptionsD}/>
                </div>
            </div>;
        }
        else if (this.viewMode === Page.ensemblePage) { 
            let sortingOptionsA = [SortingMethod.whiteRace, SortingMethod.urban, SortingMethod.E0to25];
            let sortingOptionsBA = [SortingMethod.whiteRace, SortingMethod.blackRace];
            let sortingOptionsBB = ["White", "Black"];
            let sortBy = this.state.sortBy;
            let selected = ["selected", "", ""];
            if(sortBy === SortingMethod.whiteRace || sortBy ===  SortingMethod.blackRace) {
                sortingOptionsA[0] = this.state.sortBy;
            }
            else if(sortBy === SortingMethod.urban || sortBy ===  SortingMethod.suburban|| sortBy ===  SortingMethod.rural) {
                selected = ["", "selected", ""];
                sortingOptionsBA = [SortingMethod.urban, SortingMethod.suburban, SortingMethod.rural];
                sortingOptionsBB = ["Urban", "Suburban", "Rural"];
                sortingOptionsA[1] = this.state.sortBy;
            }
            else if(sortBy === SortingMethod.E0to25 || sortBy ===  SortingMethod.E25to50 || sortBy ===  SortingMethod.E50to75 || sortBy ===  SortingMethod.E75to100 || sortBy ===  SortingMethod.E100to125 || sortBy ===  SortingMethod.E125to150 || sortBy ===  SortingMethod.E150more) {
                selected = ["", "", "selected"];
                sortingOptionsBA = [SortingMethod.E0to25, SortingMethod.E25to50, SortingMethod.E50to75, SortingMethod.E75to100, SortingMethod.E100to125, SortingMethod.E125to150, SortingMethod.E150more];
                sortingOptionsBB = ["0-25k","25-50k","50-75k","75-100k", "100-125k", "125-150k", ">150k"];
                sortingOptionsA[2] = this.state.sortBy;
            }
            let secondDropDown = sortingOptionsBB.map((value, index) => {
                return <option value={index}>{value}</option>
            })
            display = <div>
            <div class="ensemble_dropdown_container">
                <select name="ensemble_plan_dropdown" class="ensemble_dropdown" id="ensemble_plan_dropdown_2" onChange={async e =>
                    {
                        const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                            + sortingOptionsA[e.target.value]
                            + '&plan=0' 
                            + '&state=' 
                            + this.state.featureData[0].split('_')[0]);
                        return this.setState({fetchedData: response.data, sortBy: sortingOptionsA[e.target.value], selectedPlan: 0});
                    }
                }>
                        <option value={0} {...selected[0]}>Race</option>
                        <option value={1} {...selected[1]}>Region</option>
                        <option value={2} {...selected[2]}>Economic</option>
                </select>
                <select name="ensemble_plan_dropdown" class="ensemble_dropdown" id="ensemble_plan_dropdown_3" onChange={async e =>
                    {
                        const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                            + sortingOptionsBA[e.target.value]
                            + '&plan=0' 
                            + '&state=' 
                            + this.state.featureData[0].split('_')[0]);
                        return this.setState({fetchedData: response.data,  sortBy: sortingOptionsBA[e.target.value], selectedPlan: 0});
                    }
                }>
                    {secondDropDown}
                </select>
                <select name="ensemble_plan_dropdown"  class="ensemble_dropdown" id="ensemble_plan_dropdown_1" onChange={async e =>
                    {
                        const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                            + this.state.sortBy 
                            + '&plan=' 
                            + e.target.value
                            + '&state=' 
                            + this.state.featureData[0].split('_')[0]);
                        return this.setState({fetchedData: response.data, selectedPlan: e.target.value});
                    }
                }>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <Graphs 
                key={this.state.featureData + "_" + this.viewMode} 
                data={this.state.fetchedData.plotData} 
                layout={this.state.fetchedData.plotLayout}
            />
            </div>
        }
        else if(this.viewMode === Page.overviewPage) { 
            let stateName = this.state.fetchedData.state;
            let attributes = this.state.fetchedData.attributes;
            let representatives = this.state.fetchedData.representatives;

            if(stateName !== undefined) {
                let redistrictingParty = attributes["REDIST_PARTY"]
                let districtBannerA = ["6 | 1  Rep|Dem", "7 | 0 Rep|Dem"].map(p => <th>{p}</th>)
                let districtBannerB = <tbody>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>454</td><td>4546</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>473</td><td>4527</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>439</td><td>4561</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>460</td><td>4540</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>442</td><td>4558</td></tr>
                </tbody>
                if(attributes["DIST_NUM"] === 9) {
                    districtBannerA = <th>0 | 9 Rep|Dem</th>
                    districtBannerB =  districtBannerB = <tbody>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>5000</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>5000</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>5000</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>5000</td></tr>
                    <tr><td>0</td><td>5,000</td><td>10%</td><td>5000</td></tr>

                </tbody>
                }
                display = <div class="overview_container">
                    <h3>{stateName.substring(0, 1).toUpperCase() + stateName.substr(1, stateName.length)}</h3>
                        {/* <p>Total Population: {attributes["TOT_POP22"]}</p>
                        <p>Redistricting Party: {redistrictingParty}</p>
                        <p>Political Lean: {redistrictingParty}</p> */}
                        <div class="summary_table_container">
                            <table class="state_table_container">
                                <thead>
                                    <tr>
                                        <th>Total Population</th>
                                        <th>Redistricting Party</th>
                                        <th>Political Lean</th>
                                        <th>Pop. Density (per km^2)</th>
                                        <th>Med. Income ($)</th>
                                        <th>Poverty (%)</th>
                                        <th>Precincts</th>
                                        <th>Districts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="numbers_right">{readableNum(attributes["TOT_POP22"])}</td>
                                        <td class="numbers_right">{redistrictingParty}</td>
                                        <td class="numbers_right">{redistrictingParty}</td>
                                        <td class="numbers_right">{attributes["POP_DEN"]}</td>
                                        <td class="numbers_right">${readableNum(attributes["MED_INC"])}</td>
                                        <td class="numbers_right">{attributes["POV_PEC"]}%</td>
                                        <td class="numbers_right">{readableNum(attributes["PRE_NUM"])}</td>
                                        <td class="numbers_right">{attributes["DIST_NUM"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="summary_table_container">
                            <table class="ensemble_plan_container">
                                <thead><tr><th>Ensemble ID</th><th>Number of District Plans</th><th>Equality Threshold</th>{districtBannerA}</tr></thead>
                                {districtBannerB}
                            </table>
                            <table class="ensemble_plan_container">
                                <thead><tr><th>District Number</th><th>Representative</th><th>Party</th></tr></thead>
                                <tbody>
                                    {representatives.map((rep, index) => <tr><td>{index+1}</td><td class="text_left">{rep.substring(0, rep.length-5)}</td><td class="text_left">{rep.substring(rep.length-4, rep.length-1)}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <OverviewPage  key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
                 </div>
            }
        }
        return (
            <div class="data-display">
                {display}
            </div>
        )
    }
}

export default DataDisplay;