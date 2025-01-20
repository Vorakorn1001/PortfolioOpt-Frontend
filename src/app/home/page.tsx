'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import StockData from '@/interfaces/stock.interface';
import InvestorView from '@/interfaces/view.interface';
import PortfolioData from '@/interfaces/portfolio.interface';
import AssetsSection from '@/components/AssetsSection';
import { useSession } from 'next-auth/react';

const updateAssetsUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updateAssets';


const Home: React.FC = () => {
    const [assets, setAssets] = useState<StockData[]>([]);
    const [portfolioData, setPortfolioData] = useState<PortfolioData>({
        activePortfolio: 'Portfolio',
        portfolios: {
            Portfolio: {
                assets: [],
                investorViews: [],
            },
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { data: session, status } = useSession();

    // Fetch data from the backend
    const fetchData = useCallback(async (length: number = 0) => {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `/stock/${length}`;
        try {
            if (!apiUrl) throw new Error('API URL is not defined');
            setIsLoading(true);
            const response = await axios.get(apiUrl);

            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setAssets((prevAssets) => {
                    const existingIds = prevAssets.map((asset) => asset.id); // Extract existing _id's
                    const newAssets = response.data.filter(
                        (asset: { id: string }) =>
                            !existingIds.includes(asset.id)
                    ); // Filter out existing assets
                    return [...prevAssets, ...newAssets]; // Merge new assets without duplicates
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (savedPortfolioData) {
            setPortfolioData(savedPortfolioData);
        } else {
            // Save default portfolio structure to localStorage
            localStorage.setItem(
                'portfolioData',
                JSON.stringify({
                    activePortfolio: 'Portfolio',
                    portfolios: {
                        Portfolio: {
                            assets: [],
                            investorViews: [],
                        },
                    },
                })
            );
        }
    }, [fetchData]);

    // Handle scroll with a threshold and debounce
    const handleScroll = useCallback(() => {
        const threshold = 300;
        const scrolledToBottom =
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - threshold;

        if (scrolledToBottom && hasMore && !isLoading) {
            fetchData(assets.length);
        }
    }, [assets.length, fetchData, hasMore, isLoading]);

    useEffect(() => {
        const debounceScroll = () => {
            let timer: NodeJS.Timeout;
            return () => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(handleScroll, 150);
            };
        };

        const debouncedHandleScroll = debounceScroll();

        window.addEventListener('scroll', debouncedHandleScroll);
        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        };
    }, [handleScroll]);

    const handlePortfolioChange = async (updatedPortfolio: StockData[]) => {
        const activePortfolioName = portfolioData.activePortfolio;

        setPortfolioData((prevPortfolioData) => {
            const updatedPortfolios = {
                ...prevPortfolioData.portfolios,
                [activePortfolioName]: {
                    ...prevPortfolioData.portfolios[activePortfolioName],
                    assets: updatedPortfolio,
                },
            };
            const newPortfolioData = {
                ...prevPortfolioData,
                portfolios: updatedPortfolios,
            };
            localStorage.setItem(
                'portfolioData',
                JSON.stringify(newPortfolioData)
            );
            return newPortfolioData;
        });

        // Send updated portfolio data to the backend
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
                portfolio: updatedPortfolio,
            };
            await axios.post(updateAssetsUrl, payload);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <NavBar />
            <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
                <h1 className="text-2xl font-bold">Stocks</h1>
                <AssetsSection
                    portfolio={assets}
                    excludeFields={[
                        'price',
                        'priorReturn',
                        'posteriorReturn',
                        'industry',
                    ]}
                    handlePortfolioChange={handlePortfolioChange}
                />
                {isLoading && (
                    <p className="text-center mt-4">Loading more data...</p>
                )}
                {!hasMore && (
                    <p className="text-center mt-4">No more data to load.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
