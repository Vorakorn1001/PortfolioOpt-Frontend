import React from 'react';
import AddRemoveButton from './AddRemoveButton';
import { StockData } from '@/interfaces/stock.interface';

type AssetsSectionProps = {
  portfolio: StockData[];
  showImpliedEqReturn?: boolean; // Optional prop to toggle column visibility
  handlePortfolioChange: (updatedPortfolio: StockData[]) => void; // Prop for handling portfolio changes
};

const AssetsSection: React.FC<AssetsSectionProps> = ({ portfolio, showImpliedEqReturn = false, handlePortfolioChange }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Assets</h2>
      {portfolio.length === 0 ? (
        <p>No stocks in your portfolio yet.</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">Symbol</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">5Y Annual Return</th>
              <th className="px-4 py-2 border-b">3Y Annual Return</th>
              <th className="px-4 py-2 border-b">1Y Annual Return</th>
              <th className="px-4 py-2 border-b">YTD Return</th>
              <th className="px-4 py-2 border-b">Sector</th>
              <th className="px-4 py-2 border-b">Industry</th>
              <th className="px-4 py-2 border-b">Market Cap</th>
              {showImpliedEqReturn && (
                <th className="px-4 py-2 border-b">Implied Eq Return</th>
              )}
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item.symbol}</td>
                <td className="px-4 py-2 border-b">{item.price}</td>
                <td className="px-4 py-2 border-b">{item.annual5YrsReturn}</td>
                <td className="px-4 py-2 border-b">{item.annual3YrsReturn}</td>
                <td className="px-4 py-2 border-b">{item.annual1YrReturn}</td>
                <td className="px-4 py-2 border-b">{item.ytdReturn ?? 'N/A'}</td>
                <td className="px-4 py-2 border-b">{item.sector}</td>
                <td className="px-4 py-2 border-b">{item.industry}</td>
                <td className="px-4 py-2 border-b">{item.marketCap}</td>
                {showImpliedEqReturn && (
                  <td className="px-4 py-2 border-b">{item.impliedEqReturn}</td>
                )}
                <td className="px-4 py-2 border-b">
                  <AddRemoveButton
                    stock={item}
                    onChange={(updatedPortfolio) => handlePortfolioChange(updatedPortfolio)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AssetsSection;