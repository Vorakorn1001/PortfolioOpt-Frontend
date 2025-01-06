import React from 'react';
import {
  Chart,
  ChartOptions,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
  CategoryScale,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

// Register required components with Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeSeriesScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const HistoricalPerformance = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Portfolio Performance',
        data: [100, 110, 105, 115, 120, 118, 125],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'category', // Replace with appropriate type
        title: { display: true, text: 'X Axis' },
      },
      y: {
        type: 'linear', // Replace with appropriate type
        title: { display: true, text: 'Y Axis' },
      },
    },
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold mb-4">
        Historical Performance Vs Market
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default HistoricalPerformance;
