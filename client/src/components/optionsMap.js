import React from 'react'
import BasicMap from './basicMap.js'
import alabama from '../GeoData/alabama_precincts.json'

class OptionsMap extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BasicMap data={alabama} />
        ); 
    }
}


export default OptionsMap;