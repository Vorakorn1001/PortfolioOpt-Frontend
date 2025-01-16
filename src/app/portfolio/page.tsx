'use client';

import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';

import { StockData } from '@/interfaces/stock.interface';
import { investorView } from '@/interfaces/view.interface';
import { Limit } from '@/interfaces/limit.interface';

import AssetsSection from '@/components/AssetsSection';
import CorrelationMatrixSection from '@/components/CorrelationMatrixSection';
import InvestorsViewSection from '@/components/InvestorsViewSection';
import ConstraintSection from '@/components/ConstraintSection';
import AddViewPopup from '@/components/AddViewPopup';
import NavBar from '@/components/NavBar';

const Portfolio: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [sliderValue, setSliderValue] = useState(7);
  const [selectedMetric, setSelectedMetric] = useState('return');

  const [showPopup, setShowPopup] = useState(false);
  const [validPortfolio, setValidPortfolio] = useState(true);

  const [stocksOrder, setStocksOrder] = useState<string[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [portfolio, setPortfolio] = useState<StockData[]>([]);
  const [investorViews, setInvestorViews] = useState<investorView[]>([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const [limits, setLimits] = useState<Limit>(() => ({
    minReturn: 0,
    maxReturn: 100,
    minVolatility: 0,
    maxVolatility: 100,
  }));

  const PortfolioUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/';
  const ViewUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/portfolio/view/';
  const uploadIBKRUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/ibkr/';

  useEffect(() => {
    const savedPortfolio = JSON.parse(
      localStorage.getItem('portfolio') || '[]'
    );
    const savedInvestorViews = JSON.parse(
      localStorage.getItem('investorViews') || '[]'
    );

    if (savedPortfolio.length < 2) {
      setValidPortfolio(false);
      return;
    }

    setInvestorViews(savedInvestorViews);
    setPortfolio(savedPortfolio);

    const fetchPortfolioPage = async () => {
      if (!PortfolioUrl) throw new Error('API URL is not defined');
      const payload = {
        stocks: savedPortfolio.map((stock: StockData) => stock.symbol),
        investorViews: savedInvestorViews,
      };
      try {
        const response = await axios.post(PortfolioUrl, payload);
        setCorrelationMatrix(response.data.correlationMatrix);
        setStocksOrder(response.data.stocks);
        const reorderedPortfolio = response.data.stocks.map((symbol: string) =>
          savedPortfolio.find((stock: StockData) => stock.symbol === symbol)
        );
        const priorReturns = response.data.priorReturns;
        const posteriorReturns = response.data.posteriorReturns;
        const responseLimits = response.data.limits;
        setLimits(responseLimits);
        setSliderValue(
          selectedMetric === 'return'
            ? responseLimits.minReturn
            : responseLimits.minVolatility
        );

        const enrichedPortfolio: StockData[] = reorderedPortfolio.map(
          (stock: StockData, index: number) => ({
            ...stock,
            priorReturn: priorReturns[index],
            posteriorReturn: posteriorReturns[index],
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

    // Remove investor views related to deleted stocks
    const updatedViews = investorViews.filter((view) => {
      return (
        updatedPortfolioSymbols.includes(view.asset1) &&
        (!view.asset2 || updatedPortfolioSymbols.includes(view.asset2))
      );
    });
    setInvestorViews(updatedViews);
    localStorage.setItem('investorViews', JSON.stringify(updatedViews));

    // If the length of updatedPortfolio is less than 2, set impliedEqReturn to 'NaN' and don't send any request
    if (updatedPortfolio.length < 2) {
      const enrichedPortfolio: StockData[] = updatedPortfolio.map((stock) => ({
        ...stock,
        priorReturn: NaN,
        posteriorReturn: NaN,
      }));
      setPortfolio(enrichedPortfolio);
      setValidPortfolio(false);
      setCorrelationMatrix([]);
      return;
    }

    try {
      const response = await axios.post(PortfolioUrl, {
        stocks: updatedPortfolio.map((stock) => stock.symbol),
        investorViews: investorViews,
      });
      setCorrelationMatrix(response.data.correlationMatrix);
      setStocksOrder(response.data.stocks);
      const priorReturns = response.data.priorReturns;
      const posteriorReturns = response.data.posteriorReturns;
      const responseLimits = response.data.limits;
      setLimits(responseLimits);
      setSliderValue(
        selectedMetric === 'return'
          ? responseLimits.minReturn
          : responseLimits.minVolatility
      );

      const enrichedPortfolio: StockData[] = updatedPortfolio.map(
        (stock: StockData, index: number) => ({
          ...stock,
          priorReturn: priorReturns[index],
          posteriorReturn: posteriorReturns[index],
        })
      );
      localStorage.setItem('portfolio', JSON.stringify(enrichedPortfolio));
      setPortfolio(enrichedPortfolio);
    } catch (error) {
      console.error('Error fetching updated portfolio data:', error);
    }
  };

  const handleViewChange = async (updatedViews: investorView[]) => {
    try {
      const response = await axios.post(ViewUrl, {
        stocks: portfolio.map((stock) => stock.symbol),
        investorViews: updatedViews,
      });

      const priorReturns = response.data.priorReturns;
      const posteriorReturns = response.data.posteriorReturns;
      const responseLimits = response.data.limits;
      setLimits(responseLimits);
      setSliderValue(
        selectedMetric === 'return'
          ? responseLimits.minReturn
          : responseLimits.minVolatility
      );

      const enrichedPortfolio: StockData[] = portfolio.map(
        (stock: StockData, index: number) => ({
          ...stock,
          priorReturn: priorReturns[index],
          posteriorReturn: posteriorReturns[index],
        })
      );
      setPortfolio(enrichedPortfolio);
    } catch (error) {
      console.error('Error fetching updated portfolio data:', error);
    }
  };

  const handleAddView = (newView: investorView) => {
    const updatedViews = [...investorViews, newView];
    setInvestorViews(updatedViews);
    localStorage.setItem('investorViews', JSON.stringify(updatedViews));
    handleViewChange(updatedViews);
  };

  const handleRemoveView = (index: number) => {
    const updatedViews = investorViews.filter((_, i) => i !== index);
    setInvestorViews(updatedViews);
    localStorage.setItem('investorViews', JSON.stringify(updatedViews));
    handleViewChange(updatedViews);
  };

  const handleOptimize = async () => {
    const constraints = {
      isReturn: selectedMetric == 'return',
      percentage: sliderValue / 100,
    };
    localStorage.setItem('constraint', JSON.stringify(constraints));
    window.location.href = '/optimize';
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(uploadIBKRUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        handlePortfolioChange(response.data.portfolio);
        setUploadSuccess('File uploaded successfully!');
        setUploadError(null);
      } else {
        setUploadError('Failed to upload file.');
      }
    } catch (error) {
      setUploadError('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full text-black">
      <NavBar />
      <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <button
            onClick={handleButtonClick}
            disabled={uploading}
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '14px 16px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '200px',
              margin: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload IBKR CSV File'}
          </button>
        </div>

        <div>
          <AssetsSection
            portfolio={portfolio}
            excludeFields={['price', 'sector', 'industry']}
            handlePortfolioChange={handlePortfolioChange}
          />
          {validPortfolio ? (
            <>
              <CorrelationMatrixSection
                correlationMatrix={correlationMatrix}
                stocksOrder={stocksOrder}
              />
              <InvestorsViewSection
                investorViews={investorViews}
                setShowPopup={setShowPopup}
                onRemoveView={handleRemoveView}
              />
              <ConstraintSection
                limits={limits}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
              />
              <button
                className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                onClick={handleOptimize}
              >
                Optimize
              </button>
            </>
          ) : (
            <div className="text-red-500">
              Please add at least 2 stocks to the portfolio to view the
              correlation matrix and other details.
            </div>
          )}
          <AddViewPopup
            isVisible={showPopup}
            onClose={() => setShowPopup(false)}
            onSave={handleAddView}
            portfolio={portfolio.map((stock) => ({ symbol: stock.symbol }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
