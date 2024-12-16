import React from 'react';
import Plot from 'react-plotly.js';
import { log, create, all, matrix } from 'mathjs'; // Math.js for exponential calculations
import * as regression from 'regression';

const GinglesGraph = ({ plotData, layout, max, onClick }) => {

    // Perform logarithmic regression to find coefficients a and b
  const DlnX = plotData[0].x.map(x => Math.log(x)); // Take log of x
  const Dn = plotData[0].x.length;
  const DmeanLnX = DlnX.reduce((a, b) => {
    if(b > 0) return a + b
    else return a;
  }, 0) / Dn;
  const DmeanY = plotData[0].y.reduce((a, b) => {
    if(b > 0) return a + b
    else return a;
  }) / Dn;


  let Dnumerator = 0, Ddenominator = 0;
  for (let i = 0; i < Dn; i++) {
    if(DlnX[i] > 0 && plotData[0].y[i] > 0){
      Dnumerator += (DlnX[i] - DmeanLnX) * (plotData[0].y[i] - DmeanY);
      Ddenominator += (DlnX[i] - DmeanLnX) ** 2;
    }
  }
  const Db = Dnumerator / Ddenominator; // Slope
  const Da = DmeanY - Db * DmeanLnX; // Intercept

  // Generate regression line points
  const DxLine = Array.from({ length: max }, (_, i) => i + 0.1); // Dense x points
  const DyLine = DxLine.map(x => Da + Db * Math.log(x));


  //Republican
  const RlnX = plotData[1].x.map(x => Math.log(x)); // Take log of x
  const Rn = plotData[1].x.length;
  const RmeanLnX = RlnX.reduce((a, b) => {
    if(b > 0) return a + b
    else return a;
  }, 0) / Rn;
  const RmeanY = plotData[1].y.reduce((a, b) => {
    if(b > 0) return a + b
    else return a;
  }) / Rn;


  let Rnumerator = 0, Rdenominator = 0;
  for (let i = 0; i < Rn; i++) {
    if(RlnX[i] > 0 && plotData[1].y[i] > 0){
      Rnumerator += (RlnX[i] - RmeanLnX) * (plotData[1].y[i] - RmeanY);
      Rdenominator += (RlnX[i] - RmeanLnX) ** 2;
    }
  }
  const Rb = Rnumerator / Rdenominator; // Slope
  const Ra = RmeanY - Rb * RmeanLnX; // Intercept

  // Generate regression line points
  const RxLine = Array.from({ length: max }, (_, i) => i + 0.1); // Dense x points
  // const RxLine = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // Dense x points
  const RyLine = RxLine.map(x => Ra + Rb * Math.log(x));



  // Add logistic regression lines to plotData
  const enhancedPlotData = [
    ...plotData,
    {
      x: DxLine,
      y: DyLine,
      mode: 'lines',
      type: 'scatter',
      name: 'Democratic Regression',
      line: { color: "#0061ff" }
    },
    {
      x: RxLine,
      y: RyLine,
      mode: 'lines',
      type: 'scatter',
      name: 'Republican Regression',
      line: { color: "red" }
    },
  ];

  // Render Plotly chart
  return (
    <Plot
      data={enhancedPlotData}
      layout={layout}
      onClick={onClick}
    />
  );
};

export default GinglesGraph;
