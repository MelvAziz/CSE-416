import React from 'react'

class MapLegend extends React.Component {
    constructor(props) {
        super(props);
        this.colors = this.props.colors;
        this.labels = this.props.labels
    }
    render() {
        let i = 0;
        const legend = this.colors.map(c => {
            if (c === null) {
                return (
                    <div key={"legend_" + this.labels[i]} class="legend_item">
                        <p class="legend_label">{this.labels[i++]}</p>
                    </div>
                )
            }
            else {
                return (
                    <div key={"legend_" + c} class="legend_item">
                        <div class="legend_block" style={{ 'background-color': c }}></div>
                        <p class="legend_label">{this.labels[i++]}</p>
                    </div>
                )
            }

        })
        return (
            <div class="map_legend">
                <p class="map_legend_title">Legend</p>
                <hr />
                {legend}
            </div>
        );
    }
}

export default MapLegend;