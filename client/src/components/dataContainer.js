import React from 'react'
import DataMenu from './dataMenu';
import DataDisplay from './dataDisplay';
class DataContainer extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {pageShown: this.props.viewMode, featureData: this.props.featureData};
        this.setView = this.props.setView;
    }
    render() {
        return (
            <div class="data-container">
                <DataMenu 
                    key={"Control_" + this.state.pageShown} 
                    buttonClicked = {this.setView} 
                    viewMode={this.state.pageShown}
                />
                <DataDisplay 
                    key={this.props.featureData[0] + "_sortBy" + this.props.sortBy} 
                    sortBy={this.props.sortBy} 
                    data={this.props.data} 
                    viewMode = {this.state.pageShown} 
                    featureData={this.state.featureData}
                />
            </div>
        );
    }
}

export default DataContainer;