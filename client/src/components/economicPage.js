import React from 'react'
import Graphs from "./plots.js"
class EconomicPage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
        this.smallDisplay = this.props.smallDisplay;
    }
    render() {
        if(this.yAxis === undefined) { // Return state-level data
            if(this.graphTitle === "Alabama") this.yAxis = [411314, 408649, 323211, 239693, 166596, 116460, 252361];
            else this.yAxis = [369303, 353032, 336230, 301312, 256373, 211933, 821953]
        }
        let yAxis = this.yAxis;
        let width = 700;
        let height = 600;
        let yAxisTitle = "# of Households";
        if(this.smallDisplay === true) {
            let total = yAxis[0] + yAxis[1] + yAxis[2] + yAxis[3] + yAxis[4] + yAxis[5] + yAxis[6];
            this.yAxis = [yAxis[0]/total, yAxis[1]/total, yAxis[2]/total, yAxis[3]/total, yAxis[4]/total, yAxis[5]/total, yAxis[6]/total]
            width = 350;
            height = 300;
            yAxisTitle = "% of Households";
        }
        let plotData = {
            x: ["<25K", "25K-50K", "50K-75K", "75K-100K", "100K-125K", "125K-150K", ">150K"],
            y: this.yAxis,
            type: 'bar',
            marker: { color: 'green' },
        }
        let plotLayout = {
            title: this.graphTitle.split('_')[0] + ' Income Distribution',
            width: width,
            height: height,
            xaxis: {title: "Economic Brackets"},
            yaxis: {title: yAxisTitle},
            datarevision: this.graphTitle
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default EconomicPage;