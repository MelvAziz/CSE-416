import React from 'react'

class RightControlMenu extends React.Component {
    constructor(props) {
        super(props);
        this.buttonPushed = this.buttonPushed.bind(this); 
    }

    buttonPushed(name){
        this.props.buttonClicked(name); 
    }
    render() {
        let selectedTab = ["", "", "", "", "", "", ""];
        selectedTab[this.props.viewMode-1] = "right_sort_button_selected";
        console.log(this.props.viewMode);
        return (
            <div class="rightControlMenu">
                <button class={selectedTab[0]} onClick={() => this.buttonPushed("Economics")}> Economics </button>
                <button class={selectedTab[1]} onClick={() => this.buttonPushed("Race")}> Race </button>
                <button class={selectedTab[2]} onClick={() => this.buttonPushed("Election")}> Election Stats </button>
                <button class={selectedTab[3]} onClick={() => this.buttonPushed("Gingles")}> Gingles </button>
                <button class={selectedTab[4]} onClick={() => this.buttonPushed("Ecological")}> Ecological Inference </button>
                <button class={selectedTab[5]} onClick={() => this.buttonPushed("Ensemble")}> Ensemble Plan</button>
            </div>
        );
    }
}

export default RightControlMenu;