import React, { useState, useEffect, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface FilterSectionProps {
    industrialField: string[];
    setIndustrialField: React.Dispatch<React.SetStateAction<string[]>>;
    marketCap: string[];
    setMarketCap: React.Dispatch<React.SetStateAction<string[]>>;
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    radarData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    };
    setRadarData: React.Dispatch<React.SetStateAction<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    }>>;
    onApply: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    industrialField,
    setIndustrialField,
    marketCap,
    setMarketCap,
    keyword,
    setKeyword,
    radarData,
    setRadarData,
    onApply,
}) => {
    // useEffect(() => {
    //     console.log('Radar data updated:', radarData.datasets[0].data);
    // }, [radarData]);

    const radarOptions = {
        scales: {
            r: {
                beginAtZero: true,
                max: 5,
                pointLabels: {
                    display: true, // Show the point labels
                },
                ticks: {
                    display: false, // Hide the scale numbers
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
        },
        animation: false as false, // Disable animations
        onHover: (event: any, chartElement: any) => {
            event.native.target.style.cursor = chartElement[0]
                ? 'pointer'
                : 'default';
        },
    };

    const chartRef = useRef<any>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(
        null
    );
    const sectors = ['Finance', 'Technology', 'Healthcare']

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIndustrialField((prevFields) =>
            prevFields.includes(value)
                ? prevFields.filter((field) => field !== value)
                : [...prevFields, value]
        );
    };

    const handleMarketCapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMarketCap((prevCaps) =>
            prevCaps.includes(value)
                ? prevCaps.filter((cap) => cap !== value)
                : [...prevCaps, value]
        );
    };

    const handleKeywordChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setKeyword(event.target.value);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const chart = chartRef.current;
        if (!chart) return;

        const points = chart.getElementsAtEventForMode(
            event.nativeEvent,
            'nearest',
            { intersect: true },
            false
        );
        if (points.length) {
            setDragging(true);
            setDraggedPointIndex(points[0].index);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragging || draggedPointIndex === null) return;

        const chart = chartRef.current;
        if (!chart) return;

        const { top, bottom, left, right } = chart.chartArea;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const distanceFromCenter = Math.sqrt(
            Math.pow(event.nativeEvent.offsetX - centerX, 2) +
                Math.pow(event.nativeEvent.offsetY - centerY, 2)
        );
        const maxDistance = Math.min(centerX - left, centerY - top);

        // Adjust sensitivity by requiring a minimum threshold distance for a step change
        const sensitivity = 0.3; // Higher value makes it less sensitive (e.g., 0.7 = 70% of a step)
        const scaledValue = (distanceFromCenter / maxDistance) * 5; // Adjusted for 5 steps
        const stepThreshold = 1 * sensitivity; // Distance required for each step
        const newValue =
            Math.round(scaledValue / stepThreshold) * stepThreshold;

        // Clamp the value to ensure it stays within bounds
        const clampedValue = Math.max(0, Math.min(5, Math.round(newValue))); // Adjusted for 5 steps

        // Update the data for the dragged point
        const newData = radarData.datasets[0].data.map((value, index) => {
            if (index === draggedPointIndex) {
                return clampedValue;
            }
            return value;
        });

        const hasChanged = !newData.every(
            (value, index) => value === radarData.datasets[0].data[index]
        );
    
        if (!hasChanged) {
            return;
        }

        setRadarData({
            ...radarData,
            datasets: [
                {
                    ...radarData.datasets[0],
                    data: newData,
                },
            ],
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        setDraggedPointIndex(null);
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [marketCapDropdownOpen, setMarketCapDropdownOpen] = useState(false);

    const radarSizeScale = 60; // Adjust the radar chart size (Percentage of the container width)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMarketCapDropdown = () => {
        setMarketCapDropdownOpen(!marketCapDropdownOpen);
    };

    return (
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                }}
            >
                {/* Filter Section */}
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Filter</h1>
                    <div style={{ marginBottom: '20px' }}></div>
                    <label
                        htmlFor="sectorField"
                        style={{ display: 'block', fontWeight: 'bold' }}
                    >
                        Sector Field
                    </label>
                    <div
                        id="sectorField"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            position: 'relative',
                        }}
                    >
                        <button
                            onClick={toggleDropdown}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                        >
                            Select Sector Fields
                        </button>
                        {dropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    zIndex: 1,
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column', // Make it vertical
                                }}
                            >
                                {sectors.map((field) => (
                                    <label key={field} style={{ marginBottom: '8px' }}>
                                        <input
                                            type="checkbox"
                                            value={field}
                                            checked={industrialField.includes(field)}
                                            onChange={handleFieldChange}
                                        />
                                        {field}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="marketCap"
                            style={{ display: 'block', fontWeight: 'bold' }}
                        >
                            Market Cap
                        </label>
                        <div
                            id="marketCap"
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                position: 'relative',
                            }}
                        >
                            <button
                                onClick={toggleMarketCapDropdown}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                }}
                            >
                                Select Market Cap
                            </button>
                            {marketCapDropdownOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        zIndex: 1,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Mega"
                                            checked={marketCap.includes('Mega')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Mega ({'>'}$200B)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Large"
                                            checked={marketCap.includes('Large')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Large ($10B-$200B)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Medium"
                                            checked={marketCap.includes('Medium')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Medium ($2B-$10B)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Small"
                                            checked={marketCap.includes('Small')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Small ($300M-$2B)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Micro"
                                            checked={marketCap.includes('Micro')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Micro ($50M-$300M)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="Nano"
                                            checked={marketCap.includes('Nano')}
                                            onChange={handleMarketCapChange}
                                        />
                                        Nano (&lt;$50M)
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="keyword"
                            style={{ display: 'block', fontWeight: 'bold' }}
                        >
                            Keyword Search
                        </label>
                        <input
                            id="keyword"
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Search..."
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </div>

                {/* Radar Chart Section */}
                <div
                    style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ width: `${radarSizeScale}%`, maxWidth: '600px' }}>
                        <Radar
                            ref={chartRef}
                            data={radarData}
                            options={radarOptions}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
