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
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// Register required components with Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface PortfolioVsMarket {
  days: string[]; // Array of dates in 'YYYY-MM-DD' format
  portfolio: number[]; // Portfolio returns
  market: number[]; // Market returns
}

interface HistoricalPerformanceProps {
  portfolioVsMarket: PortfolioVsMarket; // Prop containing data
}

const HistoricalPerformance: React.FC<HistoricalPerformanceProps> = ({
  portfolioVsMarket,
}) => {
  const { days, portfolio, market } = portfolioVsMarket;

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Portfolio Performance',
        data: portfolio,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1, // Smooth line
      },
      {
        label: 'Market Performance',
        data: market,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1, // Smooth line
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
        type: 'time',
        title: { display: true, text: 'Date' },
        time: {
          unit: 'month',
          displayFormats: { month: 'MMM yyyy' },
        },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Performance (%)' },
        ticks: {
          callback: (value) => `${value}%`,
        },
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
