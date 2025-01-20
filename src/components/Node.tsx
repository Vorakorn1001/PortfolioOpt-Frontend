import React from 'react';
import { Rectangle, Layer } from 'recharts';

export default function Node({
    x,
    y,
    width,
    height,
    index,
    payload,
    containerWidth,
}: any) {
    const isOut = x + width + 6 > containerWidth;
    return (
        <Layer key={`CustomNode${index}`}>
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#5192ca"
                fillOpacity="1"
            />
            <text
                textAnchor={isOut ? 'end' : 'start'}
                x={isOut ? x - 6 : x + width + 6}
                y={y + height / 2}
                fontSize="14"
                stroke="#333"
            >
                {payload.name}
            </text>
            {/* Remove or update the second text element */}
        </Layer>
    );
}
