import React from 'react';
import Limit from '@/interfaces/limit.interface';

interface ConstraintSectionProps {
    selectedMetric: string;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string>>;
    sliderValue: number;
    setSliderValue: React.Dispatch<React.SetStateAction<number>>;
    limits: Limit;
    handleOptimize: () => void;
}

const ConstraintSection: React.FC<ConstraintSectionProps> = ({
    selectedMetric,
    setSelectedMetric,
    sliderValue,
    setSliderValue,
    limits,
    handleOptimize,
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
            <div className="p-2 bg-white rounded-2xl">
                <div className="bg-white rounded-2xl overflow-hidden p-4">
                    <h1 className="text-xl font-bold mb-4">Constraints</h1>
                    <div className="my-6 flex flex-col items-center">
                        <div className="flex items-center gap-4 w-full max-w-4xl">
                            <div className="flex flex-col items-start">
                                <label className="block mb-2">
                                    <input
                                        type="radio"
                                        name="metric"
                                        value="return"
                                        checked={selectedMetric === 'return'}
                                        onChange={() => handleChange('return')}
                                        className="mr-2"
                                        style={{ accentColor: 'black' }}
                                    />
                                    Expected Return
                                </label>
                                <label className="block">
                                    <input
                                        type="radio"
                                        name="metric"
                                        value="volatility"
                                        checked={
                                            selectedMetric === 'volatility'
                                        }
                                        onChange={() =>
                                            handleChange('volatility')
                                        }
                                        className="mr-2"
                                        style={{ accentColor: 'black' }}
                                    />
                                    Volatility
                                </label>
                            </div>
                            <div className="flex-1 text-center w-full">
                                <>
                                    <input
                                        suppressHydrationWarning
                                        type="range"
                                        min={min}
                                        max={max}
                                        className="w-full custom-slider"
                                        value={sliderValue}
                                        onChange={(e) =>
                                            setSliderValue(
                                                Number(e.target.value)
                                            )
                                        }
                                        style={{
                                            // Calculate the fill percentage
                                            background: `linear-gradient(to right, black 0%, black ${
                                                ((sliderValue - min) /
                                                    (max - min)) *
                                                100
                                            }%, #ddd ${
                                                ((sliderValue - min) /
                                                    (max - min)) *
                                                100
                                            }%, #ddd 100%)`,
                                            accentColor: 'black', // For browsers that support it
                                        }}
                                    />
                                    <style jsx>{`
                                        /* Remove the native appearance on all browsers, including Safari */
                                        .custom-slider {
                                            -webkit-appearance: none;
                                            appearance: none;
                                        }
                                        /* Make the track transparent so that the input background shows through */
                                        .custom-slider::-webkit-slider-runnable-track {
                                            height: 4px;
                                            background: transparent;
                                            border-radius: 2px;
                                        }
                                        .custom-slider::-moz-range-track {
                                            height: 4px;
                                            background: transparent;
                                            border-radius: 2px;
                                        }
                                        .custom-slider::-ms-track {
                                            height: 4px;
                                            background: transparent;
                                            border-color: transparent;
                                            color: transparent;
                                        }
                                        /* Style the thumb as a centered black circle */
                                        .custom-slider::-webkit-slider-thumb {
                                            -webkit-appearance: none;
                                            height: 20px;
                                            width: 20px;
                                            border-radius: 50%;
                                            background: black;
                                            cursor: pointer;
                                            position: relative;
                                            top: 50%;
                                            transform: translateY(-50%);
                                        }
                                        .custom-slider::-moz-range-thumb {
                                            height: 20px;
                                            width: 20px;
                                            border-radius: 50%;
                                            background: black;
                                            cursor: pointer;
                                            position: relative;
                                            top: 50%;
                                            transform: translateY(-50%);
                                        }
                                        .custom-slider::-ms-thumb {
                                            height: 20px;
                                            width: 20px;
                                            border-radius: 50%;
                                            background: black;
                                            cursor: pointer;
                                            position: relative;
                                            top: 50%;
                                            transform: translateY(-50%);
                                        }
                                    `}</style>
                                </>

                                <p className="text-center mt-2">
                                    Adjust level: {sliderValue}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            className="bg-black text-white py-3 px-6 rounded-2xl hover:bg-gray-800 font-bold text-lg"
                            onClick={handleOptimize}
                        >
                            Optimize
                        </button>
                    </div>
                </div>
            </div>
            <div className="py-4"></div>
        </section>
    );
};

export default ConstraintSection;
