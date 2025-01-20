'use client';

import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


import StockData from '@/interfaces/stock.interface';
import InvestorView from '@/interfaces/view.interface';
import Limit from '@/interfaces/limit.interface';

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
    const [showPortfolio, setShowPortfolio] = useState<StockData[]>([]);
    const [investorViews, setInvestorViews] = useState<InvestorView[]>([]);
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
    const updateAssetsUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updateAssets';
    const updatePortfolioUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updatePortfolio';

    const { data: session, status } = useSession();


    useEffect(() => {
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (!savedPortfolioData) return;

        const activePortfolioName = savedPortfolioData.activePortfolio;
        const activePortfolio =
            savedPortfolioData.portfolios[activePortfolioName]?.assets || [];
        const savedInvestorViews =
            savedPortfolioData.portfolios[activePortfolioName]?.investorView ||
            [];

        if (activePortfolio.length < 2) {
            setValidPortfolio(false);
            return;
        }

        setInvestorViews(savedInvestorViews);
        setPortfolio(activePortfolio);
        setIsInitialFetchDone(true);
    }, []);

    // Save the active portfolio in localStorage and update the portfolio data
    useEffect(() => {
        if (!isInitialFetchDone) return;
        const saveActivePortfolio = async () => {
            const savedPortfolioData = JSON.parse(
                localStorage.getItem('portfolioData') || 'null'
            );

            if (!savedPortfolioData) return;

            const activePortfolioName = savedPortfolioData.activePortfolio;
            if (!activePortfolioName) return;

            const savedPortfolio =
                savedPortfolioData.portfolios[activePortfolioName];
            if (!savedPortfolio) return;

            const portfolioSymbols = savedPortfolio.assets.map(
                (asset: { symbol: string }) => asset.symbol
            );

            const validInvestorViews = savedPortfolio.investorViews.filter(
                (investorView: InvestorView) => {
                    const assetsToCheck = [
                        investorView.asset1,
                        investorView.asset2,
                    ].filter(Boolean);
                    // Check if all assets in the investor view are in the portfolio
                    return assetsToCheck.every((assetSymbol) =>
                        portfolioSymbols.includes(assetSymbol)
                    );
                }
            );

            // Save the updated portfolio assets in localStorage
            savedPortfolioData.portfolios[activePortfolioName].assets =
                portfolio;
            localStorage.setItem(
                'portfolioData',
                JSON.stringify(savedPortfolioData)
            );

            // if there are a change in the investor views the portfolio will be updated by investor views listener
            if (validInvestorViews.length !== savedPortfolio.investorViews.length) {
                setInvestorViews(validInvestorViews);
                return;
            }

            // Send updated portfolio data to the backend
            if (status === 'authenticated') {
                // Send UserData, ActivePortfolio, and PortfolioData of that Portfolio
                const userData = {
                    name: session.user?.name,
                    email: session.user?.email,
                    image: session.user?.image,
                    activePortfolio: activePortfolioName,
                };
                const payload = {
                    user: userData,
                    portfolio: portfolio,
                };
                await axios.post(updateAssetsUrl, payload);
            }

            try {
                const response = await axios.post(PortfolioUrl, {
                    stocks: portfolio.map((stock: StockData) => stock.symbol),
                    investorViews: investorViews,
                });

                const priorReturns = response.data.priorReturns;
                const posteriorReturns = response.data.posteriorReturns;
                const responseLimits = response.data.limits;

                setCorrelationMatrix(response.data.correlationMatrix);
                setStocksOrder(response.data.stocks);
                setLimits(responseLimits);
                setSliderValue(
                    selectedMetric === 'return'
                        ? responseLimits.minReturn
                        : responseLimits.minVolatility
                );

                const enrichedPortfolio: StockData[] = response.data.stocks.map(
                    (symbol: string, index: number) => ({
                        ...portfolio.find(
                            (stock: StockData) => stock.symbol === symbol
                        ),
                        priorReturn: priorReturns[index],
                        posteriorReturn: posteriorReturns[index],
                    })
                );

                setShowPortfolio(enrichedPortfolio);
                setIsInitialFetchDone(true);
            } catch (error) {
                console.error('Error fetching updated portfolio data:', error);
            }
        };
        saveActivePortfolio();
    }, [portfolio]);

    // Save the active portfolio's investorViews in localStorage and update the portfolio data
    useEffect(() => {
        if (!isInitialFetchDone) return;
        const saveActivePortfolio = async () => {
            const savedPortfolioData = JSON.parse(
                localStorage.getItem('portfolioData') || 'null'
            );
            if (!savedPortfolioData) return;

            const activePortfolioName = savedPortfolioData.activePortfolio;
            if (!activePortfolioName) return;

            // Update the active portfolio's investorViews in localStorage
            savedPortfolioData.portfolios[activePortfolioName].investorViews =
                investorViews;
            localStorage.setItem(
                'portfolioData',
                JSON.stringify(savedPortfolioData)
            );
            
            // send update portfolioData to the backend
            if (status === 'authenticated') {
                console.log('Sending updated portfolio data to the backend...');
                // Send UserData, ActivePortfolio, and PortfolioData of that Portfolio
                const userData = {
                    name: session.user?.name,
                    email: session.user?.email,
                    image: session.user?.image,
                    activePortfolio: activePortfolioName,
                };
                const payload = {
                    user: userData,
                    portfolio: savedPortfolioData.portfolios[activePortfolioName],
                };
                await axios.post(updatePortfolioUrl, payload);

            }

            try {
                const response = await axios.post(ViewUrl, {
                    stocks: portfolio.map((stock) => stock.symbol),
                    investorViews: investorViews, // Use the updated `investorViews`
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
                setShowPortfolio(enrichedPortfolio);
            } catch (error) {
                console.error('Error fetching updated portfolio data:', error);
            }
        };

        saveActivePortfolio();
    }, [investorViews]);

    const handlePortfolioChange = async (updatedPortfolio: StockData[]) => {
        setPortfolio(updatedPortfolio);
        if (updatedPortfolio.length < 2) {
            setValidPortfolio(false);
            setCorrelationMatrix([]);
            return;
        }
    };

    const handleAddView = (newView: InvestorView) => {
        const updatedViews = [...investorViews, newView];
        setInvestorViews(updatedViews);
    };

    const handleRemoveView = (index: number) => {
        const updatedViews = investorViews.filter((_, i) => i !== index);
        setInvestorViews(updatedViews);
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
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setUploadError('Please upload a CSV file.');
            return;
        }

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
                        portfolio={showPortfolio}
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
                            Please add at least 2 stocks to the portfolio to
                            view the correlation matrix and other details.
                        </div>
                    )}
                    <AddViewPopup
                        isVisible={showPopup}
                        onClose={() => setShowPopup(false)}
                        onSave={handleAddView}
                        portfolio={portfolio.map((stock) => ({
                            symbol: stock.symbol,
                        }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
