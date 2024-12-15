import React from 'react'
import Graphs from "./plots.js"
class RegionPage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
        this.smallDisplay = this.props.smallDisplay;
    }
    render() {
        if(this.yAxis  === undefined) { // Use state-level data as default
            if(this.graphTitle === "Alabama") this.yAxis = [408975, 3202605, 1412581];
            else this.yAxis = [3681091, 3231588,  115580]
        }
        let yAxis = this.yAxis;
        let width = 450;
        let height = 350;
        let yAxisTitle = "Population";
        let title = this.graphTitle;
        if(this.smallDisplay === true) {
            let total = yAxis[0] + yAxis[1] + yAxis[2];
            this.yAxis = [yAxis[0]/total, yAxis[1]/total, yAxis[2]/total];
            width = 210;
            height = 325;
            yAxisTitle = "% of Population"
            title = 'Pop. by Region'
        }
        let plotData = {
            x: ["Urban", "Suburban", "Rural"],
            y: this.yAxis,
            type: 'bar',
            marker: { color: ['purple', 'orange', 'yellow'] },
        }
        let plotLayout = {
            title: title,
            width: width,
            height: height,
            xaxis: {title: "Region Type"},
            yaxis: {title: yAxisTitle},
            datarevision: this.graphTitle,
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default RegionPage;