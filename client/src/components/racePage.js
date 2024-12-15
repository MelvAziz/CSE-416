import React from 'react'
import Graphs from "./plots.js"
class RacePage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
        this.smallDisplay = this.props.smallDisplay;
    }
    render() {
        if(this.yAxis  === undefined) { // Use state-level data as default
            if(this.graphTitle === "Alabama") this.yAxis = [3250658, 1314187, 458562];
            else this.yAxis = [4873836, 507888, 567562]
        }
        let yAxis = this.yAxis;
        let width = 450;
        let height = 350;
        let yAxisTitle = "Population";
        let title = this.graphTitle + ' Pop. by Race';
        if(this.smallDisplay === true) {
            let total = yAxis[0] + yAxis[1] + yAxis[2];
            this.yAxis = [yAxis[0]/total, yAxis[1]/total, yAxis[2]/total];
            title = 'Pop. by Race';
            width = 225;
            height = 325;
            yAxisTitle = "% of Population"
        }
        let plotData = {
            x: ["White", "Black", "Other"],
            y: this.yAxis,
            type: 'bar',
            marker: { color: 'blue' },
        }
        let plotLayout = {
            title: title,
            width: width,
            height: height,
            xaxis: {title: "Race"},
            yaxis: {title: yAxisTitle},
            datarevision: this.graphTitle,
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default RacePage;