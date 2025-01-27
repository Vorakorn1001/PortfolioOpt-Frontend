import React from 'react';
import AddRemoveStock from './AddRemoveStock'; // Assuming you have this component
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import StockData from '@/interfaces/stock.interface';

interface AssetsSectionProps {
    portfolio: StockData[];
    excludeFields?: string[];
    handlePortfolioChange: (updatedPortfolio: StockData[]) => void;
}

const AssetsSection: React.FC<AssetsSectionProps> = ({
    portfolio,
    excludeFields = [],
    handlePortfolioChange,
}) => {
    const fields = [
        'symbol',
        'name',
        'price',
        'annualReturn',
        'annual5YrsReturn',
        'annual3YrsReturn',
        'annual1YrReturn',
        'ytdReturn',
        'momentum',
        'beta',
        'volatility',
        'sector',
        'industry',
        'marketCap',
        'priorReturn',
        'posteriorReturn',
    ];

    const percentageFields = [
        'annual5YrsReturn',
        'annual3YrsReturn',
        'annual1YrReturn',
        'priorReturn',
        'posteriorReturn',
        'ytdReturn',
        'volatility',
        'momentum',
    ];

    const renderField = (item: StockData, field: string) => {
        if (field === 'annualReturn') {
            return '';
        }

        if (field === 'priorReturn' || field === 'posteriorReturn') {
            const value = item[field as keyof StockData];
            return value === null || value === undefined ? (
                <Skeleton width={50} height={20} />
            ) : (
                value
            );
        }

        const value = item[field as keyof StockData];
        if (
            value === null ||
            value === undefined ||
            (typeof value === 'number' && isNaN(value))
        ) {
            return 'NaN';
        }
        return value;
    };

    return (
        <section>
            <div className="p-2 bg-white rounded-2xl">
                <div className="bg-white rounded-2xl overflow-hidden p-4">
                    <h1 className="text-xl font-bold mb-4">Stocks</h1>
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-white text-left">
                                {fields.map((field) => {
                                    if (excludeFields.includes(field))
                                        return null;
                                    const displayName =
                                        {
                                            annual5YrsReturn: '5y',
                                            annual3YrsReturn: '3y',
                                            annual1YrReturn: '1y',
                                            annualReturn: 'Ann. Return',
                                        }[field] || field;
                                    return (
                                        <th
                                            key={field}
                                            className="px-1 py-1 text-left font-normal text-xs text-gray-500"
                                        >
                                            {displayName
                                                .charAt(0)
                                                .toUpperCase() +
                                                displayName.slice(1)}
                                        </th>
                                    );
                                })}
                                <th className="px-1 py-1 text-left font-normal text-xs text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    className="hover:bg-gray-50"
                                >
                                    {fields.map((field) => {
                                        if (excludeFields.includes(field))
                                            return null;
                                        const value =
                                            item[field as keyof StockData];
                                        const isPercentageField =
                                            percentageFields.includes(field);
                                        const displayValue =
                                            value === null
                                                ? 'N/A'
                                                : isPercentageField
                                                  ? `${((value as number) * 100).toFixed(1)}%`
                                                  : typeof value === 'number'
                                                    ? value.toFixed(1)
                                                    : renderField(item, field);
                                        const textColor =
                                            field === 'volatility'
                                                ? 'text-black'
                                                : typeof value === 'number' &&
                                                    value > 0
                                                  ? 'text-green-500'
                                                  : typeof value === 'number' &&
                                                      value < 0
                                                    ? 'text-red-500'
                                                    : 'text-black';
                                        return (
                                            <td
                                                key={`${item.id || rowIndex}-${field}`}
                                                className={`px-1 py-1 text-left ${textColor}`}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                    <td className="px-1 py-1 text-left">
                                        <AddRemoveStock
                                            stock={item}
                                            onChange={handlePortfolioChange}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AssetsSection;
