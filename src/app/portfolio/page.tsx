'use client';

import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useMediaQuery } from '@/utils/helper';
import { useSession } from 'next-auth/react';

import StockData from '@/interfaces/stock.interface';
import InvestorView from '@/interfaces/view.interface';
import Limit from '@/interfaces/limit.interface';

import PortfolioSelectionSection from '@/components/PortfolioSelectionSection';
import AssetsSection from '@/components/AssetsSection';
import CorrelationMatrixSection from '@/components/CorrelationMatrixSection';
import InvestorsViewSection from '@/components/InvestorsViewSection';
import ConstraintSection from '@/components/ConstraintSection';
import AddViewPopup from '@/components/AddViewPopup';
import CreateStockPopup from '@/components/CreateStockPopup';
import NavBar from '@/components/NavBar';

interface portfolioAndInvestorViews {
    assets: StockData[];
    investorViews: InvestorView[];
}

const Portfolio: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [sliderValue, setSliderValue] = useState(7);
    const [selectedMetric, setSelectedMetric] = useState('return');
    const [showPopup, setShowPopup] = useState(false);
    const [validPortfolio, setValidPortfolio] = useState(true);
    const [stocksOrder, setStocksOrder] = useState<string[]>([]);
    const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
    const [showPortfolio, setShowPortfolio] = useState<StockData[]>([]);
    const [portfolioAndInvestorViews, setPortfolioAndInvestorViews] =
        useState<portfolioAndInvestorViews>(initialPortfolioAndInvestorViews);
    const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
    const [limits, setLimits] = useState<Limit>(initialLimit);
    const [portfolios, setPortfolios] = useState<string[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');

    const PortfolioUrl = '/api/backend/portfolio/init';
    const uploadIBKRUrl = '/api/backend/ibkr/upload';
    const updatePortfolioUrl = '/api/backend/user/updatePortfolio';
    const deletePortfolioUrl = '/api/backend/user/deletePortfolio';
    const updateActivePortfolioUrl = '/api/backend/user/updateActivePortfolio';

    const { data: session, status } = useSession();

    const isMobile = useMediaQuery('(max-width: 767px)');

    useEffect(() => {
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (!savedPortfolioData) return;
        const activePortfolioName = savedPortfolioData.activePortfolio;
        if (!activePortfolioName) return;

        const activePortfolio =
            savedPortfolioData.portfolios[activePortfolioName]?.assets || [];
        const savedInvestorViews =
            savedPortfolioData.portfolios[activePortfolioName]?.investorViews ||
            [];

        const portAndView = {
            assets: activePortfolio,
            investorViews: savedInvestorViews,
        };

        if (hasConflictingViews(portAndView)) {
            portAndView.investorViews = getNonConflictingViews(portAndView);
            updatePortfolio(portAndView, activePortfolioName);
        }

        setSelectedPortfolio(activePortfolioName);
        setPortfolios(Object.keys(savedPortfolioData.portfolios));
        setPortfolioAndInvestorViews(portAndView);
        setIsInitialFetchDone(true);

        if (activePortfolio.length < 2) {
            setValidPortfolio(false);
        }
    }, []);

    const getNonConflictingViews = (portfolio: portfolioAndInvestorViews) => {
        const views = portfolio.investorViews;
        const assets = portfolio.assets;
        const symbols = assets.map((stock) => stock.symbol);
        return views.filter(
            (view) =>
                symbols.includes(view.asset1) &&
                (!view.asset2 || symbols.includes(view.asset2))
        );
    };

    const hasConflictingViews = (portfolio: portfolioAndInvestorViews) => {
        const views = portfolio.investorViews;
        const assets = portfolio.assets;
        const symbols = assets.map((stock) => stock.symbol);
        return views.some(
            (view) =>
                !symbols.includes(view.asset1) ||
                (view.asset2 && !symbols.includes(view.asset2))
        );
    };

    const updatePortfolio = async (
        portfolio: portfolioAndInvestorViews,
        activePortfolio: string
    ) => {
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );
        if (!savedPortfolioData) return;
        // const activePortfolioName = savedPortfolioData.activePortfolio;
        // if (!activePortfolioName) return;

        portfolio.investorViews = getNonConflictingViews(portfolio);

        // Update the active portfolio in localStorage
        savedPortfolioData.portfolios[activePortfolio] = portfolio;
        localStorage.setItem(
            'portfolioData',
            JSON.stringify(savedPortfolioData)
        );

        // send update portfolioData to the backend
        if (status === 'authenticated') {
            // Send UserData, ActivePortfolio, and PortfolioData of that Portfolio
            const userData = {
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
                activePortfolio: activePortfolio,
            };
            const payload = {
                user: userData,
                portfolio: portfolio,
            };
            // console.log("Update Payload", payload);
            await axios.post(updatePortfolioUrl, payload);
        }
    };

    // portfolioAndInvestorViews listener
    // Save the active portfolio's investorViews in localStorage and update the portfolio data
    useEffect(() => {
        if (!isInitialFetchDone) return;
        // console.log("PortfolioAndInvestorViews", portfolioAndInvestorViews);
        const saveActivePortfolio = async () => {
            updatePortfolio(portfolioAndInvestorViews, selectedPortfolio);

            if (portfolioAndInvestorViews.assets.length < 2) {
                // console.log("Portfolio", portfolioAndInvestorViews.assets);
                setShowPortfolio(portfolioAndInvestorViews.assets);
                setValidPortfolio(false);
                return;
            } else {
                setValidPortfolio(true);
            }

            try {
                const response = await axios.post(PortfolioUrl, {
                    stocks: portfolioAndInvestorViews.assets.map(
                        (stock) => stock.symbol
                    ),
                    investorViews: portfolioAndInvestorViews.investorViews,
                });

                const stocksOrder = response.data.stocks;
                const correlationMatrix = response.data.correlationMatrix;
                const priorReturns = response.data.priorReturns;
                const posteriorReturns = response.data.posteriorReturns;
                const responseLimits = response.data.limits;
                setStocksOrder(stocksOrder);
                setCorrelationMatrix(correlationMatrix);
                setLimits(responseLimits);
                setSliderValue(
                    selectedMetric === 'return'
                        ? responseLimits.minReturn
                        : responseLimits.minVolatility
                );

                const enrichedPortfolio: StockData[] = stocksOrder.map(
                    (symbol: string, index: number) => {
                        const stock = portfolioAndInvestorViews.assets.find(
                            (s) => s.symbol === symbol
                        );
                        return {
                            ...stock,
                            priorReturn: priorReturns[index],
                            posteriorReturn: posteriorReturns[index],
                        };
                    }
                );
                setShowPortfolio(enrichedPortfolio);
            } catch (error) {
                console.error('Error fetching updated portfolio data:', error);
            }
        };
        saveActivePortfolio();
    }, [portfolioAndInvestorViews]);

    // selectedPortfolio listener
    useEffect(() => {
        if (!isInitialFetchDone) return;
        // console.log("SelectedPortfolio", selectedPortfolio);
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );
        if (!savedPortfolioData) return;
        // console.log("Save", savedPortfolioData.portfolios[selectedPortfolio]);
        setPortfolioAndInvestorViews(
            savedPortfolioData.portfolios[selectedPortfolio]
        );
    }, [selectedPortfolio]);

    const handlePortfolioChange = async (updatedPortfolio: StockData[]) => {
        const updatedPortfolioAndInvestorViews = {
            assets: updatedPortfolio,
            investorViews: portfolioAndInvestorViews.investorViews,
        };
        setPortfolioAndInvestorViews(updatedPortfolioAndInvestorViews);
        if (updatedPortfolio.length < 2) {
            setValidPortfolio(false);
            return;
        }
    };

    const handleAddView = (newView: InvestorView) => {
        const updatedViews = [
            ...portfolioAndInvestorViews.investorViews,
            newView,
        ];
        setPortfolioAndInvestorViews({
            assets: portfolioAndInvestorViews.assets,
            investorViews: updatedViews,
        });
    };

    const handleRemoveView = (index: number) => {
        const updatedViews = portfolioAndInvestorViews.investorViews.filter(
            (_, i) => i !== index
        );
        setPortfolioAndInvestorViews({
            assets: portfolioAndInvestorViews.assets,
            investorViews: updatedViews,
        });
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
            fileInputRef.current.click();
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
            }
        } catch (error) {
            console.error('Error uploading IBKR file:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePortfolio = async () => {
        if (portfolios.length <= 1) {
            alert('Cannot delete the only portfolio.');
            return;
        }
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || '{}'
        );

        delete savedPortfolioData.portfolios[selectedPortfolio];
        const newActivePortfolio = Object.keys(
            savedPortfolioData.portfolios
        )[0];

        if (status === 'authenticated') {
            await axios.post(
                deletePortfolioUrl + '?portfolioName=' + selectedPortfolio,
                {
                    name: session.user?.name,
                    email: session.user?.email,
                    image: session.user?.image,
                    activePortfolio: newActivePortfolio,
                }
            );
        }
        savedPortfolioData.activePortfolio = newActivePortfolio;
        localStorage.setItem(
            'portfolioData',
            JSON.stringify(savedPortfolioData)
        );

        setPortfolios(Object.keys(savedPortfolioData.portfolios));
        setSelectedPortfolio(newActivePortfolio);
        setPortfolioAndInvestorViews(
            savedPortfolioData.portfolios[newActivePortfolio]
        );
    };

    const handlePortfolioSelect = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selected = e.target.value;
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || '{}'
        );
        savedPortfolioData.activePortfolio = selected;
        localStorage.setItem(
            'portfolioData',
            JSON.stringify(savedPortfolioData)
        );
        if (status === 'authenticated') {
            await axios.post(updateActivePortfolioUrl, {
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
                activePortfolio: selected,
            });
        }
        setSelectedPortfolio(selected);
        setPortfolioAndInvestorViews(savedPortfolioData.portfolios[selected]);
    };

    const [showCreatePortfolioPopup, setShowCreatePortfolioPopup] =
        useState(false);
    const [newPortfolioName, setNewPortfolioName] = useState('');

    const handleCreatePortfolio = async () => {
        setShowCreatePortfolioPopup(true);
    };

    const handleSaveNewPortfolio = async () => {
        if (newPortfolioName) {
            const savedPortfolioData = JSON.parse(
                localStorage.getItem('portfolioData') || '{}'
            );
            savedPortfolioData.portfolios = savedPortfolioData.portfolios || {};
            savedPortfolioData.portfolios[newPortfolioName] = {
                assets: [],
                investorViews: [],
            };
            savedPortfolioData.activePortfolio = newPortfolioName;
            localStorage.setItem(
                'portfolioData',
                JSON.stringify(savedPortfolioData)
            );
            setPortfolios(Object.keys(savedPortfolioData.portfolios));
            setSelectedPortfolio(newPortfolioName);
            setPortfolioAndInvestorViews(
                savedPortfolioData.portfolios[newPortfolioName]
            );
            setShowCreatePortfolioPopup(false);
            setNewPortfolioName('');
        }
    };

    const handleCancelCreatePortfolio = () => {
        setShowCreatePortfolioPopup(false);
        setNewPortfolioName('');
    };

    return (
        <div
            className="bg-gray-100 min-h-screen w-full text-black"
            suppressHydrationWarning
        >
            <NavBar />
            <div className="px-4 sm:px-0">
                <div className="w-full max-w-screen-lg mx-auto bg-transparent min-h-screen">
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <div>
                        <PortfolioSelectionSection
                            portfolios={portfolios}
                            selectedPortfolio={selectedPortfolio}
                            handlePortfolioSelect={handlePortfolioSelect}
                            handleCreatePortfolio={handleCreatePortfolio}
                            handleDeletePortfolio={handleDeletePortfolio}
                            handleButtonClick={handleButtonClick}
                            uploading={uploading}
                        />

                        <div className="my-2"></div>

                        <AssetsSection
                            portfolio={showPortfolio}
                            excludeFields={
                                isMobile
                                    ? [
                                          'price',
                                          'sector',
                                          'industry',
                                          'name',
                                          'ytdReturn',
                                          'annual3YrsReturn',
                                          'volatility',
                                          'momentum',
                                          'beta',
                                          'annualReturn',
                                      ]
                                    : [
                                          'price',
                                          'industry',
                                      ]
                            }
                            handlePortfolioChange={handlePortfolioChange}
                        />

                        {validPortfolio ? (
                            <>
                                <div className="my-2"></div>

                                <CorrelationMatrixSection
                                    correlationMatrix={correlationMatrix}
                                    stocksOrder={stocksOrder}
                                />

                                <div className="my-2"></div>

                                <InvestorsViewSection
                                    investorViews={
                                        portfolioAndInvestorViews.investorViews
                                    }
                                    setShowPopup={setShowPopup}
                                    onRemoveView={handleRemoveView}
                                />

                                <div className="my-2"></div>

                                <ConstraintSection
                                    limits={limits}
                                    selectedMetric={selectedMetric}
                                    setSelectedMetric={setSelectedMetric}
                                    sliderValue={sliderValue}
                                    setSliderValue={setSliderValue}
                                    handleOptimize={handleOptimize}
                                />
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
                            portfolio={portfolioAndInvestorViews.assets.map(
                                (stock) => ({
                                    symbol: stock.symbol,
                                })
                            )}
                        />
                        <CreateStockPopup
                            isVisible={showCreatePortfolioPopup}
                            onCancel={handleCancelCreatePortfolio}
                            onSave={handleSaveNewPortfolio}
                            newPortfolioName={newPortfolioName}
                            setNewPortfolioName={setNewPortfolioName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;

const initialLimit: Limit = {
    minReturn: 0,
    maxReturn: 100,
    minVolatility: 0,
    maxVolatility: 100,
};

const initialPortfolioAndInvestorViews: portfolioAndInvestorViews = {
    assets: [],
    investorViews: [],
};
