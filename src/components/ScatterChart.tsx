import React, { useState } from "react";
import { Circle } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

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

const ScatterPlot: React.FC = ({ aggregatedData }: any) => {
  const width = 500;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 60, left: 60 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Define the scales
  const xScale = scaleBand<string>({
    domain: aggregatedData.map((d) => d.name),
    range: [0, innerWidth],
    padding: 0.3,
  });

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...aggregatedData.map((d) => d.value))],
    range: [innerHeight, 0],
    nice: true,
  });

  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<DataPoint>();

  return (
    <div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Scatter Plot Circles */}
          {aggregatedData.map((point) => (
            <Circle
              key={point.name}
              cx={xScale(point.name) ?? 0}
              cy={yScale(point.value)}
              r={5}
              fill="#FF6384"
              stroke="#FF6384"
              strokeWidth={2}
              onMouseMove={(event) => {
                const coords = localPoint(event) || { x: 0, y: 0 };
                showTooltip({
                  tooltipData: point,
                  tooltipLeft: coords.x,
                  tooltipTop: coords.y,
                });
              }}
              onMouseLeave={hideTooltip}
            />
          ))}

          {/* X Axis */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(name) => name ?? ""}
          />

          {/* Y Axis */}
          <AxisLeft scale={yScale} />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop + 300}
          left={tooltipLeft + 400}
          style={{ ...defaultStyles, backgroundColor: "black", color: "white" }}
        >
          <strong>{tooltipData.name}</strong>
          <div>{`Value: ${tooltipData.value}`}</div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

export default ScatterPlot;
