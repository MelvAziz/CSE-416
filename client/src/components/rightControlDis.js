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
        if(this.props.show === 1){ //Economics
            let y = this.props.tableData[1];
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
                datarevision: this.state.tableData
            }
            graph = <Graphs key={this.state.tableData} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === 2){ //Race
            let graph;
            let y = this.props.tableData[1];
            if( y  === undefined) y = [3250658, 1314187, 13900, 444662];
            let plotData = {
                x: ["White", "Black", "Hispanic", "Other"],
                y: y,
                type: 'bar',
                mode: 'lines+markers',
                marker: { color: 'blue' },
            }
            let plotLayout = {
                title: this.props.tableData[0] + 'Pop. by Race',
                xaxis: {title: "Race"},
                yaxis: {title: "Population"},
                datarevision: this.state.tableData,
                width: 700,
                height: 600,
            }
            graph = <Graphs key={this.state.tableData} data={[plotData]} layout={plotLayout}/>;
        }
        else if (this.props.show === 3){ //Election
            let plotData = [
                {
                    y: [10, 15, 13, 17],
                    type: 'box',
                    name: 'Democrat',
                    marker: { color: 'blue' }
                },
                {
                    y: [16, 5, 11, 9],
                    type: 'box',
                    name: 'Republican',
                    marker: { color: 'red' }
                }
            ];

            let plotLayout = {
                title: 'Boxplot Example',
                yaxis: { title: 'Value' },
                width: 700,
                height: 600,
            };
            graph = <Graphs data={plotData} layout={plotLayout}/>
        }
        else if (this.props.show === 4){ //Gingles

            const xData = [];
            const yData = [];
            const yData2 = [];
            for (var i = 0; i < this.props.tableData[1]["features"].length; i++) {
                const totalVotes = Math.round(this.props.tableData[1]["features"][i]["properties"]["G22USSDBOY"] + this.props.tableData[1]["features"][i]["properties"]["G22USSLSOP"] + this.props.tableData[1]["features"][i]["properties"]["G22USSOWRI"] + this.props.tableData[1]["features"][i]["properties"]["G22USSRBRI"])
                xData.push(Math.round(this.props.tableData[1]["features"][i]["properties"]["WHT_NHSP22"] / this.props.tableData[1]["features"][i]["properties"]["TOT_POP22"] * 100))
                yData.push(Math.round(this.props.tableData[1]["features"][i]["properties"]["G22USSDBOY"] / totalVotes * 100));
                yData2.push(Math.round(this.props.tableData[1]["features"][i]["properties"]["G22USSRBRI"] / totalVotes * 100));
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
        return (
            <div class="rightControlDis">
                {graph}
            </div>
        )
    }
}

export default RightControlDis;