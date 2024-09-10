import React from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";

// Define your data types
type DataPoint = {
  name: string;
  value: number;
};

// Example data
// const data: DataPoint[] = [
//   { name: "yes", value: 1456 },
//   { name: "no", value: 885 },
// ];

const FunnelChart: React.FC = ({ aggregatedData }: any) => {
  const width = 500;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 60, left: 60 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Define the scales
  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...aggregatedData.map((d) => d.value))],
    range: [0, innerWidth],
    nice: true,
  });

  const yScale = scaleBand<string>({
    domain: aggregatedData.map((d) => d.name),
    range: [0, innerHeight],
    padding: 0.4,
  });

  return (
    <div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Funnel Bars */}
          {aggregatedData.map((point, index) => (
            <Bar
              key={point.name}
              x={0}
              y={yScale(point.name) ?? 0}
              width={xScale(point.value)}
              height={yScale.bandwidth()}
              fill="#FF6384"
              stroke="#FF6384"
              strokeWidth={2}
            />
          ))}

          {/* X Axis */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(value) => `${value}`}
          />

          {/* Y Axis */}
          <AxisLeft scale={yScale} />
        </Group>
      </svg>
    </div>
  );
};

export default FunnelChart;
