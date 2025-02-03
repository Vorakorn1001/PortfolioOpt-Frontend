'use client';

import StockData from '@/interfaces/stock.interface';
import OptimizeSkeleton from '@/components/OptimizeSkeleton';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@/utils/helper';

import axios from 'axios';
import AssetProportion from '@/components/AssetProportion';
import HistoricalPerformance from '@/components/HistoricalPerformance';
import KeyMetrics from '@/components/KeyMetrics';
import Diversification from '@/components/Diversification';
import MeanVarianceAnalysis from '@/components/MeanVarianceAnalysis';
import NavBar from '@/components/NavBar';
import Metric from '@/interfaces/metric.interface';

const Optimize: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stocksOrder, setStocksOrder] = useState<string[]>([]);
    const [porfolioWeights, setPortfolioWeights] = useState<number[]>([]);
    const [portfolioMetrics, setPortfolioMetrics] = useState<Metric[]>([]);
    const [diversificationData, setDiversificationData] = useState(data);
    const [portfolioVsMarketData, setPortfolioVsMarketData] =
        useState(portfolioVsMarket);
    const [MeanVarianceAnalysisData, setMeanVarianceAnalysisData] =
        useState(sampleData);

    const [selectedTimeFrame, setSelectedTimeFrame] = useState<
        '5y' | '3y' | '1y' | '6m' | 'ytd'
    >('5y');

    const isMobile = useMediaQuery('(max-width: 767px)');

    const optimizeUrl = '/api/backend/optimize/init';
    const changeUrl = '/api/backend/optimize/change';
    const performanceUrl = '/api/backend/optimize/performance';

    useEffect(() => {
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (!savedPortfolioData) return;

        const activePortfolioName = savedPortfolioData.activePortfolio;

        const savedPortfolio =
            savedPortfolioData.portfolios[activePortfolioName]?.assets || [];
        const savedInvestorViews =
            savedPortfolioData.portfolios[activePortfolioName]?.investorViews ||
            [];

        const savedConstraint = JSON.parse(
            localStorage.getItem('constraint') || '{}'
        );

        const fetchOptimizePage = async () => {
            if (!optimizeUrl) throw new Error('API URL is not defined');
            try {
                const optimizeUrlWithTimeFrame =
                    optimizeUrl + '?timeframe=' + selectedTimeFrame;
                const response = await axios.post(optimizeUrlWithTimeFrame, {
                    stocks: savedPortfolio.map(
                        (stock: StockData) => stock.symbol
                    ),
                    timeframe: selectedTimeFrame,
                    investorViews: savedInvestorViews,
                    constraint: savedConstraint,
                });
                setStocksOrder(response.data.stocks);
                setPortfolioWeights(response.data.weights);
                setDiversificationData(response.data.diversification);
                setPortfolioMetrics(response.data.metrics);
                setPortfolioVsMarketData(response.data.portfolioVsMarket);
                setMeanVarianceAnalysisData(response.data.meanVarianceGraph);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching pre-portfolio data:', error);
            }
        };

        fetchOptimizePage();
    }, []);

    const handleWeightChange = async (weights: number[]) => {
        if (!changeUrl) throw new Error('API URL is not defined');
        const response = await axios.post(
            changeUrl + '?timeframe=' + selectedTimeFrame,
            {
                stocks: stocksOrder,
                weights: weights,
                timeframe: selectedTimeFrame,
            }
        );
        setPortfolioWeights(response.data.weights);
        setDiversificationData(response.data.diversification);
        setPortfolioMetrics(response.data.metrics);
        setPortfolioVsMarketData(response.data.portfolioVsMarket);
    };

    const handleTimeFrameChange = async (
        timeframe: '5y' | '3y' | '1y' | '6m' | 'ytd'
    ) => {
        if (['5y', '3y', '1y', '6m', 'ytd'].includes(timeframe)) {
            setSelectedTimeFrame(timeframe);
            const payload = {
                stocks: stocksOrder,
                weights: porfolioWeights,
                timeFrame: timeframe,
            };
            const response = await axios.post(
                performanceUrl + '?timeframe=' + timeframe,
                payload
            );
            setPortfolioMetrics(response.data.metrics);
            setPortfolioVsMarketData(response.data.portfolioVsMarket);
        } else {
            console.error('Invalid timeframe selected');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gray-100 min-h-screen w-full text-black">
                <NavBar />
                <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
                    <OptimizeSkeleton />
                </div>
            </div>
        );
    }

    return (

        
<div className="bg-gray-100 min-h-screen w-full text-black" suppressHydrationWarning>
  <NavBar />
  <div className="px-4 sm:px-0">
    <div className="w-full max-w-screen-lg mx-auto bg-transparent min-h-screen">
      <div className="py-2" />
      
      {/* 
        Use a grid with 2 columns on desktop, 1 column on mobile. 
        We’ll control the vertical ordering with Tailwind’s order classes.
      */}
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* 
          AssetProportion:
          - Mobile: order-1
          - Desktop: order-1
        */}
        <div className="order-1 md:order-1 md:col-span-1">
          <AssetProportion
            Labels={stocksOrder}
            Values={porfolioWeights}
          />
        </div>

        {/* 
          Diversification:
          - Mobile: order-3
          - Desktop: order-2
        */}
        <div className="order-3 md:order-2 md:col-span-1">
          <Diversification data={diversificationData} />
        </div>

        {/* 
          Mean-Variance Analysis:
          - Mobile: order-2
          - Desktop: order-3 and spans both columns
        */}
        <div className="order-2 md:order-3 md:col-span-2">
          <MeanVarianceAnalysis
            data={MeanVarianceAnalysisData}
            setWeight={handleWeightChange}
          />
        </div>

        {/* 
          Key Metrics:
          - Mobile: order-4
          - Desktop: order-4 and spans both columns
        */}
        <div className="order-4 md:order-4 md:col-span-2">
          <KeyMetrics metrics={portfolioMetrics} />
        </div>

        {/* 
          Historical Performance:
          - Mobile: order-5
          - Desktop: order-5 and spans both columns
        */}
<div className="order-5 md:order-5 md:col-span-2">
  <HistoricalPerformance
    portfolioVsMarket={portfolioVsMarketData}
    selectedTimeframe={selectedTimeFrame}
    handleTimeFrameChange={handleTimeFrameChange}
  />
</div>
      </div>
    </div>
  </div>
</div>

    );
};

export default Optimize;

// Dummy data below
const data = {
    nodes: [{ name: 'Portfolio 100%' }, { name: 'Place Holder-1' }],
    links: [{ source: 0, target: 1, value: 1 }],
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
        weight: [0.2, 0.3, 0.5],
        return: 0.08,
        volatility: 0.12,
        sharpeRatio: 1.5,
    },
    {
        weight: [0.4, 0.1, 0.5],
        return: 0.1,
        volatility: 0.15,
        sharpeRatio: 1.2,
    },
    {
        weight: [0.3, 0.3, 0.4],
        return: 0.07,
        volatility: 0.1,
        sharpeRatio: 1.0,
    },
    {
        weight: [0.1, 0.5, 0.4],
        return: 0.12,
        volatility: 0.18,
        sharpeRatio: 0.8,
    },
    {
        weight: [0.3, 0.4, 0.3],
        return: 0.09,
        volatility: 0.14,
        sharpeRatio: 1.3,
    },
];
