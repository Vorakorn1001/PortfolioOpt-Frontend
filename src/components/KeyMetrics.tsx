import React from 'react';

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

    return (
        <div className="p-2 bg-white rounded-2xl">
            <div className="bg-white rounded-2xl overflow-hidden p-4">
                <h1 className="text-xl font-bold mb-4">Portfolio Metrics</h1>
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
                                <h3 className="text-sm font-semibold">
                                    {metric.label}
                                </h3>
                                <p
                                    className={`text-lg font-bold ${colorClass}`}
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
