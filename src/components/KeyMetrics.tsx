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

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  metrics = defaultMetrics,
}) => {
  return (
    <div>
      <div className="grid grid-cols-6 gap-4 bg-white shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-4 col-span-6">Portfolio Metrics</h2>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="text-center flex flex-col justify-between"
          >
            <h3 className="text-sm font-semibold">{metric.label}</h3>
            <p className="text-lg font-bold">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;
