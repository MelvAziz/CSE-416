import React from 'react'
import denimg from "../graphs/Density1.png"
import raceimg from "../graphs/Bar2.png"
import ginimg from "../graphs/Scatter1.png"
import Graphs from "./plots.js"
import * as ss from 'simple-statistics'
class RightControlDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tableData: this.props.tableData}
    }
    render() {
        if (this.props.show === "Election"){
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
        return (
            <div class="rightControlDis">
                <Graphs data={plotData} layout={plotLayout}/>
            </div>
        );
        }
        else if (this.props.show === "Economics"){
            let plotData = {
                x: ["<10k", "10K-15K", "15K-20K", "20K-25K", "25K-30K", "30K-35K", "35K-40K", "40K-45K", "45K-50K", "50K-60K", "60K-75K", "75K-100K", "100K-125K", "125K-150K", "150K-200K", ">200K"],
                y: [1, 2, 3, 4, 5, 6, 7, 8,9, 10, 11, 12, 13, 14, 15, 16],
                type: 'bar',
                mode: 'lines+markers',
                marker: { color: 'green' },
              }

              let plotLayout = {
                title: 'LOCATION Income',
                width: 700,
                height: 600,
              }
            return (
                <div class="rightControlDis">
                    <Graphs data={[plotData]} layout={plotLayout}/>
                </div>
            );
        }
        else if (this.props.show === "Race"){
            let plotData = {
                x: ["White", "Black", "Hispanic", "Other"],
                y: [20000, 15000, 6000, 1000],
                type: 'bar',
                mode: 'lines+markers',
                marker: { color: 'blue' },
              }

            let plotLayout = {
                title: 'LOCATION Pop. by Race',
                width: 700,
                height: 600,
              }
            return (
                <div class="rightControlDis">
                    <Graphs data={[plotData]} layout={plotLayout}/>
                </div>
            );
        }
        else if (this.props.show === "Gingles"){
            const xData = [0, 20, 40, 60, 80, 100];
            const yData = [2, 4, 5, 4, 5, 7];
        
            // Calculate the line of best fit (linear regression)
            const regressionLine = ss.linearRegressionLine(ss.linearRegression(xData.map((x, i) => [x, yData[i]])));
        
            // Generate the trendline data based on regression formula
            const trendlineData = xData.map(x => regressionLine(x));
        
            let plotData = [
                {
                    x: xData,
                    y: yData,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'White Pop. (1000s)',
                    marker: { color: 'blue' }
                },
                {
                    x: xData,
                    y: trendlineData,
                    mode: 'lines',
                    type: 'scatter',
                    name: 'Best Fit Line',
                    line: { color: 'red' }
                }
            ];
        
            let plotLayout = {
                title: 'Likelyhood to Vote Rep.',
                xaxis: { title: '% to Vote Republican' },
                yaxis: { title: 'White Pop.' },
                width: 700,
                height: 500
            };
            return (
                <div class="rightControlDis">
                    <Graphs data={plotData} layout={plotLayout}/>
                </div>
            );
        }
    }
}

export default RightControlDis;