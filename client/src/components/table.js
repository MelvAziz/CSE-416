import React from 'react';
import Plot from 'react-plotly.js';

const TableComponent = () => {
    // Example data
    const headerValues = ["Ensemble", "District Plans", "Equality Threshold"];
    const rowValues = [
        ["1", "2", "3"],
        [3000, 4000, 5000],
        ["0.5%", "0.45%", "0.4%"]
    ];

    return (
        <div>
            <Plot
                data={[
                    {
                        type: 'table',
                        header: {
                            values: headerValues,
                            align: "center",
                            line: { width: 1, color: 'black' },
                            fill: { color: 'gray' },
                            font: { family: "Arial", size: 12, color: "white" }
                        },
                        cells: {
                            values: rowValues,
                            align: "center",
                            line: { color: "black", width: 1 },
                            fill: { color: ['lightblue', 'white'] },
                            font: { family: "Arial", size: 11, color: ["black"] }
                        }
                    }
                ]}
                layout={{ title: 'Ensemble Plans' }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default TableComponent;