import React from 'react'
import {Page, MapLevel} from '../constants.js';


class DataMenu extends React.Component {
    constructor(props) {
        super(props);
        this.buttonPushed = this.buttonPushed.bind(this); 
    }

    buttonPushed(name){
        this.props.buttonClicked(name); 
    }
    render() {
        let selectedTab = ["", "", "", "", "", "", "", "", "", ""];
        selectedTab[this.props.viewMode] = "right_sort_button_selected";
        return (
            <div class="data-menu">
                <button class={selectedTab[Page.OverviewPage]}          onClick={() => this.buttonPushed(Page.OverviewPage)}> Overview</button>
                <button class={selectedTab[Page.EconomicPage]}          onClick={() => this.buttonPushed(Page.EconomicPage)}> Economics </button>
                <button class={selectedTab[Page.RacePage]}              onClick={() => this.buttonPushed(Page.RacePage)}> Race </button>
                <button class={selectedTab[Page.ElectionPage]}          onClick={() => this.buttonPushed(Page.ElectionPage)}> Politics </button>
                <button class={selectedTab[Page.GinglesPage]}           onClick={() => this.buttonPushed(Page.GinglesPage)}> Gingles </button>
                <button class={selectedTab[Page.EcologicalInferencePage]} onClick={() => this.buttonPushed(Page.EcologicalInferencePage)}> Ecological Inference </button>
                <button class={selectedTab[Page.EnsemblePage]}          onClick={() => this.buttonPushed(Page.EnsemblePage)}> Ensemble Plan</button>
            </div>
        );
    }
}

export default DataMenu;