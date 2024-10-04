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
        let Dis = <RightControlDis key={this.props.tableData[0]} sortBy={this.props.sortBy} data={this.props.data} show = {this.state.pageShown} tableData={this.state.tableData}/>
        if(this.viewMode === 4) Dis = <RightControlDis key={this.props.tableData[0]+"_sortBy"+this.props.sortBy} sortBy={this.props.sortBy} data={this.props.data} show = {this.state.pageShown} tableData={this.state.tableData}/>
        console.log(this.props.sortBy);
        return (
            <div class="rightControl">
                <RightControlMenu buttonClicked = {this.setView}/>
                {Dis}
            </div>
        );
    }
}

export default RightControl;