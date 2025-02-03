import React from 'react';

interface CreateStockPopupProps {
    isVisible: boolean;
    onCancel: () => void;
    onSave: (name: string) => void;
    newPortfolioName: string;
    setNewPortfolioName: (name: string) => void;
}

const CreateStockPopup: React.FC<CreateStockPopupProps> = ({
    isVisible,
    onCancel,
    onSave,
    newPortfolioName,
    setNewPortfolioName,
}) => {
    if (!isVisible) return null;

    return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white p-5 rounded-lg shadow-lg w-10/12 sm:w-1/2 md:w-1/3 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
            Create New Portfolio
        </h2>
        <input
            type="text"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            placeholder="Enter portfolio name"
            className="w-full p-2 border border-gray-300 rounded mb-4 text-base"
        />
        <div className="flex justify-end space-x-4">
            <button
            onClick={onCancel}
            className="bg-white text-black border-black hover:bg-gray-200 py-2 px-5 rounded-full border-2"
            >
            Cancel
            </button>
            <button
            onClick={() => onSave(newPortfolioName)}
            className="bg-black text-white border-black hover:bg-gray-800 py-2 px-5 rounded-full border-2"
            >
            Done
            </button>
        </div>
        </div>
    </div>
    );
};

export default CreateStockPopup;
