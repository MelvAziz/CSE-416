import React from 'react'
import RightControlMenu from './rightControlMenu';
import RightControlDis from './rightControlDis';
class RightControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pageShown: this.props.viewMode, tableData: this.props.tableData};
        this.setView = this.props.setView;
    }
    render() {
        console.log(this.state.tableData);
        return (
            <div class="rightControl">
                <RightControlMenu buttonClicked = {this.setView}/>
                <RightControlDis key={this.props.tableData[0]} data={this.props.data} show = {this.state.pageShown} tableData={this.state.tableData}/>
            </div>
        );
    }
}

export default RightControl;