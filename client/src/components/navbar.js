import React from 'react'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectedStates = this.props.selectedStates;
        this.switchState = this.props.dOptions;
        this.state = {selectedState: this.props.selectedState};
    }
    render() {
        const statesList = this.selectedStates.map(s => {
            let insert = "navbar_button"
            if(this.state.selectedState === s) insert = "navbar_button navbar_button_selected";
            return <input key={"navbar_button_" + s} class={insert} type="button" onClick={(e) => this.switchState(s)} value={s}/>
        })
        return (
            <div class="navbar">
                <h3 class="navbar_title">State District Analyzer</h3>
                <div class="navbar_button_container">
                    {statesList}
                </div>
            </div>
        );
    }
}

export default NavBar;