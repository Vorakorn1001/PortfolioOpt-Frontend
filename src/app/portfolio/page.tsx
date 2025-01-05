'use client';

import {
  homePageStockData,
  portfolioStockData,
} from '@/interfaces/stock.interface';
import { investorView } from '@/interfaces/view.interface';
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import axios from 'axios';

const Portfolio: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(7);
  const [selectedMetric, setSelectedMetric] = useState('return');
  const [portfolio, setPortfolio] = useState<portfolioStockData[]>([]);
  const [portfolioSymbols, setPortfolioSymbols] = useState<string[]>([]);
  const [investorViews, setInvestorViews] = useState<investorView[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newView, setNewView] = useState<investorView>({
    asset1: '',
    percentage: '',
    confident: '',
  });

  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [stocksOrder, setStocksOrder] = useState<string[]>([]);

  const prePortfolioUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/pre';
  const postPortfolioUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/post';

  useEffect(() => {
    const savedPortfolio = JSON.parse(
      localStorage.getItem('portfolio') || '[]'
    );
    const savedPortfolioSymbols = savedPortfolio.map(
      (item: { symbol: string }) => item.symbol
    );
    const savedInvestorViews = JSON.parse(
      localStorage.getItem('investorViews') || '[]'
    );

    setInvestorViews(savedInvestorViews);
    setPortfolioSymbols(savedPortfolioSymbols);

    //*** Handle if Investor Views hold the stock that is not in the portfolio

    const fetchPrePortfolio = async () => {
      if (!prePortfolioUrl) throw new Error('API URL is not defined');
      try {
        console.log(savedPortfolioSymbols);
        const response = await axios.post(prePortfolioUrl, {
          stocks: savedPortfolioSymbols,
        });
        console.log('Pre-portfolio data fetched from API:', response.data);
        setCorrelationMatrix(response.data.correlationMatrix);
        setStocksOrder(response.data.stocks);
        const priorReturns = response.data.priorReturns;
        const enrichedPortfolio: portfolioStockData[] = savedPortfolio.map(
          (stock: homePageStockData, index: number) => {
            return {
              ...stock,
              impliedEqReturn: priorReturns[index], // Add impliedEqReturn from priorReturns array
            };
          }
        );
        setPortfolio(enrichedPortfolio);
      } catch (error) {
        console.error('Error fetching pre-portfolio data:', error);
      }
    };

    fetchPrePortfolio();
  }, []);

  const handleAddView = () => {
    const updatedViews = [...investorViews, newView];
    setInvestorViews(updatedViews);
    setShowPopup(false);

    localStorage.setItem('investorViews', JSON.stringify(updatedViews));

    setNewView({
      asset1: '',
      percentage: '',
      confident: '',
    });
  };

  const handleOptimize = async () => {
    const payload = {
      stockList: {
        stocks: portfolioSymbols,
      },
      investorViews: investorViews,
      constraint: {
        isReturn: selectedMetric === 'return',
        percentage: sliderValue,
      },
    };
    const response = await axios.post(postPortfolioUrl, payload);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full text-black">
      <NavBar />
      <div className="w-full max-w-screen-lg mx-auto bg-white p-6">
        {/* Assets Section */}
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
                  <th className="px-4 py-2 border-b">ImplidEqReturn</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{item.symbol}</td>
                    <td className="px-4 py-2 border-b">{item.price}</td>
                    <td className="px-4 py-2 border-b">
                      {item.annual5YrsReturn}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item.annual3YrsReturn}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item.annual1YrReturn}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item.ytdReturn ?? 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b">{item.sector}</td>
                    <td className="px-4 py-2 border-b">{item.industry}</td>
                    <td className="px-4 py-2 border-b">{item.marketCap}</td>
                    <td className="px-4 py-2 border-b">
                      {item.impliedEqReturn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Correlation Matrix Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Correlation Matrix</h2>
          <div className="overflow-auto">
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border-b"></th>
                  {stocksOrder.map((symbol: string, index: number) => (
                    <th key={index} className="px-4 py-2 border-b">
                      {symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row: number[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2 border-b">
                      {stocksOrder[rowIndex]}
                    </td>
                    {row.map((value: number, colIndex: number) => (
                      <td key={colIndex} className="px-4 py-2 border-b">
                        {value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Investor's View Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Investor's View</h2>
          <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg text-center mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border-b">Asset 1</th>
                <th className="px-4 py-2 border-b">Action</th>
                <th className="px-4 py-2 border-b">Asset 2</th>
                <th className="px-4 py-2 border-b">Return</th>
                <th className="px-4 py-2 border-b">Confident</th>
              </tr>
            </thead>
            <tbody>
              {investorViews.map((view, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{view.asset1}</td>
                  <td className="px-4 py-2 border-b">
                    {view.asset2 ? 'will outperform' : 'will return'}
                  </td>
                  <td className="px-4 py-2 border-b">{view.asset2 || '-'}</td>
                  <td className="px-4 py-2 border-b">{view.percentage}%</td>
                  <td className="px-4 py-2 border-b">{view.confident}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Add View
          </button>
        </section>

        {/* Pop-Up Window */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">Add Investor's View</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Asset 1
                </label>
                <select
                  value={newView.asset1}
                  onChange={(e) =>
                    setNewView({
                      ...newView,
                      asset1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>
                    Select Asset 1
                  </option>
                  {portfolio.map((asset) => (
                    <option key={asset._id} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Asset 2 (Optional)
                </label>
                <select
                  value={newView.asset2 || ''}
                  onChange={(e) =>
                    setNewView({
                      ...newView,
                      asset2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Asset 2 (Optional)</option>
                  {portfolio.map((asset) => (
                    <option key={asset._id} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
			  <div className="mb-4">
				<label className="block text-sm font-medium mb-1">
					Return (%)
				</label>
				<input
					type="number"  // Change input type to "number"
					value={newView.percentage}
					onChange={(e) => {
					const value = e.target.value;
					// Only update if the value is a valid number or an empty string
					if (value === "" || !isNaN(parseFloat(value))) {
						setNewView({
						...newView,
						percentage: value === "" ? "" : parseFloat(value),
						});
					}
					}}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg"
					placeholder="Enter return percentage"
				/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">
						Confidence (%)
					</label>
					<input
						type="number"
						value={newView.confident}
						onChange={(e) => {
						const value = e.target.value;
						// Only update if the value is a valid number or an empty string
						if (value === "" || !isNaN(parseFloat(value))) {
							setNewView({
							...newView,
							confident: value === "" ? "" : parseFloat(value),
							});
						}
						}}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg"
						placeholder="Enter confidence percentage"
					/>
					</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddView}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restraint Section */}
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
      </div>
    </div>
  );
};

export default Portfolio;
