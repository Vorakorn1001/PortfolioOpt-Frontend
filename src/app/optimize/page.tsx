'use client';

import { StockData } from '@/interfaces/stock.interface';
import { investorView } from '@/interfaces/view.interface';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssetProportion from '@/components/AssetProportion';
import HistoricalPerformance from '@/components/HistoricalPerformance';
import KeyMetrics from '@/components/KeyMetrics';
import Diversification from '@/components/Diversification';
import MeanVarianceAnalysis from '@/components/MeanVarianceAnalysis';
import NavBar from '@/components/NavBar';

interface Metric {
  label: string;
  value: string;
}

const data = {
  nodes: [
    { name: 'Portfolio 100%' },
    { name: 'Place Holder-1' },
  ],
  links: [
    { source: 0, target: 1, value: 1 },
  ],
};

const portfolioVsMarket = {
  days: [
    '2023-01-01',
    '2023-02-01',
    '2023-03-01',
    '2023-04-01',
    '2023-05-01',
    '2023-06-01',
    '2023-07-01',
  ],
  portfolio: [0, 10, 5, 15, 20, 18, 25],
  market: [0, 5, 10, 20, 25, 30, 50],
};

const sampleData = [
  {
    weight: [0.2, 0.3, 0.5], // Example portfolio weights
    return: 0.08, // Portfolio return
    volatility: 0.12, // Portfolio volatility
    sharpeRatio: 1.5, // Portfolio Sharpe ratio
  },
  {
    weight: [0.4, 0.1, 0.5], // Example portfolio weights
    return: 0.1, // Portfolio return
    volatility: 0.15, // Portfolio volatility
    sharpeRatio: 1.2, // Portfolio Sharpe ratio
  },
  {
    weight: [0.3, 0.3, 0.4], // Example portfolio weights
    return: 0.07, // Portfolio return
    volatility: 0.1, // Portfolio volatility
    sharpeRatio: 1.0, // Portfolio Sharpe ratio
  },
  {
    weight: [0.1, 0.5, 0.4], // Example portfolio weights
    return: 0.12, // Portfolio return
    volatility: 0.18, // Portfolio volatility
    sharpeRatio: 0.8, // Portfolio Sharpe ratio
  },
  {
    weight: [0.3, 0.4, 0.3], // Example portfolio weights
    return: 0.09, // Portfolio return
    volatility: 0.14, // Portfolio volatility
    sharpeRatio: 1.3, // Portfolio Sharpe ratio
  },
];

const Portfolio: React.FC = () => {
  const [stocksOrder, setStocksOrder] = useState<string[]>([]);
  const [porfolioWeights, setPortfolioWeights] = useState<number[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<Metric[]>([]);
  const [diversificationData, setDiversificationData] = useState(data);
  const [portfolioVsMarketData, setPortfolioVsMarketData] =
    useState(portfolioVsMarket);
  const [MeanVarianceAnalysisData, setMeanVarianceAnalysisData] =
    useState(sampleData);

  const optimizeUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/optimize/';
  const changeUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/optimize/change/';

  useEffect(() => {
    const savedPortfolio = JSON.parse(
      localStorage.getItem('portfolio') || '[]'
    );
    const savedInvestorViews = JSON.parse(
      localStorage.getItem('investorViews') || '[]'
    );
    const savedConstraint = JSON.parse(
      localStorage.getItem('constraint') || '{}'
    );

    const fetchOptimizePage = async () => {
      if (!optimizeUrl) throw new Error('API URL is not defined');
      try {
        const response = await axios.post(optimizeUrl, {
          stocks: savedPortfolio.map((stock: StockData) => stock.symbol),
          investorViews: savedInvestorViews,
          constraint: savedConstraint,
        });
        setStocksOrder(response.data.stocks);
        setPortfolioWeights(response.data.weights);
        setDiversificationData(response.data.diversification);
        setPortfolioMetrics(response.data.metrics);
        setPortfolioVsMarketData(response.data.portfolioVsMarket);
        setMeanVarianceAnalysisData(response.data.meanVarianceGraph);        
      } catch (error) {
        console.error('Error fetching pre-portfolio data:', error);
      }
    };

    fetchOptimizePage();
  }, []);

  const handleWeightChange = async (weights: number[]) => {
    if (!changeUrl) throw new Error('API URL is not defined');
    const response = await axios.post(changeUrl, {
      stocks: stocksOrder,
      weights: weights
    });
    setPortfolioWeights(response.data.weights);
    setDiversificationData(response.data.diversification);
    setPortfolioMetrics(response.data.metrics);
    setPortfolioVsMarketData(response.data.portfolioVsMarket);
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full text-black">
      <NavBar />
      <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
        <div className="grid grid-cols-2 gap-4">
          <AssetProportion Labels={stocksOrder} Values={porfolioWeights} />
          <Diversification data={diversificationData} />
        </div>
        <div className="py-4">
          <KeyMetrics metrics={portfolioMetrics} />
        </div>
        <div className="py-4">
          <HistoricalPerformance portfolioVsMarket={portfolioVsMarketData} />
        </div>
        <div className="py-4">
          <MeanVarianceAnalysis 
          data={MeanVarianceAnalysisData}
          setWeight={handleWeightChange} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
