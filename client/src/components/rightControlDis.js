import React from 'react'
import denimg from "../graphs/Density1.png"
import ecoimg from "../graphs/Bar1.png"
import raceimg from "../graphs/Bar2.png"
import ginimg from "../graphs/Scatter1.png"
class RightControlDis extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        if (this.props.show == "Election Stats"){
        return (
            <div class="rightControlDis">
                <img src = {denimg}  width="700" height="500"></img>
            </div>
        );
        }
        else if (this.props.show == "Economics"){
            return (
                <div class="rightControlDis">
                    <img src = {ecoimg}  width="700" height="500"></img>
                </div>
            );
        }
        else if (this.props.show == "Race"){
            return (
                <div class="rightControlDis">
                    <img src = {raceimg}  width="700" height="500"></img>
                </div>
            );
        }
        else if (this.props.show == "Gingles"){
            return (
                <div class="rightControlDis">
                    <img src = {ginimg}  width="700" height="500"></img>
                </div>
            );
        }
    }
}

export default RightControlDis;