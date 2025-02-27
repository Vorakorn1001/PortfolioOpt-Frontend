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
import { useMediaQuery } from '@/utils/helper';

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
    selectedTimeframe: '5y' | '3y' | '1y' | '6m' | 'ytd'; // Selected timeframe
    handleTimeFrameChange: (
        timeframe: '5y' | '3y' | '1y' | '6m' | 'ytd'
    ) => void;
}

const HistoricalPerformance: React.FC<HistoricalPerformanceProps> = ({
    portfolioVsMarket,
    selectedTimeframe,
    handleTimeFrameChange,
}) => {
    const isMobile = useMediaQuery('(max-width: 767px)');

    const { days, portfolio, market } = portfolioVsMarket;

    // Sampling function to limit the number of data points
    const sampleData = (data: number[], labels: string[], limit: number) => {
        const step = Math.floor(data.length / limit);
        return {
            sampledData: data.filter((_, index) => index % step === 0),
            sampledLabels: labels.filter((_, index) => index % step === 0),
        };
    };

    const maxsamplingLimit = isMobile ? 50 : 100;
    const samplingLimit =
        maxsamplingLimit > days.length ? days.length : maxsamplingLimit;

    const { sampledData: sampledPortfolio, sampledLabels: sampledDays } =
        sampleData(portfolio, days, samplingLimit);
    const { sampledData: sampledMarket } = sampleData(
        market,
        days,
        samplingLimit
    );

    const chartData = {
        labels: sampledDays,
        datasets: [
            {
                label: 'Portfolio Performance',
                data: sampledPortfolio,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1, // Smooth line
            },
            {
                label: 'S&P 500',
                data: sampledMarket,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1, // Smooth line
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false, // allow chart to resize to container height
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
                    callback: (value) => {
                        return Number(value).toFixed(2) + '%';
                    },
                },
            },
        },
    };

    return (
        <div className="p-2 bg-white rounded-2xl">
            <div className="bg-white rounded-2xl p-4">
                <h1 className="text-xl font-bold mb-4">
                    Historical Performance Vs S&P 500
                </h1>

                <div>
                    {(['5y', '3y', '1y', '6m', 'ytd'] as const).map(
                        (timeframe) => (
                            <button
                                key={timeframe}
                                className={`px-4 py-2 border rounded-2xl ml-2 font-bold ${
                                    timeframe === selectedTimeframe
                                        ? 'bg-white text-black border-black hover:bg-gray-200'
                                        : 'bg-black text-white border-white hover:bg-gray-800'
                                }`}
                                onClick={() => handleTimeFrameChange(timeframe)}
                            >
                                {timeframe.toUpperCase()}
                            </button>
                        )
                    )}
                </div>

                {/* Set a fixed or min height so the chart is bigger by default */}
                <div className="w-full h-96">
                    <Line
                        data={chartData}
                        options={{
                            ...options,
                            responsive: true,
                            maintainAspectRatio: false, // allows the chart to fill the container height
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistoricalPerformance;
