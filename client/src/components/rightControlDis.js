import React from 'react'
import denimg from "../graphs/Density1.png"
import raceimg from "../graphs/Bar2.png"
import ginimg from "../graphs/Scatter1.png"
import Graphs from "./plots.js"
import * as ss from 'simple-statistics'
import Plotly from "react-plotly.js"
class RightControlDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tableData: this.props.tableData}
    }
    render() {
        console.log(this.props.show);
        console.log(this.props.tableData);
        let graph;
        let y = this.props.tableData[1];
        if(this.props.show === 1){ //Economics
            if( y  === undefined) y = [124036, 103145, 91533, 92600, 87152, 86027, 80601, 79982, 74887, 142999, 180212, 239693, 166596, 116460, 127890, 124471];
            let plotData = {
                x: ["<10k", "10K-15K", "15K-20K", "20K-25K", "25K-30K", "30K-35K", "35K-40K", "40K-45K", "45K-50K", "50K-60K", "60K-75K", "75K-100K", "100K-125K", "125K-150K", "150K-200K", ">200K"],
                y: y,
                type: 'bar',
                marker: { color: 'green' },
              }
            let plotLayout = {
                title: this.props.tableData[0] + ' Income Distribution',
                width: 700,
                height: 600,
                xaxis: {title: "Economic Brackets"},
                yaxis: {title: "# of Households"},
                datarevision: this.state.tableData[0]
            }
            graph = <Graphs key={this.state.tableData[0]} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === 2){ //Race
            if( y  === undefined) y = [3250658, 1314187, 13900, 444662];
            let plotData = {
                x: ["White", "Black", "Hispanic", "Other"],
                y: y,
                type: 'bar',
                // mode: 'lines+markers',
                marker: { color: 'blue' },
            }
            let plotLayout = {
                title: this.props.tableData[0] + ' Pop. by Race',
                width: 700,
                height: 600,
                xaxis: {title: "Race"},
                yaxis: {title: "Population"},
                datarevision: this.state.tableData[0],
            }
            graph = <Graphs key={this.state.tableData[0]} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === 3){ //Election
            console.log(y);
            if( y === undefined) {
                console.log(this.props.tableData[0].includes("President"));
                if(this.props.tableData[0].includes("President")) y = [[2382202, 1167202, 81998], ["Joe Biden", "Donald Trump", "Other"]];
                else if(this.props.tableData[0].includes("Governor")) y = [[412961, 946932, 55390], ["Yolanda Flowers", "Kay Ivey", "Other"]];
                else if(this.props.tableData[0].includes("Alabama")) y = [[436746, 942154, 35338], ["Will Boyd", "Katie Britt", "Other"]];
                else y = [[2357809, 1177765, 28562], ["Ed Markey", "Kevin O'Connor", "Other"]];
            }
            let plotData = {
                x: y[1],
                y: y[0],
                type: 'bar',
                // mode: 'lines+markers',
                marker: { color: ['blue', 'red', 'orange'] },
            }
            let plotLayout = {
                title: this.props.tableData[0] + ' Votes',
                width: 700,
                height: 600,
                xaxis: {title: "Race"},
                yaxis: {title: "Population"},
                datarevision: this.state.tableData[0],
            }
            graph = <Graphs key={this.state.tableData[0]} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === 4){ //Gingles
            const xData = [];
            const yData = [];
            const yData2 = [];
            console.log(this.props.data[0]);
            let data = this.props.data[0];
            for (var i = 0; i < data["features"].length; i++) {
                const totalVotes = Math.round(data["features"][i]["properties"]["G22USSDBOY"] + data["features"][i]["properties"]["G22USSLSOP"] + data["features"][i]["properties"]["G22USSOWRI"] + data["features"][i]["properties"]["G22USSRBRI"])
                xData.push(Math.round(data["features"][i]["properties"]["WHT_NHSP22"] / data["features"][i]["properties"]["TOT_POP22"] * 100))
                yData.push(Math.round(data["features"][i]["properties"]["G22USSDBOY"] / totalVotes * 100));
                yData2.push(Math.round(data["features"][i]["properties"]["G22USSRBRI"] / totalVotes * 100));
            }
            const regressionLine = ss.linearRegressionLine(ss.linearRegression(xData.map((x, i) => [x, yData[i]])));
            // Calculate the line of best fit (linear regression)
            const regressionLine2 = ss.linearRegressionLine(ss.linearRegression(xData.map((x, i) => [x, yData2[i]])));
            // Generate the trendline data based on regression formula
            const trendlineData = xData.map(x => regressionLine(x));
            const trendlineData2 = xData.map(x => regressionLine2(x));
            console.log(trendlineData);
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
                {
                    x: xData,
                    y: trendlineData,
                    mode: 'lines',
                    type: 'scatter',
                    name: 'D',
                    line: { color: 'blue' }
                },
                {
                    x: xData,
                    y: trendlineData2,
                    mode: 'lines',
                    type: 'scatter',
                    name: 'R',
                    line: { color: 'red' }
                }
            ];
            let plotLayout = {
                title: '',
                xaxis: { title: '% White Pop.' },
                yaxis: { title: '% Votes' },
                width: 900,
                height: 700
            };
            graph = <Graphs data={plotData} layout={plotLayout}/>
        }
        else if (this.props.show === 6){ //Ensemble
            let plotData = [
                {
                    y: [0.1, 0.12, 0.18, 0.20],
                    type: 'box',
                    name: '1',
                    marker: { color: 'blue' }
                },
                {
                    y: [0.11, 0.15, 0.2, 0.23],
                    type: 'box',
                    name: '2',
                    marker: { color: 'blue' }
                },
                {
                    y: [0.12, 0.18, 0.22, 0.25],
                    type: 'box',
                    name: '3',
                    marker: { color: 'blue' }
                },
                {
                    y: [0.16, 0.2, 0.25, 0.27],
                    type: 'box',
                    name: '4',
                    marker: { color: 'blue' }
                },
                {
                    y: [0.23, 0.25, 0.3, 0.33],
                    type: 'box',
                    name: '5',
                    marker: { color: 'blue' }
                },
                {
                    y: [0.25, 0.28, 0.3, 0.38],
                    type: 'box',
                    name: '6',
                    marker: { color: 'blue' }
                },   
                {
                    y: [0.28, 0.34, 0.38, 0.42],
                    type: 'box',
                    name: '7',
                    marker: { color: 'blue' }
                }   ,
                {
                    y: [0.31, 0.43, 0.47, 0.56],
                    type: 'box',
                    name: '8',
                    marker: { color: 'blue' }
                },   
                {
                    y: [0.34, 0.47, 0.52, 0.61],
                    type: 'box',
                    name: '9',
                    marker: { color: 'blue' }
                }  
            ];

            let plotLayout = {
                title: 'LOCATION Pop. by Race',
                title: 'Boxplot Example',
                yaxis: { title: '% of Population', range: [0, 1] },
                width: 700,
                height: 600,
            }
            graph = <Graphs key={this.state.tableData + "_" + this.props.show} data={plotData} layout={plotLayout}/>
        };
        return (
            <div class="rightControlDis">
                {graph}
            </div>
        )
    }
}

export default RightControlDis;