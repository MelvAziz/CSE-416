import React from 'react'
import denimg from "../graphs/Density1.png"
import raceimg from "../graphs/Bar2.png"
import ginimg from "../graphs/Scatter1.png"
import BarGraph from "./barGraph.js";
class RightControlDis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tableData: this.props.tableData}
    }
    render() {
        if (this.props.show === "Election"){
        return (
            <div class="rightControlDis">
                <img src = {denimg}  width="700" height="500"></img>
            </div>
        );
        }
        else if (this.props.show === "Economics"){
            let graph;
            if(this.state.tableData !== undefined) {
                console.log(this.state.tableData);
                graph = <BarGraph key={this.state.tableData.x + "_" + this.state.tableData.y } data={this.state.tableData}/>
            }
            // }
            return (
                <div class="rightControlDis">
                    {graph}
                </div>
            );
        }
        else if (this.props.show === "Race"){
            return (
                <div class="rightControlDis">
                    <img src = {raceimg}  width="700" height="500"></img>
                </div>
            );
        }
        else if (this.props.show === "Gingles"){
            return (
                <div class="rightControlDis">
                    <img src = {ginimg}  width="700" height="500"></img>
                </div>
            );
        }
    }
}

export default RightControlDis;