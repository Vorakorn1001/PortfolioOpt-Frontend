import { Sankey, Tooltip } from 'recharts';
import Node from './Node';
import Link from './Link';

interface DiversificationProps {
  data: {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
  };
}

const Diversification: React.FC<DiversificationProps> = ({ data }) => {
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
