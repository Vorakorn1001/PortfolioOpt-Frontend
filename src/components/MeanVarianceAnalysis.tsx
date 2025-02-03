import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { useMediaQuery } from '@/utils/helper';
import { Chart, ChartEvent, ActiveElement } from 'chart.js';

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
                pointRadius: 15,
                hoverRadius: 13,
            },
        ],
    };

    const handlePointClick = (event: ChartEvent) => {
        console.log(event);

        const chart = event.native?.target as HTMLCanvasElement;
        if (!chart) return;

        const chartInstance = Chart.getChart(chart); // Get the Chart.js instance
        if (!chartInstance) return;

        const elements: ActiveElement[] =
            chartInstance.getElementsAtEventForMode(
                event as unknown as MouseEvent, // Cast to MouseEvent for compatibility
                'nearest',
                { intersect: true },
                false
            );

        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedData = data[index];
            setWeight(selectedData.weight);
        }
    };

    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <section>
            <div
                className="flex-1 p-2 bg-white rounded-2xl"
                // If you want the main container to dynamically change height:
                style={{ height: isMobile ? 'auto' : '550px' }}
            >
                <div className="bg-white rounded-2xl overflow-hidden p-4 h-full">
                    <h1 className="text-xl font-bold mb-4">
                        Mean-Variance Graph
                    </h1>
                    <div className="py-3" />
                    <div
                        className="flex justify-center items-center h-full"
                        // Conditionally change the chart area height:
                        style={{ height: isMobile ? '280px' : '400px' }}
                    >
                        <Scatter
                            data={chartData}
                            options={{
                                onClick: handlePointClick,
                                responsive: true,
                                maintainAspectRatio: false,
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
                </div>
            </div>
        </section>
    );
};

export default MeanVarianceAnalysis;
