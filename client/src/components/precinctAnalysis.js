import React from 'react'
import Graphs from "./plots.js"
import EconomicPage from './economicPage.js';
import RacePage from './racePage.js';
import ElectionPage from './electionPage.js';
import RegionPage from './regionPage.js';
class PrecinctAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.yAxis = this.props.yAxis;
        this.graphTitle = this.props.graphTitle;
    }
    render() {
        return <div class="precinct_page">
            <div class="precinct_col_1">
                <RacePage graphTitle={this.graphTitle}  key={this.yAxis} yAxis={this.yAxis}/>
                <EconomicPage graphTitle={this.graphTitle} key={this.yAxis} yAxis={this.yAxis}/>
            </div>
            <div class="precinct_col_2">
                <ElectionPage graphTitle={this.graphTitle} key={this.yAxis} yAxis={this.yAxis}/>
                <RegionPage graphTitle={this.graphTitle} key={this.yAxis} yAxis={this.yAxis}/>
            </div>
        </div>;
    }
}

export default PrecinctAnalysis;