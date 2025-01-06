import React from 'react';
import { investorView } from '@/interfaces/view.interface';

interface InvestorsViewSectionProps {
  investorViews: investorView[];
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const InvestorsViewSection: React.FC<InvestorsViewSectionProps> = ({
  investorViews,
  setShowPopup,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Investor's View</h2>
      <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg text-center mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b">Asset 1</th>
            <th className="px-4 py-2 border-b">Action</th>
            <th className="px-4 py-2 border-b">Asset 2</th>
            <th className="px-4 py-2 border-b">Return</th>
            <th className="px-4 py-2 border-b">Confident</th>
          </tr>
        </thead>
        <tbody>
          {investorViews.map((view, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b">{view.asset1}</td>
              <td className="px-4 py-2 border-b">
                {view.asset2 ? 'will outperform' : 'will return'}
              </td>
              <td className="px-4 py-2 border-b">{view.asset2 || '-'}</td>
              <td className="px-4 py-2 border-b">{view.percentage}%</td>
              <td className="px-4 py-2 border-b">{view.confident}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        + Add View
      </button>
    </section>
  );
};

export default InvestorsViewSection;
