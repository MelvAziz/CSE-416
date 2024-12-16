import React from 'react';
import Plot from 'react-plotly.js';
import { log } from 'mathjs'; // Math.js for exponential calculations

const GinglesGraph = ({ plotData, layout, onClick }) => {

    // Perform logarithmic regression to find coefficients a and b
  const lnX = plotData[0].xData.map(x => Math.log(x)); // Take log of x
  const n = plotData[0].xData.length;
  const meanLnX = lnX.reduce((a, b) => a + b) / n;
  const meanY = plotData[0].yDataDemocrat.reduce((a, b) => a + b) / n;

  let numerator = 0, denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (lnX[i] - meanLnX) * (plotData[0].yDataDemocrat[i] - meanY);
    denominator += (lnX[i] - meanLnX) ** 2;
  }
  const b = numerator / denominator; // Slope
  const a = meanY - b * meanLnX; // Intercept

  // Generate regression line points
  const xLine = Array.from({ length: 100 }, (_, i) => i / 10 + 0.1); // Dense x points
  const yLine = xLine.map(x => a + b * Math.log(x));

  // Add logistic regression lines to plotData
  const enhancedPlotData = [
    ...plotData,
    {
      x: xLine,
      y: yLine,
      mode: 'lines',
      type: 'scatter',
      name: 'Democratic Regression',
      line: { color: "#0061ff" }
    },
  ];

  // Render Plotly chart
  return (
    <Plot
      data={enhancedPlotData}
      layout={layout}
    />
  );
};

export default GinglesGraph;
