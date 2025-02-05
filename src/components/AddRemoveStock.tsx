import React, { useEffect, useState } from 'react';
import StockData from '@/interfaces/stock.interface';

interface AddRemoveButtonProps {
    stock: StockData;
    onChange: (updatedPortfolio: string[]) => void; // Callback to update parent state
}

const AddRemoveButton: React.FC<AddRemoveButtonProps> = ({
    stock,
    onChange,
}) => {
    const [isInPortfolio, setIsInPortfolio] = useState(false);

    useEffect(() => {
        // Check if the stock is already in the active portfolio
        const portfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (
            portfolioData &&
            portfolioData.portfolios[portfolioData.activePortfolio]
        ) {
            const activePortfolio =
                portfolioData.portfolios[portfolioData.activePortfolio].assets;
            
            const exists = activePortfolio.some(
                (item: string) => item === stock.symbol
            );
            setIsInPortfolio(exists);
        }
    }, [stock]);

    const handleAdd = () => {
        const portfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (portfolioData) {
            const activePortfolioName = portfolioData.activePortfolio;
            const activePortfolio =
                portfolioData.portfolios[activePortfolioName].assets;

            const updatedPortfolio = [...activePortfolio, stock.symbol];
            
            portfolioData.portfolios[activePortfolioName].assets =
            updatedPortfolio;

            localStorage.setItem(
                'portfolioData',
                JSON.stringify(portfolioData)
            );
            setIsInPortfolio(true);
            onChange(updatedPortfolio); // Notify parent about the change
        }
    };

    const handleRemove = () => {
        const portfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (portfolioData) {
            const activePortfolioName = portfolioData.activePortfolio;
            const activePortfolio =
                portfolioData.portfolios[activePortfolioName].assets;

            const updatedPortfolio = activePortfolio.filter(
                (item: string) => item !== stock.symbol
            );

            portfolioData.portfolios[activePortfolioName].assets = updatedPortfolio;

            localStorage.setItem(
                'portfolioData',
                JSON.stringify(portfolioData)
            );
            setIsInPortfolio(false);
            onChange(updatedPortfolio);
        }
    };

    return (
        <button
            className={`w-20 h-8 p-1 rounded-full transition-colors duration-300 border ${
                isInPortfolio
                    ? 'bg-white text-black border-black hover:bg-gray-200'
                    : 'bg-black text-white border-white hover:bg-gray-800'
            }`}
            onClick={isInPortfolio ? handleRemove : handleAdd}
        >
            {isInPortfolio ? 'Remove' : 'Add'}
        </button>
    );
};

export default AddRemoveButton;
