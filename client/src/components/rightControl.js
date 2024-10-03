import React from 'react'
import RightControlMenu from './rightControlMenu';
import RightControlDis from './rightControlDis';
class RightControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedState: this.props.selectedState};
    }
    render() {

        return (
            <div class="rightControl">
                <RightControlMenu/>
                <RightControlDis/>
            </div>
        );
    }
}

export default RightControl;