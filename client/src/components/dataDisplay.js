import React from 'react'
import Graphs from "./plots.js"
import axios from 'axios'
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';
import OverviewPage from './overviewPage.js';
import {Page, MapLevel, SortingMethod} from '../constants.js';
import ElectionPage from './electionPage.js';


class DataDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sortBy = this.props.sortBy;
        this.viewMode = this.props.viewMode;
        this.state = {featureData: this.props.featureData, fetchedData: {}}
    }

    async componentDidMount() {
       
        if (this.viewMode === Page.ensemblePage) {
            const response = await axios.get('http://localhost:8000/api/ensemble?sort=' 
                + this.sortBy 
                + '&state=' 
                + this.state.featureData[0].split('_')[0]);
            this.setState({fetchedData: response.data});
        }
        else if(this.viewMode === Page.overviewPage) {
            const response = await axios.get('http://localhost:8000/api/attributes?type=summary&state=' 
                + (this.state.featureData[0].split('_')[0]).toLowerCase());
            console.log(response.data);
            this.setState({fetchedData: response.data});
        }
    }
    render() {
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
            let sortBy = this.props.sortBy;
            let propName = "";
            let label = "";
            if (sortBy === SortingMethod.whiteRace) {
                propName = "WHT_NHSP22";
                label = "% White Pop";
            } else if (sortBy === SortingMethod.blackRace) {
                propName = "BLK_NHSP22";
                label = "% Black Pop";
            } else {
                propName = "HSP_POP22";
                label = "% Hispanic Pop";
            }
            let data = this.props.data;
            if (data["name"].split('_')[0] === "alabama") {
                for (var i = 0; i < data["features"].length; i++) {
                    const totalVotes = Math.round(
                        data["features"][i]["properties"]["G22USSDBOY"] 
                        + data["features"][i]["properties"]["G22USSLSOP"] 
                        + data["features"][i]["properties"]["G22USSOWRI"] 
                        + data["features"][i]["properties"]["G22USSRBRI"]);
                    xData.push(Math.round(data["features"][i]["properties"][propName] / data["features"][i]["properties"]["TOT_POP22"] * 100))
                    yDataDemocrat.push(Math.round(data["features"][i]["properties"]["G22USSDBOY"] / totalVotes * 100));
                    yDataRepublican.push(Math.round(data["features"][i]["properties"]["G22USSRBRI"] / totalVotes * 100));
                }
            } else {
                for (var i = 0; i < data["features"].length; i++) {
                    const totalVotes = Math.round(
                        data["features"][i]["properties"]["G20PREDBID"]  //G20PREDBID - Joseph R. Biden (Democratic-Farmer-Labor Party)
                        + data["features"][i]["properties"]["G20PRERTRU"] //G20PRERTRU - Donald J. Trump (Republican Party)
                        + data["features"][i]["properties"]["G20PRELJOR"] //G20PRELJOR - Jo Jorgensen (Libertarian Party)
                        + data["features"][i]["properties"]["G20PREGHAW"] //G20PREGHAW - Howie Hawkins (Green Party)
                        + data["features"][i]["properties"]["G20PREOWRI"] //G20PREOWRI - Write-in Votes
                    );
                    xData.push(Math.round(data["features"][i]["properties"][propName] / data["features"][i]["properties"]["TOT_POP22"] * 100))
                    yDataDemocrat.push(Math.round(data["features"][i]["properties"]["G20PREDBID"] / totalVotes * 100));
                    yDataRepublican.push(Math.round(data["features"][i]["properties"]["G20PRERTRU"] / totalVotes * 100));
                }
            }
            let plotData = [
                {
                    x: xData,
                    y: yDataDemocrat,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Democratic',
                    marker: { color: "#B9D9EB" }
                },
                {
                    x: xData,
                    y: yDataRepublican,
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
                width: 900,
                height: 700
            };
            display = <Graphs data={plotData} layout={plotLayout}/>
        }
        else if (this.viewMode === Page.ecologicalInferencePage) {
            //Placeholder
            display = <img className="ei=display" src={require("../graphs/Density1.png")} alt={"EI display"}/>
        }
        else if (this.viewMode === Page.ensemblePage) { 
            display = 
            <Graphs 
                key={this.state.featureData + "_" + this.viewMode} 
                data={this.state.fetchedData.plotData} 
                layout={this.state.fetchedData.plotLayout}
            />
        }
        else if(this.viewMode === Page.overviewPage) { 
            // display = <OverviewPage  key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>;
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