'use client';

import { StockData } from '@/interfaces/stock.interface';
import { investorView } from '@/interfaces/view.interface';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AssetsSection from '@/components/AssetsSection';
import CorrelationMatrixSection from '@/components/CorrelationMatrixSection';
import InvestorsViewSection from '@/components/InvestorsViewSection';
import ConstraintSection from '@/components/ConstraintSection';
import AddViewPopup from '@/components/AddViewPopup';
import AssetProportion from '@/components/AssetProportion';
import HistoricalPerformance from '@/components/HistoricalPerformance';
import KeyMetrics from '@/components/KeyMetrics';
import Diversification from '@/components/Diversification';
import MeanVarianceAnalysis from '@/components/MeanVarianceAnalysis';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import NavBar from '@/components/NavBar';

interface Metric {
  label: string;
  value: string;
}

const Portfolio: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(7);
  const [selectedMetric, setSelectedMetric] = useState('return');
  const [showPopup, setShowPopup] = useState(false);
  const [showOptimizePage, setShowOptimizePage] = useState(false);
  const [portfolioSymbols, setPortfolioSymbols] = useState<string[]>([]);
  const [stocksOrder, setStocksOrder] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [porfolioWeights, setPortfolioWeights] = useState<number[]>([]);
  const [portfolio, setPortfolio] = useState<StockData[]>([]);
  const [investorViews, setInvestorViews] = useState<investorView[]>([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false); // Flag to track initial fetch
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const prePortfolioUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/pre';
  const postPortfolioUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/post';

  const defaultMetrics: Metric[] = [
    { label: 'Metric 1', value: 'Value 1' },
    { label: 'Metric 2', value: 'Value 2' },
    { label: 'Metric 3', value: 'Value 3' },
    { label: 'Metric 4', value: 'Value 4' },
    { label: 'Metric 5', value: 'Value 5' },
    { label: 'Metric 6', value: 'Value 6' },
  ];

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

    const fetchPortfolioPage = async () => {
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
        const enrichedPortfolio: StockData[] = savedPortfolio.map(
          (stock: StockData, index: number) => ({
            ...stock,
            impliedEqReturn: priorReturns[index],
          })
        );
        setPortfolio(enrichedPortfolio);
        setIsInitialFetchDone(true); 
      } catch (error) {
        console.error('Error fetching pre-portfolio data:', error);
      }
    };

    fetchPortfolioPage();
  }, []);

  // Fetch data when the portfolio changes
  const handlePortfolioChange = async (updatedPortfolio: StockData[]) => {
    setPortfolio(updatedPortfolio);

    // Avoid making API requests if the initial fetch is not done
    if (!isInitialFetchDone) return;

    const updatedPortfolioSymbols = updatedPortfolio.map((item) => item.symbol);
    try {
      const response = await axios.post(prePortfolioUrl, {
        stocks: updatedPortfolioSymbols,
      });
      console.log('Updated portfolio data fetched from API:', response.data);
      setCorrelationMatrix(response.data.correlationMatrix);
      setStocksOrder(response.data.stocks);
      const priorReturns = response.data.priorReturns;
      const enrichedPortfolio: StockData[] = updatedPortfolio.map(
        (stock: StockData, index: number) => ({
          ...stock,
          impliedEqReturn: priorReturns[index],
        })
      );
      setPortfolio(enrichedPortfolio);
    } catch (error) {
      console.error('Error fetching updated portfolio data:', error);
    }
  };

  const handleAddView = (newView: investorView) => {
    setInvestorViews([...investorViews, newView]);
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
    const weights = response.data.weights;
    setPortfolioWeights(weights);
    setShowOptimizePage(true);
	setMetrics(response.data.metrics);
	console.log(response.data.metrics);
  };

  const handleGoBack = () => {
    setShowOptimizePage(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full text-black">
      <NavBar />
      <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
        {showOptimizePage ? (
          <div>
            <button onClick={handleGoBack} className="flex items-center mb-4">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <AssetProportion
                Labels={portfolioSymbols}
                Values={porfolioWeights}
              />
              <Diversification />
            </div>
            <div className="py-4">
              <KeyMetrics metrics={metrics} />
            </div>
            <div className="py-4">
              <HistoricalPerformance />
            </div>
            <div className="py-4">
              <MeanVarianceAnalysis />
            </div>
          </div>
        ) : (
          <div>
            <AssetsSection
              portfolio={portfolio}
              showImpliedEqReturn={true}
              handlePortfolioChange={handlePortfolioChange}
            />
            <CorrelationMatrixSection
              correlationMatrix={correlationMatrix}
              stocksOrder={stocksOrder}
            />
            <InvestorsViewSection
              investorViews={investorViews}
              setShowPopup={setShowPopup}
            />
            <ConstraintSection
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
              handleOptimize={handleOptimize}
            />
            <AddViewPopup
              isVisible={showPopup}
              onClose={() => setShowPopup(false)}
              onSave={handleAddView}
              portfolio={portfolioSymbols.map((symbol) => ({ symbol }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
