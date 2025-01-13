import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';

interface PortfolioData {
  weight: number[];
  return: number;
  volatility: number;
  sharpeRatio: number;
}

interface MeanVarianceAnalysisProps {
  data: PortfolioData[];
  setWeight: (weights: number[]) => void;
}

const MeanVarianceAnalysis: React.FC<MeanVarianceAnalysisProps> = ({
  data,
  setWeight,
}) => {
  const chartData = {
    datasets: [
      {
        label: 'Mean-Variance',
        data: data.map((item) => ({
          x: item.volatility,
          y: item.return,
        })),
        pointBackgroundColor: [
          'rgba(199, 11, 11, 0.4)',
          'rgba(93, 141, 141, 0.4)',
          'rgba(125, 192, 192, 0.4)',
          'rgba(40, 17, 94, 0.4)',
          'rgba(212, 66, 29, 0.4)',
        ],
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        pointRadius: 10,
      },
    ],
  };

  const handlePointClick = (event: any) => {
    const chart = event.chart;
    const elements = chart.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );

    if (elements.length > 0) {
      const index = elements[0].index; // Get the clicked data point index
      const selectedData = data[index]; // Get the corresponding data
      console.log(selectedData);
      setWeight(selectedData.weight); // Set the selected weights
      // setSelectedWeights(selectedData.weight); // Set the selected weights
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold">Mean-Variance Analysis</h2>
      <Scatter
        data={chartData}
        options={{
          onClick: handlePointClick,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            colors: {
              enabled: true,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Volatility',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Return',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default MeanVarianceAnalysis;
