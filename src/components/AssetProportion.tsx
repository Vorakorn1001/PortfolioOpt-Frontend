import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface AssetProportionProps {
    Labels: string[];
    Values: number[];
    cutout?: string | number;
}

const AssetProportion: React.FC<AssetProportionProps> = ({
    Labels,
    Values,
    cutout,
}) => {
    const [labels, setLabels] = useState<string[]>(['NVDA', 'TSLA', 'AAPL']);
    const [data, setData] = useState<number[]>([50, 25, 25]);

    useEffect(() => {
        if (Labels.length) {
            setLabels(Labels);
        }

        if (Values.length) {
            setData(Values.map((value) => value * 100));
        }
    }, [Labels, Values]);

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
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        const total = data.reduce(
                            (acc, value) => acc + value,
                            0
                        );
                        const currentValue = tooltipItem.raw;
                        const percentage = (
                            (currentValue / total) *
                            100
                        ).toFixed(2);
                        return `${tooltipItem.label}: ${percentage}%`;
                    },
                },
            },
        },
        cutout: cutout,
    };

    return (
        <div className="p-2 bg-white rounded-2xl" style={{ height: '550px' }}>
            <div className="bg-white rounded-2xl overflow-hidden p-4">
                <h1 className="text-xl font-bold mb-4">Asset Proportion</h1>
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AssetProportion;
