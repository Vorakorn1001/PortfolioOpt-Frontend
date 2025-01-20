import React, { useState } from 'react';
import { investorView } from '@/interfaces/view.interface';

interface AddViewPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (view: investorView) => void;
    portfolio: { symbol: string }[]; // Updated prop for dropdown
}

const AddViewPopup: React.FC<AddViewPopupProps> = ({
    isVisible,
    onClose,
    onSave,
    portfolio,
}) => {
    const [view, setView] = useState<investorView>({
        asset1: '',
        asset2: '',
        percentage: '',
        confidence: '',
    });

    if (!isVisible) return null;

    const handleSave = () => {
        onSave({
            asset1: view.asset1,
            asset2: view.asset2 || undefined,
            percentage: view.percentage,
            confidence: view.confidence,
        });
        setView({ asset1: '', asset2: '', percentage: '', confidence: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Investor's View</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block mb-2">Asset 1</label>
                        <select
                            value={view.asset1}
                            onChange={(e) =>
                                setView({ ...view, asset1: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="" disabled>
                                Select Asset 1
                            </option>
                            {portfolio.map((asset) => (
                                <option key={asset.symbol} value={asset.symbol}>
                                    {asset.symbol}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Asset 2 (Optional)</label>
                        <select
                            value={view.asset2}
                            onChange={(e) =>
                                setView({ ...view, asset2: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                        >
                            <option value="">Select Asset 2 (Optional)</option>
                            {portfolio
                                .filter((asset) => asset.symbol !== view.asset1) // Filter out the selected Asset 1
                                .map((asset) => (
                                    <option
                                        key={asset.symbol}
                                        value={asset.symbol}
                                    >
                                        {asset.symbol}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">
                            Expected Return (%)
                        </label>
                        <input
                            type="number"
                            value={view.percentage}
                            onChange={(e) =>
                                setView({ ...view, percentage: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                            placeholder="e.g., 5"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">
                            Confidence Level (%)
                        </label>
                        <input
                            type="number"
                            value={view.confidence}
                            onChange={(e) =>
                                setView({ ...view, confidence: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded-lg"
                            placeholder="e.g., 90"
                        />
                    </div>
                </form>
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddViewPopup;
