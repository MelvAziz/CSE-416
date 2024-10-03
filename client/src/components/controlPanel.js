import React from 'react'
import CheckBox from "./CheckBox.js"; 
class ControlPanel extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return(<form>
           <CheckBox value={false} setValue={false} label={"Show Maps"}/>
           <CheckBox value={false} setValue={false} label={"Show Graphs"}/>
           <CheckBox value={false} setValue={false} label={"Compare States"}/>

        </form>);
    }
}

export default ControlPanel; 