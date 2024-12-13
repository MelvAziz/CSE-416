import React, { useState } from "react";
import Plot from "react-plotly.js";

const KDEChart = ({ data }) => {
  const [selectedGroup, setSelectedGroup] = useState(data[0]?.groups[0]); // Default to the first group of the first candidate

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div>
      <h1>KDE Chart</h1>
      <div>
        {/* Render buttons for each group */}
        {data[0]?.groups.map((group) => (
          <button
            key={group.group}
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
            {group.group}
          </button>
        ))}
      </div>

      {/* Plot only the selected group's data */}
      {selectedGroup && (
        <Plot
          data={[
            {
              x: selectedGroup.x_vals,
              y: selectedGroup.y_vals,
              type: "scatter",
              mode: "lines",
              name: selectedGroup.group,
            },
          ]}
          layout={{
            title: `KDE of ${selectedGroup.group}`,
            xaxis: { title: "Support" },
            yaxis: { title: "Density" },
            template: "plotly_white",
          }}
        />
      )}
    </div>
  );
};

export default KDEChart;
