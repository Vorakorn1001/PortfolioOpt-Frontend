import React from 'react';
import investorView from '@/interfaces/view.interface';

interface InvestorsViewSectionProps {
    investorViews: investorView[];
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    onRemoveView: (index: number) => void;
}

const InvestorsViewSection: React.FC<InvestorsViewSectionProps> = ({
    investorViews,
    setShowPopup,
    onRemoveView,
}) => {
    return (
        <section>
            <div className="p-2 bg-white rounded-2xl">
                <div className="bg-white rounded-2xl overflow-hidden p-4">
                    <h1 className="text-xl font-bold mb-4">Investor's View</h1>
                    <div className="my-6"></div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-4xl">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-white text-left">
                                        <th className="px-2 py-1 text-left font-normal text-xs text-gray-500 w-32">
                                            Asset 1
                                        </th>
                                        <th className="px-2 py-1 text-left font-normal text-xs text-gray-500 w-32">
                                            Action
                                        </th>
                                        <th className="px-2 py-1 text-left font-normal text-xs text-gray-500 w-32">
                                            Asset 2
                                        </th>
                                        <th className="px-2 py-1 text-left font-normal text-xs text-gray-500 w-32">
                                            Return
                                        </th>
                                        <th className="px-2 py-1 text-left font-normal text-xs text-gray-500 w-32">
                                            Confident
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investorViews?.length > 0 ? (
                                        investorViews.map((view, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-2 py-1 text-left text-black w-32">
                                                    {view.asset1}
                                                </td>
                                                <td className="px-2 py-1 text-left text-black w-32">
                                                    {view.asset2
                                                        ? 'will outperform'
                                                        : 'will return'}
                                                </td>
                                                <td className="px-2 py-1 text-left text-black w-32">
                                                    {view.asset2 || ''}
                                                </td>
                                                <td className="px-2 py-1 text-left text-black w-32">
                                                    {view.percentage}%
                                                </td>
                                                <td className="px-2 py-1 text-left text-black w-32">
                                                    {view.confidence}%
                                                </td>
                                                <td className="px-2 py-1 text-left w-32">
                                                    <button
                                                        onClick={() => {
                                                            onRemoveView(index);
                                                        }}
                                                        className="bg-white text-black border border-black hover:bg-gray-200 px-2 py-1 rounded-2xl"
                                                        aria-label={`Remove investor view at row ${index + 1}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-2 py-1 text-gray-500 text-center"
                                            >
                                                No investor views available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="flex justify-start mt-4">
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-gray-800"
                                >
                                    Add View
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="my-6"></div>
                </div>
            </div>
        </section>
    );
};

export default InvestorsViewSection;
