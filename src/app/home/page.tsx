'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import StockData from '@/interfaces/stock.interface';
import PortfolioData from '@/interfaces/portfolio.interface';
import AssetsSection from '@/components/AssetsSection';
import FilterSection from '@/components/FilterSection';
import RadarData from '@/interfaces/radar.interface';

const updateAssetsUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/updateAssets';


const Home: React.FC = () => {
    const [sectors, setsectorField] = useState<string[]>([]);
    const [marketCaps, setMarketCap] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const [radarData, setRadarData] = useState<RadarData>(initialRadarData);
    const [assets, setAssets] = useState<StockData[]>([]);
    const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { data: session, status } = useSession();

    // Fetch data from the backend
    const fetchData = useCallback(
        async (
            sectors: string[] = [],
            marketCaps: string[] = [],
            keyword: string = "",
            radarData: RadarData,
            skip: number = 0
        ) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `/stock/`;
        const apiUrl = `${baseUrl}filter?skip=${skip}` + (keyword ? `&keyword=${keyword}` : '') 
        try {
            if (!apiUrl) throw new Error('API URL is not defined');
            setIsLoading(true);
            const payload = {
                sectors: sectors,
                marketCaps: marketCaps,
                radar: radarData.datasets[0].data,
            }
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
    }, []);


    useEffect(() => {
        fetchData(
            sectors,
            marketCaps,
            keyword,
            radarData,
        );
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
            fetchData(
                sectors,
                marketCaps,
                keyword,
                radarData,
                assets.length
            );
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
            console.log('Payload:', payload);
            await axios.post(updateAssetsUrl, payload);
        }
    };

    useEffect(() => {
        setAssets([]);
        setHasMore(true);
        fetchData(sectors, marketCaps, keyword, radarData);
    }, [sectors, marketCaps, keyword, radarData]);

    const onApply = () => {
        console.log("industrialField", sectors);
        console.log("marketCap", marketCaps);
        console.log("keyword", keyword);
        console.log("radarData", radarData.datasets[0].data);
      };

    return (
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <NavBar />
            <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
                <FilterSection 
                    industrialField={sectors}
                    setIndustrialField={setsectorField}
                    marketCap={marketCaps}
                    setMarketCap={setMarketCap}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    radarData={radarData}
                    setRadarData={setRadarData}
                    onApply={onApply}
                />
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


const initialPortfolioData = {
    activePortfolio: 'Portfolio',
    portfolios: {
        Portfolio: {
            assets: [],
            investorViews: [],
        },
    },
}

const initialRadarData = {
    labels: [
        'High Return',
        'Low Volatile',
        'Market Cap.',
        'Beta',
        'Momentum',
    ],
    datasets: [
        {
            label: 'Portfolio Performance',
            data: [3, 3, 3, 3, 3], // Adjusted sample data for 5 steps
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
        },
    ],
  }