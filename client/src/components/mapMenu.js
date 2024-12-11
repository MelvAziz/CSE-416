import React from 'react'
import {Page, MapLevel, SortingMethod} from '../constants.js';
import MultiRangeSlider from "multi-range-slider-react";

class MapMenu extends React.Component {
    constructor(props) {
        super(props);
        this.setMapLevel = this.props.setMapLevel
        this.setView = this.props.setView;
        this.setSort = this.props.setSort;
        this.setRange = this.props.setRange;
        this.selectedState = this.props.selectedState;
        this.switchMap = this.switchMap.bind(this);
        this.switchView = this.switchView.bind(this);
        this.state = {mapLevel: this.props.mapLevel, viewMode: this.props.viewMode, sortBy: this.props.sortBy};
    }
    switchMap(option) {
        this.setMapLevel(option);
        this.setState({mapLevel: option});
    }
    switchView(option) {
        this.setView(option);
    }
    switchSort(option) {
        this.setSort(option);
        this.setState({sortBy: option})
    }
    render() {        
        let sliderVisible = "hidden";
        if (this.state.sortBy === SortingMethod.incomeBrackets) sliderVisible = "visible";
        let heatmap_type = "";
        let map_subdivisions; // Precinct/County/District 
        let selectedTab = ["", "", ""];
        if      (this.props.mapLevel === MapLevel.precinct)  selectedTab[0] = "map_type_button_selected";
        else if (this.props.mapLevel === MapLevel.county)    selectedTab[1] = "map_type_button_selected";
        else if (this.props.mapLevel === MapLevel.district)  selectedTab[2] = "map_type_button_selected";

        let selectedSort = ["", "", "", ""];
        
        if(this.props.viewMode === Page.economicPage) {
            map_subdivisions = 
            <div class="map_type_container"> 
                <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) =>  this.switchMap(MapLevel.precinct)}/>
                <input  class={"map_type_button " + selectedTab[1]} type="button" value="County" onClick={(e) =>    this.switchMap(MapLevel.county)}/>
            </div>;
        }
        else if(this.props.viewMode === Page.racePage) map_subdivisions = 
            <div class="map_type_container"> 
                <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) =>  this.switchMap(MapLevel.precinct)}/>
                <input  class={"map_type_button " + selectedTab[1]} type="button" value="County" onClick={(e) =>    this.switchMap(MapLevel.county)}/>
                <input  class={"map_type_button " + selectedTab[2]} type="button" value="District" onClick={(e) =>  this.switchMap(MapLevel.district)}/>
            </div>;


        if(this.props.viewMode === Page.economicPage) {
            if(this.state.sortBy === SortingMethod.medianIncome)            selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.incomeBrackets)     selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.urbanRural)         selectedSort[2] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_economic_sort_upper_container"> 
                <div class="map_sort_container map_economic_sort_container">
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[0]} type="button" value="Median Income" onClick={(e) => this.switchSort(SortingMethod.medianIncome)}/>
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[1]} type="button" value="Income Brackets" onClick={(e) => this.switchSort(SortingMethod.incomeBrackets)}/>
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[2]} type="button" value="Rural vs. Urban" onClick={(e) => this.switchSort(SortingMethod.urbanRural)}/>
                </div>
                <MultiRangeSlider
                    class = {"economic_slider"}
                    min={0}
                    max={7}
                    step={1}
                    minValue={3}
                    maxValue={6}
                    labels={["0k", "25k", "50k", "75k", "100k", "125k", "150k", "+"]}
                    stepOnly = {true}
                    style={{'font-size': '16px', 'width': 'max(38vw, 28rem)', 'visibility': sliderVisible}}
                    onInput={(e) => {
                        this.setRange(e);
                    }}
                />
            </div>
        }
        else if(this.props.viewMode === Page.racePage)  {
            if(this.state.sortBy === SortingMethod.whiteRace)         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.blackRace)    selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.hispanicRace) selectedSort[2] = "map_sort_button_selected";
            
            heatmap_type = 
            <div class="map_sort_container map_race_sort_container">
                <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort(SortingMethod.whiteRace)}/>
                <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort(SortingMethod.blackRace)}/> 
                <input  class={"map_sort_buttons " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort(SortingMethod.hispanicRace)}/>
            </div>
        }
        else if(this.props.viewMode === Page.electionPage) {
            if(this.state.sortBy === SortingMethod.bothPartiesElection)       selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.democraticElection)   selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.republicanElection)   selectedSort[2] = "map_sort_button_selected";
            let elecTitle = "2020 President ";
            if(this.selectedState === "Alabama") elecTitle = "2022 Senator ";
            heatmap_type = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[0]} type="button" value={elecTitle + "(General)"} onClick={(e) =>       this.switchSort(SortingMethod.bothPartiesElection)}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[1]} type="button" value={elecTitle + "(Democratic)"} onClick={(e) =>    this.switchSort(SortingMethod.democraticElection)}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[2]} type="button" value={elecTitle + "(Republican)"} onClick={(e) =>    this.switchSort(SortingMethod.republicanElection)}/>
            </div>
        }
        else if(this.props.viewMode === Page.ecologicalInferencePage || this.props.viewMode === Page.ginglesPage || this.props.viewMode === Page.ensemblePage) {
            if(this.state.sortBy === SortingMethod.whiteRace)         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.blackRace)    selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.hispanicRace) selectedSort[2] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E0to25)       selectedSort[6] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E25to50)      selectedSort[7] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E50to75)      selectedSort[8] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E75to100)     selectedSort[9] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E100to125)    selectedSort[10] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E125to150)    selectedSort[11] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.E150more)     selectedSort[12] = "map_sort_button_selected";
            let col_2 = "";
            if(this.props.viewMode === Page.ensemblePage) {
                if(this.state.sortBy === SortingMethod.urban)             selectedSort[3] = "map_sort_button_selected";
                else if(this.state.sortBy === SortingMethod.suburban)     selectedSort[4] = "map_sort_button_selected";
                else if(this.state.sortBy === SortingMethod.rural)        selectedSort[5] = "map_sort_button_selected";
                col_2 = <div class="col_2">
                        <input  class={"map_sort_buttons " + selectedSort[3]} type="button" value="Urban" onClick={(e) =>       this.switchSort(SortingMethod.urban)}/>
                        <input  class={"map_sort_buttons " + selectedSort[4]} type="button" value="Suburban" onClick={(e) =>    this.switchSort(SortingMethod.suburban)}/>
                        <input  class={"map_sort_buttons " + selectedSort[5]} type="button" value="Rural" onClick={(e) =>       this.switchSort(SortingMethod.rural)}/>
                    </div>
            }
            else if(this.props.viewMode === Page.ecologicalInferencePage) {
                if(this.state.sortBy === SortingMethod.politicalIncome)  selectedSort[3] = "map_sort_button_selected";
                col_2 = <div class="col_2">
                        <input  class={"map_sort_buttons " + selectedSort[3]} type="button" value="Political Income" onClick={(e) =>       this.switchSort(SortingMethod.politicalIncome)}/>
                    </div>
            }
            heatmap_type = 
            <div class="map_sort_container map_eco_sort_container">
                <div class="col_1">
                    <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort(SortingMethod.whiteRace)}/>
                    <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort(SortingMethod.blackRace)}/> 
                    <input  class={"map_sort_buttons " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort(SortingMethod.hispanicRace)}/>         
                </div>
                {col_2}
                <div class="col_3">
                    <input  class={"map_sort_buttons " + selectedSort[6]} type="button" value="0-25k" onClick={(e) =>       this.switchSort(SortingMethod.E0to25)}/>
                    <input  class={"map_sort_buttons " + selectedSort[7]} type="button" value="25-50k" onClick={(e) =>      this.switchSort(SortingMethod.E25to50)}/>
                    <input  class={"map_sort_buttons " + selectedSort[8]} type="button" value="50-75k" onClick={(e) =>      this.switchSort(SortingMethod.E50to75)}/>
                    <input  class={"map_sort_buttons " + selectedSort[9]} type="button" value="75-100k" onClick={(e) =>     this.switchSort(SortingMethod.E75to100)}/>     
                </div>
                <div class="col_4">
                    <input  class={"map_sort_buttons " + selectedSort[10]} type="button" value="100-125k" onClick={(e) =>    this.switchSort(SortingMethod.E100to125)}/>
                    <input  class={"map_sort_buttons " + selectedSort[11]} type="button" value="125-150k" onClick={(e) =>    this.switchSort(SortingMethod.E125to150)}/>
                    <input  class={"map_sort_buttons " + selectedSort[12]} type="button" value="150k+" onClick={(e) =>       this.switchSort(SortingMethod.E150more)}/>
                </div>
                
            </div>
        }
        else if(this.props.viewMode === Page.ensemblePage) {
            if(this.state.sortBy === SortingMethod.whiteRace)         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === SortingMethod.blackRace)    selectedSort[1] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort(SortingMethod.whiteRace)}/>
                <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort(SortingMethod.blackRace)}/> 
            </div>
        }
        return (
            <div class="map_menu">
                {map_subdivisions}
                <hr class="map_menu_divider"/>
                {heatmap_type}
            </div>
        ); 
    }
}


export default MapMenu;