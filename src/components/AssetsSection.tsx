import React from 'react';
import AddRemoveStock from './AddRemoveStock'; // Assuming you have this component
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import { StockData } from '@/interfaces/stock.interface';

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
    'price',
    'annualReturn', // New column
    'annual5YrsReturn',
    'annual3YrsReturn',
    'annual1YrReturn',
    'ytdReturn',
    'sector',
    'industry',
    'marketCap',
    'priorReturn',
    'posteriorReturn',
  ];

  const renderField = (item: StockData, field: string) => {
    if (field === 'annualReturn') {
      return ''; // Leave the new "Annual Return" column blank
    }

    if (field === 'priorReturn' || field === 'posteriorReturn') {
      const value = item[field as keyof StockData];
      return value === null || value === undefined ? (
        <Skeleton width={50} height={20} /> // Skeleton loader
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
    <div className="p-4">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            {fields.map((field) => {
              if (excludeFields.includes(field)) return null;

              // Rename specific fields in the header
              const displayName =
                {
                  annual5YrsReturn: '5y',
                  annual3YrsReturn: '3y',
                  annual1YrReturn: '1y',
                  annualReturn: 'Ann. Return',
                }[field] || field;

              const capitalizedDisplayName =
                displayName.charAt(0).toUpperCase() + displayName.slice(1);

              return (
                <th key={field} className="px-2 py-1 border-b text-center">
                  {capitalizedDisplayName}
                </th>
              );
            })}
            <th className="px-2 py-1 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              {fields.map((field) => {
                if (excludeFields.includes(field)) return null;

                return (
                  <td key={field} className="px-2 py-1 border-b text-center">
                    {renderField(item, field)}
                  </td>
                );
              })}
              <td className="px-2 py-1 border-b text-center">
                <AddRemoveStock stock={item} onChange={handlePortfolioChange} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsSection;
