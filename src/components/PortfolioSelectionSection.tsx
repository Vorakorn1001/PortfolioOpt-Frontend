import React from 'react';

interface PortfolioSelectionProps {
    selectedPortfolio: string;
    portfolios: string[];
    handlePortfolioSelect: (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    handleCreatePortfolio: () => void;
    handleDeletePortfolio: () => void;
    handleButtonClick: () => void;
    uploading: boolean;
}

const PortfolioSelectionSection: React.FC<PortfolioSelectionProps> = ({
    selectedPortfolio,
    portfolios,
    handlePortfolioSelect,
    handleCreatePortfolio,
    handleDeletePortfolio,
    handleButtonClick,
    uploading,
}) => {
    return (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-2xl">
            {/* Portfolio Dropdown */}
            <div className="relative inline-block w-64">
                <select
                    value={selectedPortfolio}
                    onChange={handlePortfolioSelect}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    style={{
                        background: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    {portfolios.map((portfolioName) => (
                        <option key={portfolioName} value={portfolioName}>
                            {portfolioName}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                </div>
            </div>

            {/* Button Group */}
            <div className="flex justify-end items-center space-x-4">
                <button
                    onClick={handleCreatePortfolio}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                    style={{
                        fontSize: '14px',
                        width: '175px',
                        height: '40px',
                    }}
                >
                    <b>Create Portfolio</b>
                </button>
                <button
                    onClick={handleDeletePortfolio}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    disabled={portfolios.length <= 1}
                    style={{
                        fontSize: '14px',
                        width: '175px',
                        height: '40px',
                    }}
                >
                    <b>Delete Portfolio</b>
                </button>
                <button
                    onClick={handleButtonClick}
                    disabled={uploading}
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                    style={{
                        fontSize: '14px',
                        width: '175px',
                        height: '40px',
                    }}
                >
                    <b>Upload IBKR CSV File</b>
                </button>
            </div>
        </div>
    );
};

export default PortfolioSelectionSection;
