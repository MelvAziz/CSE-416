import React from 'react'
import {Page, MapLevel} from '../constants.js';
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
        if (this.state.sortBy === "inc") sliderVisible = "visible";
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
            if(this.state.sortBy === "med")         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === "inc")    selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === "rur")    selectedSort[2] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_economic_sort_upper_container"> 
                <div class="map_sort_container map_economic_sort_container">
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[0]} type="button" value="Median Income" onClick={(e) => this.switchSort("med")}/>
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[1]} type="button" value="Income Brackets" onClick={(e) => this.switchSort("inc")}/>
                    <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[2]} type="button" value="Rural vs. Urban" onClick={(e) => this.switchSort("rur")}/>
                </div>
                <MultiRangeSlider
                    class = {"economic_slider"}
                    min={0}
                    max={8}
                    step={1}
                    minValue={3}
                    maxValue={6}
                    labels={["0k", "25k", "50k", "75k", "100k", "125k", "150k", "200k", "+"]}
                    stepOnly = {true}
                    style={{'font-size': '16px', 'width': 'max(38vw, 28rem)', 'visibility': sliderVisible}}
                    onInput={(e) => {
                        this.setRange(e);
                    }}
                />
            </div>
        }
        else if(this.props.viewMode === Page.racePage)  {
            if(this.state.sortBy === "wht")         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === "blk")    selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === "hsp")    selectedSort[2] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_sort_container map_race_sort_container">
                <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort("wht")}/>
                <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort("blk")}/> 
                <input  class={"map_sort_buttons " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort("hsp")}/>
            </div>
        }
        else if(this.props.viewMode === Page.electionPage) {
            if(this.state.sortBy === "elec1")        selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === "elec2")   selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === "elec3")   selectedSort[2] = "map_sort_button_selected";
            let elecTitle = "2020 President ";
            if(this.selectedState === "Alabama") elecTitle = "2022 Senator ";
            heatmap_type = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[0]} type="button" value={elecTitle + "(General)"} onClick={(e) =>       this.switchSort("elec1")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[1]} type="button" value={elecTitle + "(Democratic)"} onClick={(e) =>    this.switchSort("elec2")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[2]} type="button" value={elecTitle + "(Republican)"} onClick={(e) =>    this.switchSort("elec3")}/>
            </div>
        }
        else if(this.props.viewMode === Page.ecologicalInferencePage || this.props.viewMode === Page.ginglesPage) {
            if(this.state.sortBy === "wht")         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === "blk")    selectedSort[1] = "map_sort_button_selected";
            else if(this.state.sortBy === "hsp")    selectedSort[2] = "map_sort_button_selected"; 
            else if(this.state.sortBy === "inc")    selectedSort[3] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_sort_container map_eco_sort_container">
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort("wht")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort("blk")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort("hsp")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[3]} type="button" value="Economic" onClick={(e) =>    this.switchSort("inc")}/> 
            </div>
        }
        else if(this.props.viewMode === Page.ensemblePage) {
            if(this.state.sortBy === "wht")         selectedSort[0] = "map_sort_button_selected";
            else if(this.state.sortBy === "blk")    selectedSort[1] = "map_sort_button_selected";
            heatmap_type = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[0]} type="button" value="White" onClick={(e) =>    this.switchSort("wht")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[1]} type="button" value="Black" onClick={(e) =>    this.switchSort("blk")}/>
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