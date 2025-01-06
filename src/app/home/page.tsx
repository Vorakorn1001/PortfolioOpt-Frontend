'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import AddRemoveButton from '@/components/AddRemoveButton';
import { StockData } from '@/interfaces/stock.interface';

const Home: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [portfolio, setPortfolio] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/stock';
      try {
        if (!apiUrl) throw new Error('API URL is not defined');
        const response = await axios.get(apiUrl, {
          maxRedirects: 5,
        });
        console.log('Data fetched from API:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    console.log('Fetching data from API...');

    // Load portfolio from localStorage
    const savedPortfolio = JSON.parse(
      localStorage.getItem('portfolio') || '[]'
    );
    setPortfolio(savedPortfolio);
  }, []);

  // Update portfolio when stocks are added or removed
  const handlePortfolioChange = (updatedPortfolio: StockData[]) => {
    setPortfolio(updatedPortfolio);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full text-black">
      <NavBar />
      <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Stocks</h1>
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border-b">Symbol</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">5Y Annual</th>
              <th className="px-4 py-2 border-b">3Y Annual</th>
              <th className="px-4 py-2 border-b">1Y Annual</th>
              <th className="px-4 py-2 border-b">YTD Annual</th>
              <th className="px-4 py-2 border-b">Sector</th>
              <th className="px-4 py-2 border-b">Industry</th>
              <th className="px-4 py-2 border-b">Market Cap</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item.symbol}</td>
                <td className="px-4 py-2 border-b">{item.price}</td>
                <td className="px-4 py-2 border-b">{item.annual5YrsReturn}</td>
                <td className="px-4 py-2 border-b">{item.annual3YrsReturn}</td>
                <td className="px-4 py-2 border-b">{item.annual1YrReturn}</td>
                <td className="px-4 py-2 border-b">{item.ytdReturn}</td>
                <td className="px-4 py-2 border-b">{item.sector}</td>
                <td className="px-4 py-2 border-b">{item.industry}</td>
                <td className="px-4 py-2 border-b">
                  {item.marketCap.toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <AddRemoveButton
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
  );
};

export default Home;
