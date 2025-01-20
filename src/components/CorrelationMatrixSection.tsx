import React from 'react';
import Skeleton from 'react-loading-skeleton';
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

    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Correlation Matrix</h2>
            <div className="overflow-auto">
                {isDataAvailable ? (
                    <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg text-center">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border-b"></th>
                                {stocksOrder.map(
                                    (symbol: string, index: number) => (
                                        <th
                                            key={index}
                                            className="px-4 py-2 border-b"
                                        >
                                            {symbol}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {correlationMatrix.map(
                                (row: number[], rowIndex: number) => (
                                    <tr key={rowIndex}>
                                        <td className="px-4 py-2 border-b">
                                            {stocksOrder[rowIndex]}
                                        </td>
                                        {row.map(
                                            (
                                                value: number,
                                                colIndex: number
                                            ) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-2 border-b"
                                                >
                                                    {value.toFixed(2)}
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
                        className="bg-gray-300 rounded-lg shadow-md"
                        style={{
                            width: '100%',
                            height: '400px', // Adjust height as needed
                        }}
                    ></div>
                )}
            </div>
        </section>
    );
};

export default CorrelationMatrixSection;
