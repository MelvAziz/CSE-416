import React, { useState } from "react";
import Plot from "react-plotly.js";

const KDEChart = ({ data, groups, candidate, candidateList}) => {
  const [selectedGroup, setSelectedGroup] = useState(data[0]?.groups[0]); // Default to the first group of the first candidate
  

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div>
      <h1>KDE Chart</h1>
      <div>
        {/* Render buttons for each group */}
        {
        data[0]?.groups.map((group, index) => {
          return <button
            key={groups[index]}
            onClick={() => handleGroupSelection(group)}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: selectedGroup?.group === group.group ? "blue" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {groups[index]}
          </button>
          })}
      </div>

      {/* Plot only the selected group's data */}
      {selectedGroup && (
        <Plot
          data={[
            {
              x: (selectedGroup.x_vals).map((value) => {
                if(candidate === "1"  ) return (1-value);
                else return value;
              }),
              y: selectedGroup.y_vals,
              type: "scatter",
              mode: "lines",
              name: selectedGroup.group,
            },
          ]}
          layout={{
            title: `KDE of ${groups[Number((selectedGroup.group).split(' ')[1])-1] + " Pop."}`,
            xaxis: { title: "Support for " + candidateList[candidate] },
            yaxis: { title: "Density" },
            template: "plotly_white",
          }}
        />
      )}
    </div>
  );
};

export default KDEChart;
