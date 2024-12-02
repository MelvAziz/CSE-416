import React from 'react'
import Graphs from "./plots.js"
class EconomicPage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
    }
    render() {
        if(this.yAxis === undefined) {
            if(this.graphTitle === "Alabama") this.yAxis = [411314, 408649, 323211, 239693, 166596, 116460, 127890, 124471];
            else this.yAxis = [369303, 353032, 336230, 301312, 256373, 211933, 309177, 512776]
        }
        let plotData = {
            x: ["<25K", "25K-50K", "50K-75K", "75K-100K", "100K-125K", "125K-150K", "150K-200K", ">200K"],
            y: this.yAxis,
            type: 'bar',
            marker: { color: 'green' },
            }
        let plotLayout = {
            title: this.graphTitle.split('_')[0] + ' Income Distribution',
            width: 700,
            height: 600,
            xaxis: {title: "Economic Brackets"},
            yaxis: {title: "# of Households"},
            datarevision: this.graphTitle
        }
        return <Graphs key={this.graphTitle} data={[plotData]} layout={plotLayout}/>;
    }
}

export default EconomicPage;