import React from 'react'
import RightControlMenu from './rightControlMenu';
import RightControlDis from './rightControlDis';
class RightControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pageShown: "", tableData: this.props.tableData};
        this.setView = this.props.setView;
        this.setDisplay = this.setDisplay.bind(this); 
    }

    setDisplay(buttonName){
        this.setView(buttonName);
        this.setState({pageShown: buttonName}); 
    }
    render() {
        console.log(this.state.tableData);
        return (
            <div class="rightControl">
                <RightControlMenu buttonClicked = {this.setDisplay}/>
                <RightControlDis key={this.props.tableData} show = {this.state.pageShown} tableData={this.state.tableData}/>
            </div>
        );
    }
}

export default RightControl;