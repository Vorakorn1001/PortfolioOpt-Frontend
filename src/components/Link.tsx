import React, { Component } from 'react';
import { Layer } from 'recharts';

const normalColor = '#e0e0e0';
const hoverColor = 'rgba(0, 136, 254, 0.5)';

export default class Link extends Component<any, any> {
    static displayName = 'SankeyLinkDemo';
    state = {
        fill: normalColor,
    };

    render() {
        const {
            sourceX,
            targetX,
            sourceY,
            targetY,
            sourceControlX,
            targetControlX,
            linkWidth,
            index,
        } = this.props;
        const { fill } = this.state;

        return (
            <Layer key={`CustomLink${index}`}>
                <path
                    d={`M${sourceX},${sourceY + linkWidth / 2}
              C${sourceControlX},${sourceY + linkWidth / 2}
               ${targetControlX},${targetY + linkWidth / 2}
               ${targetX},${targetY + linkWidth / 2}
              L${targetX},${targetY - linkWidth / 2}
              C${targetControlX},${targetY - linkWidth / 2}
               ${sourceControlX},${sourceY - linkWidth / 2}
               ${sourceX},${sourceY - linkWidth / 2}
              Z`}
                    fill={fill}
                    strokeWidth="0"
                    onMouseEnter={() => {
                        this.setState({
                            fill: hoverColor,
                        });
                    }}
                    onMouseLeave={() => {
                        this.setState({
                            fill: normalColor,
                        });
                    }}
                />
            </Layer>
        );
    }
}
