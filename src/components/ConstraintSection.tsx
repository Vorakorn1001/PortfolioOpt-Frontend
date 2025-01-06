import React from 'react';

interface ConstraintSectionProps {
  selectedMetric: string;
  setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  handleOptimize: () => void;
}

const ConstraintSection: React.FC<ConstraintSectionProps> = ({
  selectedMetric,
  setSelectedMetric,
  sliderValue,
  setSliderValue,
  handleOptimize,
}) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Restraint</h2>
      <div className="flex items-center gap-4">
        <div>
          <label className="block mb-2">
            <input
              type="radio"
              name="metric"
              value="return"
              checked={selectedMetric === 'return'}
              onChange={() => setSelectedMetric('return')}
            />
            Expected Return
          </label>
          <label className="block">
            <input
              type="radio"
              name="metric"
              value="volatility"
              checked={selectedMetric === 'volatility'}
              onChange={() => setSelectedMetric('volatility')}
            />
            Volatility
          </label>
        </div>
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            className="w-full"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
          />
          <p className="text-center mt-2">Adjust level: {sliderValue}%</p>
        </div>
      </div>
      <button
        className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
        onClick={handleOptimize}
      >
        Optimize
      </button>
    </section>
  );
};

export default ConstraintSection;
