import React from 'react'

class RightControlMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div class="rightControlMenu">
                <button> Overview </button>
                <button> Economics </button>
                <button> Race </button>
                <button> Election Stats </button>
                <button> Gingles </button>
                <button> Ecologic Inference </button>
            </div>
        );
    }
}

export default RightControlMenu;