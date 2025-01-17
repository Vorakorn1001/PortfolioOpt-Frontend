import React, { useEffect, useState } from 'react';
import { StockData } from '@/interfaces/stock.interface';

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
    // Check if the stock is already in the portfolio
    const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    const exists = portfolio.some((item: StockData) => item._id === stock._id);
    setIsInPortfolio(exists);
  }, [stock]);

  const handleAdd = () => {
    const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    const updatedPortfolio = [...portfolio, stock];
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));
    setIsInPortfolio(true);
    onChange(updatedPortfolio); // Notify parent about the change
  };

  const handleRemove = () => {
    const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    const updatedPortfolio = portfolio.filter(
      (item: StockData) => item._id !== stock._id
    );
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));
    setIsInPortfolio(false);
    onChange(updatedPortfolio); // Notify parent about the change
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
