import React from "react";
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

const ScatterPlot: React.FC = ({ aggregatedData, xAxis, yAxis }: any) => {
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
              fill="#3943c5"
              stroke="#3943c5"
              strokeWidth={2}
              onMouseMove={(event) => {
                const coords = localPoint(event) || { x: 0, y: 0 };
                showTooltip({
                  tooltipData: point,
                  tooltipLeft: coords.x + 100,
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
          {/* X Axis Label */}
          <text
            x={innerWidth / 2}
            y={innerHeight + 40} // Adjust position below x-axis
            textAnchor="middle"
            fontSize={12}
            fill="black"
          >
            {xAxis}
          </text>

          {/* Y Axis */}
          <AxisLeft scale={yScale} />

          {/* Y Axis Label */}
          <text
            x={-innerHeight / 2} // Position along the y-axis, rotating later
            y={-50} // Adjust position left of y-axis
            textAnchor="middle"
            transform="rotate(-90)" // Rotate the text to be vertical
            fontSize={12}
            fill="black"
          >
            {yAxis}
          </text>
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
