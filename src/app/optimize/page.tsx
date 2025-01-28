'use client';

import StockData from '@/interfaces/stock.interface';
import OptimizeSkeleton from '@/components/OptimizeSkeleton';
import React, { useEffect, useState } from 'react';
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
                const optimizeUrlwithTimeFrame =
                    optimizeUrl + '?timeframe=' + selectedTimeFrame;
                const response = await axios.post(optimizeUrlwithTimeFrame, {
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
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <NavBar />
            <div className="w-full max-w-screen-lg mx-auto bg-transparent min-h-screen">
                <div className="py-2" />
                <div className="grid grid-cols-2 gap-2">
                    <AssetProportion
                        Labels={stocksOrder}
                        Values={porfolioWeights}
                    />
                    <Diversification data={diversificationData} />
                </div>

                <div className="py-1" />

                <MeanVarianceAnalysis
                    data={MeanVarianceAnalysisData}
                    setWeight={handleWeightChange}
                />

                <div className="py-1" />

                <KeyMetrics metrics={portfolioMetrics} />

                <div className="py-1" />

                <HistoricalPerformance
                    portfolioVsMarket={portfolioVsMarketData}
                    selectedTimeframe={selectedTimeFrame}
                    handleTimeFrameChange={handleTimeFrameChange}
                />
                <div className="py-10" />
            </div>
        </div>
    );
};

export default Optimize;

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
