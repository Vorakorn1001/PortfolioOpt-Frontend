import { Sankey, Tooltip } from 'recharts';
import Node from './Node';
import Link from './Link';

interface DiversificationProps {
    data: {
        nodes: { name: string }[];
        links: { source: number; target: number; value: number }[];
    };
}

const CustomTooltip = ({ active }: any) => {
    if (active) {
        return null; // Return null to hide the tooltip entirely
    }
    return null;
};

const Diversification: React.FC<DiversificationProps> = ({ data }) => {
    return (
        <div className="p-2 bg-white rounded-2xl" style={{ height: '550px' }}>
            <div className="bg-white rounded-2xl overflow-hidden p-4">
                <h1 className="text-xl font-bold mb-4">Diversification</h1>
                <div className="flex justify-center items-center py-6">
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
                        <Tooltip content={<CustomTooltip />} />
                    </Sankey>
                </div>
            </div>
        </div>
    );
};

export default Diversification;
