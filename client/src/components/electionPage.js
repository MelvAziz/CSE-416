import React from 'react'
import Graphs from "./plots.js"
class ElectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
        this.smallDisplay = this.props.smallDisplay;
    }
    render() {
        let yAxis = this.yAxis;
        if (yAxis === undefined) {
            if (this.graphTitle.includes("Massachusetts"))
                yAxis = [[2382202, 1167202, 81998], ["Joe Biden", "Donald Trump", "Other"]];
            else if (this.graphTitle.includes("Alabama")) 
                yAxis = [[436746, 942154, 35338], ["Will Boyd", "Katie Britt", "Other"]];
        }
        let width = 700;
        let height = 600;
        let yAxisTitle = "Votes";
        if(this.smallDisplay === true) {
            width = 300;
            height = 300;
            let total = yAxis[0][0] +  yAxis[0][1] +  yAxis[0][2];
            yAxis[0] = [yAxis[0][0]/total, yAxis[0][1]/total, yAxis[0][2]/total];
            yAxisTitle = "% of Votes";
        }
        let plotData = {
            x: yAxis[1],
            y: yAxis[0],
            type: 'bar',
            marker: { color: ['blue', 'red', 'orange'] },
        }
        let plotLayout = {
            title: this.graphTitle + ' Votes',
            width: width,
            height: height,
            xaxis: {title: "Candidate"},
            yaxis: {title: yAxisTitle},
            datarevision: this.graphTitle,
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default ElectionPage;