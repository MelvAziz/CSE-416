import React from 'react'
import Graphs from "./plots.js"
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';
import ElectionPage from './electionPage.js';
class OverviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
    }
    render() {
        return <div class="overview_page">
            <RacePage graphTitle={this.graphTitle} smallDisplay={true} />
            <EconomicPage graphTitle={this.graphTitle} smallDisplay={true} />
            <ElectionPage graphTitle={this.graphTitle} smallDisplay={true}/>
        </div>;
    }
}

export default OverviewPage;