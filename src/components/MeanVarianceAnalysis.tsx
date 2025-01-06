import { Scatter } from 'react-chartjs-2';

const MeanVarianceAnalysis = () => {
  const data = {
    datasets: [
      {
        label: 'Mean-Variance',
        data: Array.from({ length: 1000 }, () => ({
          x: Math.random() * 0.2,
          y: Math.random() * 0.2,
          r: Math.random() * 10,
        })),
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
    ],
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold">Mean-Variance Analysis</h2>
      <Scatter data={data} />
    </div>
  );
};

export default MeanVarianceAnalysis;
