import React from 'react';
import Plot from 'react-plotly.js';


const Graphs = ({ data, layout, onClick }) => {
    return (
      <div>
        {/* Ensure the Plot component receives the updated data as a prop */}
        <Plot
          data={data}
          layout={layout}
          onClick={onClick}
        />
      </div>
    );
  };
  
  export default Graphs;
