import React from 'react';
import { useMediaQuery } from '@/utils/helper';

interface Metric {
    label: string;
    value: string;
}

interface KeyMetricsProps {
    metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
    { label: 'Metric 1', value: 'Value 1' },
    { label: 'Metric 2', value: 'Value 2' },
    { label: 'Metric 3', value: 'Value 3' },
    { label: 'Metric 4', value: 'Value 4' },
    { label: 'Metric 5', value: 'Value 5' },
    { label: 'Metric 6', value: 'Value 6' },
];

const percentageLabels = [
    'Return',
    'Volatility',
    'Value at Risk (95.0%)',
    'Expected Shortfall (95.0%)',
];

const colorLabels = [
    'Return',
    'Sharpe Ratio',
    'Value at Risk (95.0%)',
    'Expected Shortfall (95.0%)',
    'Beta',
];

const KeyMetrics: React.FC<KeyMetricsProps> = ({ metrics }) => {
    const validMetrics = Array.isArray(metrics) ? metrics : defaultMetrics;
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <div className="p-2 bg-white rounded-2xl">
            <div className="bg-white rounded-2xl overflow-hidden p-4">
                {/* 
                  Use `text-base` on mobile, `text-xl` on larger screens 
                */}
                <h1
                    className={`
                        mb-4 font-bold 
                        ${isMobile ? 'text-base' : 'text-xl'}
                    `}
                >
                    Portfolio Metrics
                </h1>
                <div className="grid grid-cols-6 gap-4">
                    {validMetrics.map((metric) => {
                        let value = metric.value;
                        let colorClass = 'text-black';

                        if (percentageLabels.includes(metric.label)) {
                            value += '%';
                        }

                        if (colorLabels.includes(metric.label)) {
                            const numericValue = parseFloat(metric.value);
                            if (!isNaN(numericValue)) {
                                colorClass =
                                    numericValue > 0
                                        ? 'text-green-500'
                                        : numericValue < 0
                                          ? 'text-red-500'
                                          : 'text-black';
                            }
                        }

                        return (
                            <div
                                key={metric.label}
                                className="text-center flex flex-col justify-between"
                            >
                                {/* 
                                  Smaller on mobile, normal on larger screens
                                */}
                                <h3
                                    className={`
                                        font-semibold 
                                        ${isMobile ? 'text-xs' : 'text-sm'}
                                    `}
                                >
                                    {metric.label}
                                </h3>
                                <p
                                    className={`
                                        font-bold ${colorClass} 
                                        ${isMobile ? 'text-sm' : 'text-lg'}
                                    `}
                                >
                                    {value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KeyMetrics;
