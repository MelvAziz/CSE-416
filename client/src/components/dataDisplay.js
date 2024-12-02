import React from 'react'
import Graphs from "./plots.js"
import axios from 'axios'
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';

import {Page, MapLevel} from '../constants.js';

class DataDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.sortBy = this.props.sortBy;
        this.state = {tableData: this.props.tableData, fetchedData: {}}
    }

    async componentDidMount() {
       
        if (this.props.show === Page.EnsemblePage) {
            const response = await axios.get('http://localhost:8000/api/ensemble?sort=' + this.sortBy + '&state=' + this.props.tableData[0].split('_')[0]);
            this.setState({ fetchedData: response.data});
        }
    }
    render() {
        let graph;
        let graphTitle = this.props.tableData[0];
        let yAxis = this.props.tableData[1];
        if(this.props.show === Page.EconomicPage) graph = <EconomicPage key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
        else if (this.props.show === Page.RacePage) graph = <RacePage key={yAxis} yAxis={yAxis} graphTitle={graphTitle}/>
        else if (this.props.show === Page.ElectionPage){ //Election
            if( yAxis === undefined) {
                if(this.props.tableData[0].includes("President")) yAxis = [[2382202, 1167202, 81998], ["Joe Biden", "Donald Trump", "Other"]];
                else if(this.props.tableData[0].includes("Governor")) yAxis = [[412961, 946932, 55390], ["Yolanda Flowers", "Kay Ivey", "Other"]];
                else if(this.props.tableData[0].includes("Alabama")) yAxis = [[436746, 942154, 35338], ["Will Boyd", "Katie Britt", "Other"]];
                else yAxis = [[2357809, 1177765, 28562], ["Ed Markey", "Kevin O'Connor", "Other"]];
            }
            let plotData = {
                x: yAxis[1],
                y: yAxis[0],
                type: 'bar',
                marker: { color: ['blue', 'red', 'orange'] },
            }
            let plotLayout = {
                title: this.props.tableData[0] + ' Votes',
                width: 700,
                height: 600,
                xaxis: {title: "Candidate"},
                yaxis: {title: "Votes"},
                datarevision: this.state.tableData[0],
            }
            graph = <Graphs key={this.state.tableData[0]} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === Page.GinglesPage){ //Gingles
            const xData = [];
            const yData = [];
            const yData2 = [];
            let sortBy = this.props.sortBy;
            let propName = "";
            let label = "";
            if (sortBy === "wht") {
                propName = "WHT_NHSP22";
                label = "% White Pop";
            } else if (sortBy === "blk") {
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
                    yData.push(Math.round(data["features"][i]["properties"]["G22USSDBOY"] / totalVotes * 100));
                    yData2.push(Math.round(data["features"][i]["properties"]["G22USSRBRI"] / totalVotes * 100));
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
                    yData.push(Math.round(data["features"][i]["properties"]["G20PREDBID"] / totalVotes * 100));
                    yData2.push(Math.round(data["features"][i]["properties"]["G20PRERTRU"] / totalVotes * 100));
                }
            }
            let plotData = [
                {
                    x: xData,
                    y: yData,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Democratic',
                    marker: { color: "#B9D9EB" }
                },
                {
                    x: xData,
                    y: yData2,
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
            graph = <Graphs data={plotData} layout={plotLayout}/>
        }
        else if (this.props.show === Page.EcologicalInferencePage) { // Ecological inference
            graph = <img className="ei=graph" src={require("../graphs/Density1.png")} alt={"EI graph"}/>
        }
        else if (this.props.show === Page.EnsemblePage){ //Ensemble
            graph = 
            <Graphs 
                key={this.state.tableData + "_" + this.props.show} 
                data={this.state.fetchedData.plotData} 
                layout={this.state.fetchedData.plotLayout}
            />
        }
        else if(this.props.show === 7){ //Overview

        }
        return (
            <div class="data-display">
                {graph}
            </div>
        )
    }
}

export default DataDisplay;