import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

interface CorrelationMatrixSectionProps {
    correlationMatrix: number[][];
    stocksOrder: string[];
}

const CorrelationMatrixSection: React.FC<CorrelationMatrixSectionProps> = ({
    correlationMatrix,
    stocksOrder,
}) => {
    const isDataAvailable =
        correlationMatrix.length > 0 && stocksOrder.length > 0;

    const lowestColor = '#ffffff';
    // const highestColor = '#f0f0f0';
    const highestColor = '#d3d3d3';

    const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        const hex = (x: number) => {
            const hexValue = x.toString(16);
            return hexValue.length === 1 ? '0' + hexValue : hexValue;
        };
        return `#${hex(r)}${hex(g)}${hex(b)}`;
    };

    const getColor = (value: number) => {
        const ratio = (value + 1) / 2; // Normalize value to range [0, 1]
        const [r1, g1, b1] = hexToRgb(lowestColor);
        const [r2, g2, b2] = hexToRgb(highestColor);

        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

        return rgbToHex(r, g, b);
    };

    return (
        <section>
            <div className="p-2 bg-white rounded-2xl">
                <div className="bg-white rounded-2xl overflow-hidden p-4">
                    <section className="mb-8">
                        <h1 className="text-xl font-bold mb-4">
                            Correlation Matrix
                        </h1>
                        <div className="my-6" />

                        <div className="overflow-auto">
                            {isDataAvailable ? (
                                <table className="w-full bg-white rounded-lg text-center">
                                    <thead>
                                        <tr className="bg-white">
                                            <th className="px-4 py-2 border-none"></th>
                                            {stocksOrder.map(
                                                (
                                                    symbol: string,
                                                    index: number
                                                ) => (
                                                    <th
                                                        key={index}
                                                        className="px-4 py-2 border-none"
                                                    >
                                                        {symbol}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {correlationMatrix.map(
                                            (
                                                row: number[],
                                                rowIndex: number
                                            ) => (
                                                <tr key={rowIndex}>
                                                    <td className="px-4 py-2 font-bold">
                                                        {stocksOrder[rowIndex]}
                                                    </td>
                                                    {row.map(
                                                        (
                                                            value: number,
                                                            colIndex: number
                                                        ) => (
                                                            <td
                                                                key={colIndex}
                                                                className="px-4 py-2"
                                                                style={{
                                                                    backgroundColor:
                                                                        getColor(
                                                                            value
                                                                        ),
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                <strong>
                                                                    {value.toFixed(
                                                                        2
                                                                    )}
                                                                </strong>
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div
                                    className="bg-gray-300 rounded-lg"
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                    }}
                                ></div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default CorrelationMatrixSection;
