import { Sankey, Tooltip } from 'recharts';
import Node from './Node';
import Link from './Link';

const data = {
  nodes: [
    { name: 'Portfolio 100%' },
    { name: 'Place Holder-1' },
    { name: 'Place Holder-2' },
    { name: 'Place Holder-3' },
    // Add more nodes
  ],
  links: [
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 2, value: 1 },
    { source: 0, target: 3, value: 1 },
    // Add more links
  ],
};

const Diversification = () => {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold text-black">Diversification</h2>
      <Sankey
        width={400}
        height={400}
        data={data}
        nodeWidth={10}
        nodePadding={60}
        linkCurvature={0.61}
        iterations={64}
        link={<Link />}
        node={<Node containerWidth={400} />}
      >
        <Tooltip />
      </Sankey>
    </div>
  );
};

export default Diversification;
