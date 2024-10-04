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

        return (
            <div class="rightControlMenu">
                <button onClick={() => this.buttonPushed("Economics")}> Economics </button>
                <button onClick={() => this.buttonPushed("Race")}> Race </button>
                <button onClick={() => this.buttonPushed("Election")}> Election Stats </button>
                <button onClick={() => this.buttonPushed("Gingles")}> Gingles </button>
                <button onClick={() => this.buttonPushed("Ecological")}> Ecological Inference </button>
                <button onClick={() => this.buttonPushed("Ensemble")}> Ensemble Plan</button>
            </div>
        );
    }
}

export default RightControlMenu;