import React from 'react';
import { investorView } from '@/interfaces/view.interface';

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
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Investor's View</h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">Asset 1</th>
            <th className="px-4 py-2 border-b">Action</th>
            <th className="px-4 py-2 border-b">Asset 2</th>
            <th className="px-4 py-2 border-b">Return</th>
            <th className="px-4 py-2 border-b">Confident</th>
            <th className="px-4 py-2 border-b">Remove</th>
          </tr>
        </thead>
        <tbody>
          {investorViews?.length > 0 ? (
            investorViews.map((view, index) => (
              <tr key={index} className="hover:bg-gray-100 text-center">
                <td className="px-4 py-2 border-b">{view.asset1}</td>
                <td className="px-4 py-2 border-b">
                  {view.asset2 ? 'will outperform' : 'will return'}
                </td>
                <td className="px-4 py-2 border-b">{view.asset2 || '-'}</td>
                <td className="px-4 py-2 border-b">{view.percentage}%</td>
                <td className="px-4 py-2 border-b">{view.confidence}%</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                      // if (confirm(`Are you sure you want to remove this view?`)) {
                      onRemoveView(index);
                      // }
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    aria-label={`Remove investor view at row ${index + 1}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-2 text-gray-500 text-center">
                No investor views available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
      >
        + Add View
      </button>
    </section>
  );
};

export default React.memo(InvestorsViewSection);
