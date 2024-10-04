import React from 'react'
import MultiRangeSlider from "multi-range-slider-react";

class MapMenu extends React.Component {
    constructor(props) {
        super(props);
        this.singleMap = this.props.singleMap
        this.setView = this.props.setView;
        this.setSort = this.props.setSort;
        this.setRange = this.props.setRange;
        this.selectedState = this.props.selectedState;
        this.switchMap = this.switchMap.bind(this);
        this.switchView = this.switchView.bind(this);
        this.state = {selected: this.props.selected, viewMode: this.props.viewMode, sortBy: this.props.sortBy};
    }
    switchMap(option) {
        this.singleMap(option);
        this.setState({selected: option});
    }
    switchView(option) {
        this.setView(option);
        // this.setState({selected: "p"});
    }
    switchSort(option) {
        this.setSort(option);
        this.setState({sortBy: option})
    }
    render() {        
        let sliderVisible = "hidden";
        if(this.state.sortBy === "inc") sliderVisible = "visible";
        let map_sub_selection = "";
        let map_subdivisions;
        let selectedTab = ["", "", ""];
        if(this.state.selected === "pre")       selectedTab[0] = "map_type_button_selected";
        else if(this.state.selected === "cnt")  selectedTab[1] = "map_type_button_selected";
        else if(this.state.selected === "dis")  selectedTab[2] = "map_type_button_selected";

        let selectedSort = ["", "", "", "", "", "", ""];
        if(this.state.sortBy === "wht")         selectedSort[0] = "map_sort_button_selected";
        else if(this.state.sortBy === "blk")    selectedSort[1] = "map_sort_button_selected";
        else if(this.state.sortBy === "hsp")    selectedSort[2] = "map_sort_button_selected";
        else if(this.state.sortBy === "asn")    selectedSort[3] = "map_sort_button_selected";
        else if(this.state.sortBy === "aia")    selectedSort[4] = "map_sort_button_selected";

        if(this.state.sortBy === "med")         selectedSort[0] = "map_sort_button_selected";
        else if(this.state.sortBy === "inc")    selectedSort[1] = "map_sort_button_selected";

        if(this.state.sortBy === "sen1")        selectedSort[0] = "map_sort_button_selected";
        else if(this.state.sortBy === "sen2")   selectedSort[1] = "map_sort_button_selected";
        else if(this.state.sortBy === "sen3")   selectedSort[2] = "map_sort_button_selected";
        else if(this.state.sortBy === "gov1")   selectedSort[3] = "map_sort_button_selected";
        else if(this.state.sortBy === "gov2")   selectedSort[4] = "map_sort_button_selected";
        else if(this.state.sortBy === "gov3")   selectedSort[5] = "map_sort_button_selected";
        
        if(this.props.viewMode === 1) map_subdivisions = 
            <div class="map_type_container"> 
                <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) =>  this.switchMap("pre")}/>
                <input  class={"map_type_button " + selectedTab[1]} type="button" value="County" onClick={(e) =>    this.switchMap("cnt")}/>
            </div>;
        else if(this.props.viewMode === 2) map_subdivisions = 
            <div class="map_type_container"> 
                <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) =>  this.switchMap("pre")}/>
                <input  class={"map_type_button " + selectedTab[1]} type="button" value="County" onClick={(e) =>    this.switchMap("cnt")}/>
                <input  class={"map_type_button " + selectedTab[2]} type="button" value="District" onClick={(e) =>  this.switchMap("dis")}/>
            </div>;
        else if(this.props.viewMode === 3 || this.props.viewMode === 4) map_subdivisions = 
        <div class="map_type_container"> 
            <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) =>  this.switchMap("pre")}/>
        </div>;
        if(this.props.viewMode === 1) map_sub_selection = 
        <div class="map_economic_sort_upper_container"> 
            <div class="map_sort_container map_economic_sort_container">
                <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[0]} type="button" value="Median Income" onClick={(e) => this.switchSort("med")}/>
                <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[1]} type="button" value="Income Brackets" onClick={(e) => this.switchSort("inc")}/>
            </div>
            <MultiRangeSlider
                class = {"economic_slider"}
                min={0}
                max={16}
                step={1}
                minValue={3}
                maxValue={10}
                labels={[ "0k", "10k", "15k", "20k", "25k", "30k", "35k", "40k", "45k", "50k", "60k", "75k", "100k", "125k", "150k", "200k", "+"]}
                stepOnly = {true}
                style={{'font-size': '16px', 'width': 'max(38vw, 28rem)', 'visibility': sliderVisible}}
                onInput={(e) => {
                    this.setRange(e);
                }}
            />
        </div>
        if(this.props.viewMode === 2) map_sub_selection = 
            <div class="map_sort_container map_race_sort_container">
                <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort("wht")}/>
                <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) =>       this.switchSort("blk")}/> 
                <input  class={"map_sort_buttons " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort("hsp")}/>
                <input  class={"map_sort_buttons " + selectedSort[3]} type="button" value="Asian" onClick={(e) =>       this.switchSort("asn")}/> 
                <input  class={"map_sort_buttons " + selectedSort[4]} type="button" value="Native" onClick={(e) =>      this.switchSort("aia")}/>
            </div>
        if(this.props.viewMode === 3 && this.selectedState === "Alabama") map_sub_selection = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[0]} type="button" value="2022 Senator (General)" onClick={(e) =>       this.switchSort("sen1")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[1]} type="button" value="2022 Senator (Democratic)" onClick={(e) =>    this.switchSort("sen2")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[2]} type="button" value="2022 Senator (Republican)" onClick={(e) =>    this.switchSort("sen3")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[3]} type="button" value="2022 Governor (General)" onClick={(e) =>      this.switchSort("gov1")}/> 
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[4]} type="button" value="2022 Governor (Democratic)" onClick={(e) =>   this.switchSort("gov2")}/> 
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[5]} type="button" value="2022 Governor (Republican)" onClick={(e) =>   this.switchSort("gov3")}/> 
            </div>
        else if(this.props.viewMode === 3) {
            map_sub_selection = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[3]} type="button" value="2020 President (General)" onClick={(e) =>       this.switchSort("gov1")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[4]} type="button" value="2020 President (Democratic)" onClick={(e) =>    this.switchSort("gov2")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[5]} type="button" value="2020 President (Republican)" onClick={(e) =>    this.switchSort("gov3")}/>
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[0]} type="button" value="2020 Senator (General)" onClick={(e) =>      this.switchSort("sen1")}/> 
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[1]} type="button" value="2020 Senator (Democratic)" onClick={(e) =>   this.switchSort("sen2")}/> 
                <input  class={"map_sort_buttons map_election_sort_button " + selectedSort[2]} type="button" value="2020 Senator (Republican)" onClick={(e) =>   this.switchSort("sen3")}/> 
            </div>
        }
        if(this.props.viewMode === 4) map_sub_selection = 
            <div class="map_sort_container map_election_sort_container">
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[0]} type="button" value="White" onClick={(e) =>       this.switchSort("ecowht")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[1]} type="button" value="Black" onClick={(e) =>    this.switchSort("ecoblk")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) =>    this.switchSort("ecohsp")}/>
                <input  class={"map_sort_buttons map_eco_sort_button " + selectedSort[3]} type="button" value="Economic" onClick={(e) =>   this.switchSort("ecoinc")}/> 
            </div>
        return (
            <div class="map_menu">
                {map_subdivisions}
                <hr class="map_menu_divider"/>
                {map_sub_selection}
            </div>
        ); 
    }
}


export default MapMenu;