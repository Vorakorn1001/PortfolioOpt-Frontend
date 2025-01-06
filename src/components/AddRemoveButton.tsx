import React, { useEffect, useState } from 'react';
import { homePageStockData } from '@/interfaces/stock.interface';

interface AddRemoveButtonProps {
  stock: homePageStockData;
  onChange: (updatedPortfolio: homePageStockData[]) => void; // Callback to update parent state
}

const AddRemoveButton: React.FC<AddRemoveButtonProps> = ({
  stock,
  onChange,
}) => {
  const [isInPortfolio, setIsInPortfolio] = useState(false);

  useEffect(() => {
    // Check if the stock is already in the portfolio
    const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    const exists = portfolio.some(
      (item: homePageStockData) => item._id === stock._id
    );
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
      (item: homePageStockData) => item._id !== stock._id
    );
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));
    setIsInPortfolio(false);
    onChange(updatedPortfolio); // Notify parent about the change
  };

  return isInPortfolio ? (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
      onClick={handleRemove}
    >
      Remove from Portfolio
    </button>
  ) : (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
      onClick={handleAdd}
    >
      Add to Portfolio
    </button>
  );
};

export default AddRemoveButton;
