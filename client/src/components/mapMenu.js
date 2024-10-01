import React from 'react'

class MapMenu extends React.Component {
    constructor(props) {
        super(props);
        this.singleMap = this.props.singleMap
        this.setCheck = this.props.setCheck;
        this.setView = this.props.setView;
        this.setSort = this.props.setSort;
        this.switchMap = this.switchMap.bind(this);
        this.addMap = this.addMap.bind(this);
        this.switchView = this.switchView.bind(this);
        this.state = {selected: this.props.selected, viewMode: this.props.viewMode, sortBy: this.props.sortBy};
    }
    switchMap(option) {
        this.singleMap(option);
        this.setState({selected: option});
    }
    addMap(option) {
        this.setCheck(option);
    }
    switchView(option) {
        this.setView(option);
        this.setState({selected: ""});
    }
    switchSort(option) {
        this.setSort(option);
        this.setState({sortBy: option})
    }
    render() {        
    let map_race_sorting = "";
    let map_subdivisions = 
        <div class="map_subdivisions"> 
            <div class="map_checkbox_container">
                <input class={"map_checkboxes_" + this.viewMode} type="checkbox" onChange={(e) => this.addMap(0)}/>
                <p class="map_checkbox_text">Precincts</p>
            </div>
            <div class="map_checkbox_container">
                <input class={"map_checkboxes_" + this.viewMode} type="checkbox" onChange={(e) => this.addMap(1)}/>
                <p class="map_checkbox_text">Counties</p>
            </div>
            <div class="map_checkbox_container">
                <input class={"map_checkboxes_" + this.viewMode} type="checkbox" onChange={(e) => this.addMap(2)}/>
                <p class="map_checkbox_text">Districts</p>
            </div>  
        </div>;
    let selected = this.selected; 
    if(this.props.viewMode !== 0) map_subdivisions = 
        <div class="map_dropdown_container"> 
            <select id="map_dropdown" value={selected} onChange={(e) => this.switchMap(e.target.value)}>
                <option value="">Please select</option>
                <option value="p">Precinct</option>
                <option value="c">County</option>
                <option value="d">District</option>
            </select>
        </div>
    if(this.props.viewMode === 2) map_race_sorting = 
        <div class="map_race_dropdown_container"> 
            <select id="map__race_dropdown" value={selected} onChange={(e) => this.switchSort(e.target.value)}>
                <option value="">Please select</option>
                <option value="w">White</option>
                <option value="b">Black</option>
                <option value="h">Hispanic</option>
                <option value="a">Asian</option>
                <option value="n">Native</option>
            </select>
        </div>
        return (
            <div class="map_menu">
                <div class="map_types"> 
                    <input class="map_buttons" type="button" value="Boundaries" onClick={(e) => this.switchView(0)}/>
                    <input  class="map_buttons" type="button" value="Economics" onClick={(e) => this.switchView(1)}/>
                    <input  class="map_buttons"  type="button" value="Race" onClick={(e) => this.switchView(2)}/>
                </div>
                {map_subdivisions}
                {map_race_sorting}
                
            </div>
        ); 
    }
}


export default MapMenu;