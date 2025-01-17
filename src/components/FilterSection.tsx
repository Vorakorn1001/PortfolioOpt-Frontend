import React, { useState, useRef } from "react";
import { Radar } from "react-chartjs-2";
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const FilterSection: React.FC = () => {
  const [industrialField, setIndustrialField] = useState<string>("All");
  const [keyword, setKeyword] = useState<string>("");
  const [radarData, setRadarData] = useState({
    labels: ["High Return", "Low Volatile", "Market Cap.", "Short-Term", "Long-Term"],
    datasets: [
      {
        label: "Portfolio Performance",
        data: [2, 1, 3, 1, 2], // Adjusted sample data for 5 steps
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  });

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5, // Changed max value to 5
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    animation: false as false, // Disable animations
    onHover: (event: any, chartElement: any) => {
      event.native.target.style.cursor = chartElement[0] ? "pointer" : "default";
    },
  };

  const chartRef = useRef<any>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustrialField(event.target.value);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, false);
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
    const sensitivity = 1; // Higher value makes it less sensitive (e.g., 0.7 = 70% of a step)
    const scaledValue = (distanceFromCenter / maxDistance) * 5; // Adjusted for 5 steps
    const stepThreshold = 1 * sensitivity; // Distance required for each step
    const newValue = Math.round(scaledValue / stepThreshold) * stepThreshold;
  
    // Clamp the value to ensure it stays within bounds
    const clampedValue = Math.max(0, Math.min(5, Math.round(newValue))); // Adjusted for 5 steps
  
    // Update the data for the dragged point
    const newData = radarData.datasets[0].data.map((value, index) => {
      if (index === draggedPointIndex) {
        return clampedValue;
      }
      return value;
    });
  
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

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
      {/* Filter Section */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2>Filter</h2>
        <div style={{ marginBottom: "20px" }}></div>
          <label htmlFor="industrialField" style={{ display: "block", fontWeight: "bold" }}>
            Industrial Field
          </label>
          <select
            id="industrialField"
            value={industrialField}
            onChange={handleFieldChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="All">All</option>
            <option value="Finance">Finance</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            {/* Add more fields as needed */}
          </select>
        <div>
          <label htmlFor="keyword" style={{ display: "block", fontWeight: "bold" }}>
            Keyword Search
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* Radar Chart Section */}
      <div style={{ flex: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
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
  );
};

export default FilterSection;