import React from 'react'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectState = this.props.selectState;
        this.switchState = this.props.dOptions;
    }
    render() {
        return (
            <div class="navbar">
                <h3>State District Analyzer</h3>
                <input class="navbar_button" type="button" onClick={(e) => this.switchState()} value={this.selectState}/>
            </div>
        );
    }
}

export default NavBar;