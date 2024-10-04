import React from 'react'
import RightControlMenu from './rightControlMenu';
import RightControlDis from './rightControlDis';
class RightControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pageShown: ""};
        this.setDisplay = this.setDisplay.bind(this); 
    }

    setDisplay(buttonName){
        this.setState({pageShown: buttonName}); 
    }
    render() {

        return (
            <div class="rightControl">
                <RightControlMenu buttonClicked = {this.setDisplay}/>
                <RightControlDis show = {this.state.pageShown}/>
            </div>
        );
    }
}

export default RightControl;