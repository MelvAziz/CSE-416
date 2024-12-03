import React from 'react'
import Graphs from "./plots.js"
class RacePage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
    }
    render() {
        if(this.yAxis  === undefined) {
            if(this.graphTitle === "Alabama") this.yAxis = [3250658, 1314187, 13900, 444662];
            else this.yAxis = [4873836, 507888, 31282, 536280]
        }
        let plotData = {
            x: ["White", "Black", "Hispanic", "Other"],
            y: this.yAxis,
            type: 'bar',
            marker: { color: 'blue' },
        }
        let plotLayout = {
            title: this.graphTitle + ' Pop. by Race',
            width: 700,
            height: 600,
            xaxis: {title: "Race"},
            yaxis: {title: "Population"},
            datarevision: this.graphTitle,
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default RacePage;