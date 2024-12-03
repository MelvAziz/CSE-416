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
                <button class={selectedTab[Page.overviewPage]}          onClick={() => this.buttonPushed(Page.overviewPage)}> Overview</button>
                <button class={selectedTab[Page.economicPage]}          onClick={() => this.buttonPushed(Page.economicPage)}> Economics </button>
                <button class={selectedTab[Page.racePage]}              onClick={() => this.buttonPushed(Page.racePage)}> Race </button>
                <button class={selectedTab[Page.electionPage]}          onClick={() => this.buttonPushed(Page.electionPage)}> Politics </button>
                <button class={selectedTab[Page.ginglesPage]}           onClick={() => this.buttonPushed(Page.ginglesPage)}> Gingles </button>
                <button class={selectedTab[Page.ecologicalInferencePage]} onClick={() => this.buttonPushed(Page.ecologicalInferencePage)}> Ecological Inference </button>
                <button class={selectedTab[Page.ensemblePage]}          onClick={() => this.buttonPushed(Page.ensemblePage)}> Ensemble Plan</button>
            </div>
        );
    }
}

export default DataMenu;