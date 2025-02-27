import React, { useState, useRef } from 'react';
import { useMediaQuery } from '@/utils/helper';
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

const sectors = [
    'Finance',
    'Consumer Discretionary',
    'Health Care',
    'Basic Materials',
    'Technology',
    'Real Estate',
    'Energy',
    'Industrials',
    'Utilities',
    'Consumer Staples',
    'Miscellaneous',
    'Telecommunications',
];

const marketCapOptions = [
    { label: 'Mega', description: '> $200B' },
    { label: 'Large', description: '$10B - $200B' },
    { label: 'Medium', description: '$2B - $10B' },
    { label: 'Small', description: '$300M - $2B' },
    { label: 'Micro', description: '$50M - $300M' },
    { label: 'Nano', description: '< $50M' },
];

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
    setRadarData: React.Dispatch<
        React.SetStateAction<{
            labels: string[];
            datasets: {
                label: string;
                data: number[];
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
            }[];
        }>
    >;
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
}) => {
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
            legend: {
                display: false, // Hide the legend
            },
        },
        animation: false as const, // Disable animations
    };

    const chartRef = useRef<Chart<'radar'>>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);

    const isMobile = useMediaQuery('(max-width: 767px)');

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIndustrialField((prevFields) =>
            prevFields.includes(value)
                ? prevFields.filter((field) => field !== value)
                : [...prevFields, value]
        );
    };

    const handleMarketCapChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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

    // Handle dragging the radar chart points
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

    const handleMouseUp = () => {
        setDragging(false);
        setDraggedPointIndex(null);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragging || draggedPointIndex === null) return;
    
        const chart = chartRef.current;
        if (!chart) return;
    
        // Get the chart area boundaries and the current mouse position
        const { top, bottom, left, right } = chart.chartArea;
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;
    
        // If the mouse is outside the chart area, stop dragging immediately
        if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
            console.log("OUT")
            setDragging(false);
            setDraggedPointIndex(null);
            return;
        }
    
        // Continue with your existing logic to update the dragged point...
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - centerX, 2) +
            Math.pow(mouseY - centerY, 2)
        );
        const maxDistance = Math.min(centerX - left, centerY - top);
    
        // Adjust sensitivity by requiring a minimum threshold distance for a step change
        const sensitivity = 0.3;
        const scaledValue = (distanceFromCenter / maxDistance) * 5; // Adjusted for 5 steps
        const stepThreshold = 1 * sensitivity; // Distance required for each step
        const newValue = Math.round(scaledValue / stepThreshold) * stepThreshold;
    
        // Clamp the value to ensure it stays within bounds
        const maxPoints = 5;
        const clampedValue = Math.max(1, Math.min(maxPoints, Math.round(newValue)));
    
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

    const handleMouseLeave = () => {        
        setDragging(false);
        setDraggedPointIndex(null);
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [marketCapDropdownOpen, setMarketCapDropdownOpen] = useState(false);

    const radarSizeScale = 85; // Adjust the radar chart size (Percentage of the container width)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        if (marketCapDropdownOpen) {
            setMarketCapDropdownOpen(false);
        }
    };

    const toggleMarketCapDropdown = () => {
        setMarketCapDropdownOpen(!marketCapDropdownOpen);
        if (dropdownOpen) {
            setDropdownOpen(false);
        }
    };

    return (
        <div className="p-2 bg-white rounded-2xl flex flex-col sm:flex-row">
            <div
                className="bg-white rounded-2xl overflow-hidden p-4 flex-1"
                style={{ marginRight: '10px' }}
            >
                <h1 className="text-xl font-bold mb-4">Filter</h1>
                {/* Filter Section */}
                <div style={{ marginBottom: '20px' }}></div>
                <label
                    htmlFor="sectorField"
                    style={{
                        display: 'block',
                        fontWeight: 'bold',
                        marginLeft: '25px',
                        marginBottom: '10px', // Added padding
                    }}
                >
                    Sector Field
                </label>
                <div
                    id="sectorField"
                    style={{
                        width: '80%',
                        padding: '8px',
                        marginTop: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        position: 'relative',
                        marginLeft: '25px',
                        marginBottom: '20px', // Added padding
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
                                flexDirection: 'column',
                                padding: '10px',
                            }}
                        >
                            {sectors.map((field) => (
                                <label
                                    key={field}
                                    style={{
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        value={field}
                                        checked={industrialField.includes(
                                            field
                                        )}
                                        onChange={handleFieldChange}
                                        style={{ marginRight: '10px' }}
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
                        style={{
                            display: 'block',
                            fontWeight: 'bold',
                            marginLeft: '25px',
                            marginBottom: '10px',
                        }}
                    >
                        Market Cap. Field
                    </label>
                    <div
                        id="marketCap"
                        style={{
                            width: '80%',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            position: 'relative',
                            marginLeft: '25px',
                            marginBottom: '20px',
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
                            Select Market Cap.
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
                                    maxHeight: '120px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '10px',
                                }}
                            >
                                {marketCapOptions.map((cap) => (
                                    <label
                                        key={cap.label}
                                        style={{
                                            marginBottom: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            value={cap.label}
                                            checked={marketCap.includes(
                                                cap.label
                                            )}
                                            onChange={handleMarketCapChange}
                                            style={{ marginRight: '10px' }}
                                        />
                                        {cap.label} ({cap.description})
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="keyword"
                        style={{
                            display: 'block',
                            fontWeight: 'bold',
                            marginLeft: '25px',
                            marginBottom: '10px', // Added padding
                        }}
                    >
                        Keyword Search
                    </label>
                    <input
                        suppressHydrationWarning
                        id="keyword"
                        type="text"
                        value={keyword}
                        onChange={handleKeywordChange}
                        placeholder="Search..."
                        style={{
                            width: '80%',
                            height: '50px',
                            padding: '8px',
                            marginTop: '5px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginLeft: '25px',
                            marginBottom: '20px', // Added padding
                        }}
                    />
                </div>
            </div>

            {/* Radar Chart Section */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%', // Ensure it takes full width
                    height: '100%', // Expand to available height
                }}
            >
                {!isMobile && (
                    <div
                        style={{
                            width: `${radarSizeScale}%`, // Use radarSizeScale for width
                            maxWidth: '600px', // Increase max width
                            height: '400px', // Set a larger fixed height
                        }}
                    >
                        <Radar
                            ref={chartRef}
                            data={radarData}
                            options={{
                                ...radarOptions,
                                maintainAspectRatio: false, // Allow resizing
                                responsive: true,
                                elements: {
                                    point: {
                                        radius: 30,
                                        hoverRadius: 27,
                                    },
                                },
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        />
                    </div>
                )}
                {
                    isMobile && (
                        <div style={{ height: '20px' }}/>
                    )
                }
                <div style={{ height: '20px' }}></div>
                <button
                    onClick={() => {
                        if (
                            industrialField.length > 0 ||
                            marketCap.length > 0 ||
                            keyword !== '' ||
                            radarData.datasets[0].data.some(
                                (value) => value !== 3
                            )
                        ) {
                            setIndustrialField([]);
                            setMarketCap([]);
                            setKeyword('');
                            setRadarData({
                                ...radarData,
                                datasets: [
                                    {
                                        ...radarData.datasets[0],
                                        data: [3, 3, 3, 3, 3],
                                    },
                                ],
                            });
                        }
                    }}
                    className={
                        'bg-black text-white border-white hover:bg-gray-800 rounded-full'
                    }
                    style={{
                        width: '30%',
                        padding: '10px',
                        marginTop: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                    }}
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default FilterSection;
