import React from 'react'
import Graphs from "./plots.js"
import axios from 'axios'
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';
import OverviewPage from './overviewPage.js';
import KDEChart from './eiPlots.js';
import {Page, MapLevel, SortingMethod} from '../constants.js';
import ElectionPage from './electionPage.js';
import * as turf from '@turf/turf';


class DataDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sortBy = this.props.sortBy;
        this.viewMode = this.props.viewMode;
        this.state = {
            featureData: this.props.featureData, 
            fetchedData: {}, 
            selectedPlan: 0, 
        }
    }

    async componentDidMount() {
       
        if (this.viewMode === Page.ensemblePage) {
            const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                + this.sortBy 
                + '&plan=1&state=' 
                + this.state.featureData[0].split('_')[0]);
            console.log(response.data);
            this.setState({fetchedData: response.data});
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
            if(sortBy === SortingMethod.blackRaceIncome || sortBy === SortingMethod.whiteRaceIncome) {
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
                xaxis: { title: label },
                yaxis: { title: '% Votes' },
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
                        xData.push((d["properties"][propName] / (d["properties"]["TOT_POP22"]*2)) + (medianIncome/(2*highestIncome)));
                    else xData.push(Math.round(medianIncome))
                }
                else xData.push(Math.round(d["properties"][propName] / d["properties"]["TOT_POP22"] * 100))
                let selectedClass="";
                if(this.props.selectedFeature === d.properties.NAME) {
                    selectedClass = "selected_tabular_display"
                }
                return <tr class={selectedClass} id={d.properties.NAME}>
                    <td>{d.properties.NAME}</td>
                    <td>{readableNum(d.properties["TOT_POP22"])}</td>
                    <td>{d.properties["REGION"]}</td>
                    <td>{readableNum(d.properties["BLK_NHSP22"])}</td>
                    <td>${readableNum(Number(medianIncome).toFixed(2))}</td>
                    <td>{readableNum(demVotes)}</td>
                    <td>{readableNum(repVotes)}</td>

                </tr>
            })
            display = 
            <div>
                <Graphs data={plotData} layout={plotLayout}  onClick={e => {
                    console.log(e.points["0"].id)
                    return this.props.setSelectedFeature(e.points["0"].id)}}/>
                <table class="gingles_tabular_display">
                    <thead><tr><th>Precinct Name</th><th>Population</th><th>Region</th><th>Black Pop.(%)</th><th>Avg. Income</th><th>Republican Votes</th><th>DemocraticVotes</th></tr></thead>
                    <tbody>
                        {tabularDisplay}
                    </tbody>
                </table>
            </div>;
            window.location.hash = this.props.selectedFeature;
        }
        else if (this.viewMode === Page.ecologicalInferencePage) {
            // <KDEChart data={dummyData} />
        }
        else if (this.viewMode === Page.ensemblePage) { 
            display = <div>
            <select name="ensemble_plan_dropdown" id="ensemble_plan_dropdown" onChange={async e =>
                {
                    const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                        + this.sortBy 
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
                let redistrictingParty = "Republican Party"
                if(attributes["REDIST_PARTY"] === "DEM") 
                    redistrictingParty = "Democratic Party"

                display = <div class="overview_container">
                    <h3>{stateName.substring(0, 1).toUpperCase() + stateName.substr(1, stateName.length)}</h3>
                        <p>Total Population: {attributes["TOT_POP22"]}</p>
                        <p>Redistricting Party: {redistrictingParty}</p>
                        <div class="summary_table_container">
                            <table class="ensemble_plan_container">
                                <thead><tr><th>Ensemble ID</th><th>Number of District Plans</th><th>Equality Threshold</th></tr></thead>
                                <tbody>
                                    <tr><td>0</td><td>5,000</td><td>10%</td></tr>
                                    <tr><td>1</td><td>5,000</td><td>10%</td></tr>
                                    <tr><td>2</td><td>5,000</td><td>10%</td></tr>
                                    <tr><td>3</td><td>5,000</td><td>10%</td></tr>
                                    <tr><td>4</td><td>5,000</td><td>10%</td></tr>
                                </tbody>
                            </table>
                            <table class="ensemble_plan_container">
                                <thead><tr><th>District Number</th><th>Representative</th></tr></thead>
                                <tbody>
                                    {representatives.map((rep, index) => <tr><td>{index+1}</td><td>{rep}</td></tr>)}
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