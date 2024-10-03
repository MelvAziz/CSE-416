import React from 'react'
import MultiRangeSlider from "multi-range-slider-react";

class MapMenu extends React.Component {
    constructor(props) {
        super(props);
        this.singleMap = this.props.singleMap
        this.setView = this.props.setView;
        this.setSort = this.props.setSort;
        this.setRange = this.props.setRange;
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
    if(this.state.sortBy === "i") sliderVisible = "visible";
    let map_sub_selection = "";
    let map_subdivisions;
    let selectedTab = ["", "", ""];
    if(this.state.selected === "p") selectedTab[0] = "map_type_button_selected";
    else if(this.state.selected === "c") selectedTab[1] = "map_type_button_selected";
    else if(this.state.selected === "d") selectedTab[2] = "map_type_button_selected";

    let selectedSort = ["", "", "", "", ""];
    if(this.state.sortBy === "w") selectedSort[0] = "map_sort_button_selected";
    else if(this.state.sortBy === "b") selectedSort[1] = "map_sort_button_selected";
    else if(this.state.sortBy === "h") selectedSort[2] = "map_sort_button_selected";
    else if(this.state.sortBy === "a") selectedSort[3] = "map_sort_button_selected";
    else if(this.state.sortBy === "n") selectedSort[4] = "map_sort_button_selected";

    if(this.state.sortBy === "m") selectedSort[0] = "map_sort_button_selected";
    else if(this.state.sortBy === "i") selectedSort[1] = "map_sort_button_selected";

    if(this.props.viewMode !== 0) map_subdivisions = 
        <div class="map_type_container"> 
            <input  class={"map_type_button " + selectedTab[0]} type="button" value="Precinct" onClick={(e) => this.switchMap("p")}/>
            <input  class={"map_type_button " + selectedTab[1]} type="button" value="County" onClick={(e) => this.switchMap("c")}/>
            <input  class={"map_type_button " + selectedTab[2]} type="button" value="District" onClick={(e) => this.switchMap("d")}/>
        </div>
    if(this.props.viewMode === 1) map_sub_selection = 
    <div class="map_economic_sort_upper_container"> 
        <div class="map_sort_container map_economic_sort_container">
            <input  class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[0]} type="button" value="Median Income" onClick={(e) => this.switchSort("m")}/>
            <input   class={"map_sort_buttons map_economic_sort_buttons " + selectedSort[1]} type="button" value="Income Brackets" onClick={(e) => this.switchSort("i")}/>
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
            <input  class={"map_sort_buttons " + selectedSort[0]} type="button" value="White" onClick={(e) => this.switchSort("w")}/>
            <input  class={"map_sort_buttons " + selectedSort[1]} type="button" value="Black" onClick={(e) => this.switchSort("b")}/> 
            <input  class={"map_sort_buttons " + selectedSort[2]} type="button" value="Hispanic" onClick={(e) => this.switchSort("h")}/>
            <input  class={"map_sort_buttons " + selectedSort[3]} type="button" value="Asian" onClick={(e) => this.switchSort("a")}/> 
            <input  class={"map_sort_buttons " + selectedSort[4]} type="button" value="Native" onClick={(e) => this.switchSort("n")}/>
        </div>
        return (
            <div class="map_menu">
                <div class="map_types"> 
                    {/* <input class="map_buttons" type="button" value="Boundaries" onClick={(e) => this.switchView(0)}/> */}
                    <input  class="map_buttons" type="button" value="Economics" onClick={(e) => this.switchView(1)}/>
                    <input  class="map_buttons"  type="button" value="Race" onClick={(e) => this.switchView(2)}/>
                </div>
                {map_subdivisions}
                <hr class="map_menu_divider"/>
                {map_sub_selection}
            </div>
        ); 
    }
}


export default MapMenu;