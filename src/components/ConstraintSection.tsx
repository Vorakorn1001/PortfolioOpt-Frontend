import React from 'react';
import { Limit } from '@/interfaces/limit.interface';

interface ConstraintSectionProps {
  selectedMetric: string;
  setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  limits: Limit;
}

const ConstraintSection: React.FC<ConstraintSectionProps> = ({
  selectedMetric,
  setSelectedMetric,
  sliderValue,
  setSliderValue,
  limits,
}) => {
  const { minReturn, maxReturn, minVolatility, maxVolatility } = limits;
  const min = selectedMetric === 'return' ? minReturn : minVolatility;
  const max = selectedMetric === 'return' ? maxReturn : maxVolatility;

  const handleChange = (select: string) => {
    setSelectedMetric(select);
    setSliderValue(
      select === 'return' ? limits.minReturn : limits.minVolatility
    );
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Constraints</h2>
      <div className="flex items-center gap-4">
        <div>
          <label className="block mb-2">
            <input
              type="radio"
              name="metric"
              value="return"
              checked={selectedMetric === 'return'}
              onChange={() => handleChange('return')}
            />
            Expected Return
          </label>
          <label className="block">
            <input
              type="radio"
              name="metric"
              value="volatility"
              checked={selectedMetric === 'volatility'}
              onChange={() => handleChange('volatility')}
            />
            Volatility
          </label>
        </div>
        <div className="flex-1">
          <input
            type="range"
            min={min}
            max={max}
            className="w-full"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
          />
          <p className="text-center mt-2">Adjust level: {sliderValue}%</p>
        </div>
      </div>
    </section>
  );
};

export default ConstraintSection;
