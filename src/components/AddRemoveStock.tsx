import React, { useEffect, useState } from 'react';
import StockData from '@/interfaces/stock.interface';

interface AddRemoveButtonProps {
    stock: StockData;
    onChange: (updatedPortfolio: StockData[]) => void; // Callback to update parent state
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
                (item: StockData) => item.id === stock.id
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

            const updatedPortfolio = [...activePortfolio, stock];
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
                (item: StockData) => item.id !== stock.id
            );
            portfolioData.portfolios[activePortfolioName].assets =
                updatedPortfolio;

            localStorage.setItem(
                'portfolioData',
                JSON.stringify(portfolioData)
            );
            setIsInPortfolio(false);
            onChange(updatedPortfolio); // Notify parent about the change
        }
    };

    return (
        <button
            className={`w-48 h-16 px-4 py-2 rounded text-white transition-colors duration-300 ${
                isInPortfolio
                    ? 'bg-red-500 hover:bg-red-400'
                    : 'bg-blue-500 hover:bg-blue-400'
            }`}
            onClick={isInPortfolio ? handleRemove : handleAdd}
        >
            {isInPortfolio ? 'Remove from Portfolio' : 'Add to Portfolio'}
        </button>
    );
};

export default AddRemoveButton;
