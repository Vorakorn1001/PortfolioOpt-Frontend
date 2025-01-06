import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AssetProportion = ({
  Labels = [],
  Values = [],
  cutout = '60%',
}: {
  Labels?: string[];
  Values?: number[];
  cutout?: string | number;
}) => {
  const [labels, setLabels] = useState<string[]>(
    Labels.length
      ? Labels
      : ['NVDA', 'TSLA', 'AAPL']
  );
  const [data, setData] = useState<number[]>(
    Values.length ? Values : [50, 25, 25]
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Asset Proportion',
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        hoverOffset: 4,
        cutout: cutout,
      },
    ],
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Asset Proportion</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default AssetProportion;
