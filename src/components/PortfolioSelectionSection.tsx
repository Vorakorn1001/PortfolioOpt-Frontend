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
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 bg-white p-4 rounded-2xl">
            {/* Portfolio Dropdown */}
            <div className="relative inline-block w-full md:w-64 mb-2 md:mb-0">
                <select
                    value={selectedPortfolio}
                    onChange={handlePortfolioSelect}
                    className="block appearance-none w-full border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-lg font-bold"
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
            <div className="w-full md:w-auto flex flex-col md:flex-row justify-end items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex w-full md:w-auto space-x-2 md:space-x-4">
                    <button
                        onClick={handleCreatePortfolio}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex-1 md:flex-none w-full md:w-[160px] h-10 text-center"
                    >
                        <b>Create Portfolio</b>
                    </button>
                    <button
                        onClick={handleDeletePortfolio}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex-1 md:flex-none w-full md:w-[160px] h-10 text-center"
                        disabled={portfolios.length <= 1}
                    >
                        <b>Delete Portfolio</b>
                    </button>
                </div>

                <div className="flex w-full md:w-auto md:ml-4">
                    <button
                        onClick={handleButtonClick}
                        disabled={uploading}
                        className="bg-black text-white py-2 px-2 rounded-lg hover:bg-gray-800 flex-1 md:flex-none w-full md:w-[160px] h-10 text-center"
                    >
                        <b>Import IBKR CSV</b>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioSelectionSection;
