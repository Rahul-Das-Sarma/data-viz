import React from "react";
import { LinePath } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

// Define your data types
type DataPoint = {
  name: string;
  value: number;
};

const LineChart: React.FC = ({ aggregatedData, xAxis, yAxis }: any) => {
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

  const handleMouseMove = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    const coords = localPoint(event) || { x: 0, y: 0 };
    const x0 = xScale.invert
      ? xScale.invert(coords.x - margin.left)
      : Math.floor((coords.x - margin.left) / xScale.step());

    const dataPoint = aggregatedData[x0];
    if (dataPoint) {
      showTooltip({
        tooltipData: dataPoint,
        tooltipLeft: xScale(dataPoint.name) + margin.left + 600,
        tooltipTop: yScale(dataPoint.value) + margin.top + 300,
      });
    }
  };

  return (
    <div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Line Path */}
          <LinePath
            data={aggregatedData}
            x={(d) => xScale(d.name) ?? 0}
            y={(d) => yScale(d.value)}
            stroke="#FF6384"
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Transparent Overlay for Tooltip */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />

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
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, backgroundColor: "black", color: "white" }}
        >
          <strong>{tooltipData.name}</strong>
          <div>{`Value: ${tooltipData.value}`}</div>
        </TooltipWithBounds>
      )}
    </div>
  );
};

export default LineChart;
