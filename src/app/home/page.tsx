'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import StockData from '@/interfaces/stock.interface';
import AssetsSection from '@/components/AssetsSection';
import FilterSection from '@/components/FilterSection';
import RadarData from '@/interfaces/radar.interface';
import { useMediaQuery } from '@/utils/helper';

const fetchDataUrl = '/api/backend/stock/';
const updateAssetsUrl = '/api/backend/user/updateAssets';

const Home: React.FC = () => {
    const [sectors, setsectorField] = useState<string[]>([]);
    const [marketCaps, setMarketCap] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [radarData, setRadarData] = useState<RadarData>(initialRadarData);
    const [assets, setAssets] = useState<StockData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { data: session, status } = useSession();

    const isMobile = useMediaQuery('(max-width: 767px)');
    const [excludeFields, setExcludeFields] = useState<string[]>(['price', 'priorReturn', 'posteriorReturn', 'industry']);

    useEffect(() => {
        if (isMobile) {
            setExcludeFields(['price', 'industry', 'priorReturn', 'posteriorReturn', 'name', 'ytdReturn', 'annual3YrsReturn', 'volatility', 'momentum', 'beta', 'annualReturn']);
        } else {
            setExcludeFields(['price', 'priorReturn', 'posteriorReturn', 'industry']);
        }
    }, [isMobile]);

    // Fetch data from the backend
    const fetchData = useCallback(
        async (
            sectors: string[] = [],
            marketCaps: string[] = [],
            keyword: string = '',
            radarData: RadarData,
            skip: number = 0
        ) => {
            const apiUrl =
                `${fetchDataUrl}filter?skip=${skip}` +
                (keyword ? `&keyword=${keyword}` : '');
            try {
                if (!apiUrl) throw new Error('API URL is not defined');
                setIsLoading(true);
                const payload = {
                    sectors: sectors,
                    marketCaps: marketCaps,
                    radar: radarData.datasets[0].data,
                };
                const response = await axios.post(apiUrl, payload);
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
        },
        []
    );

    useEffect(() => {
        fetchData(sectors, marketCaps, keyword, radarData);
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (!savedPortfolioData) {
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
            fetchData(sectors, marketCaps, keyword, radarData, assets.length);
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
        const savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );
        if (!savedPortfolioData) return;
        const activePortfolioName = savedPortfolioData.activePortfolio;
        if (!activePortfolioName) return;

        // Update local storage
        const updatedPortfolioData = {
            ...savedPortfolioData.portfolios,
            [activePortfolioName]: {
                ...savedPortfolioData.portfolios[activePortfolioName],
                assets: updatedPortfolio,
            },
        };
        const newPortfolioData = {
            ...savedPortfolioData,
            portfolios: updatedPortfolioData,
        };
        localStorage.setItem('portfolioData', JSON.stringify(newPortfolioData));

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
                portfolio: updatedPortfolio,
            };
            await axios.post(updateAssetsUrl, payload);
        }
    };

    useEffect(() => {
        setAssets([]);
        setHasMore(true);
        fetchData(sectors, marketCaps, keyword, radarData);
    }, [sectors, marketCaps, keyword, radarData]);

    return (
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <NavBar />
            <div className="px-4 sm:px-0">
                <div className="w-full max-w-screen-lg mx-auto bg-transparent min-h-screen py-4">
                    <FilterSection
                        industrialField={sectors}
                        setIndustrialField={setsectorField}
                        marketCap={marketCaps}
                        setMarketCap={setMarketCap}
                        keyword={keyword}
                        setKeyword={setKeyword}
                        radarData={radarData}
                        setRadarData={setRadarData}
                    />
                    <div className="my-2"></div>
                    <AssetsSection
                        portfolio={assets}
                        excludeFields={excludeFields}
                        handlePortfolioChange={handlePortfolioChange}
                    />
                    {isLoading && (
                        <p className="text-center mt-4">Loading more data...</p>
                    )}
                    {!hasMore && (
                        <p className="text-center mt-4">
                            No more data to load.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;

const initialRadarData = {
    labels: ['High Return', 'Low Volatile', 'Market Cap.', 'Beta', 'Momentum'],
    datasets: [
        {
            label: 'Portfolio Performance',
            data: [3, 3, 3, 3, 3], // Adjusted sample data for 5 steps
            backgroundColor: 'rgba(211,211,211,0.2)', // Bright grey background color
            borderColor: 'rgba(211,211,211,1)', // Bright grey border color
            borderWidth: 2,
        },
    ],
};
