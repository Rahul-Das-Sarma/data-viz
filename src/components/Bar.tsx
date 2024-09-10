import React, { useState } from "react";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";

type DataPoint = {
  name: string;
  value: number;
};

const BarChart: React.FC = ({ aggregatedData, xAxis, yAxis }: any) => {
  const width = 500;
  const height = 350;
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };

  // Define the scales
  const xScale = scaleBand<string>({
    domain: aggregatedData.map((d: any) => d.name),
    range: [0, width - margin.left - margin.right],
    padding: 0.3,
  });

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...aggregatedData.map((d: any) => d.value))],
    range: [height - margin.top - margin.bottom, 0],
  });

  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<DataPoint>();
  const [hoveredBar, setHoveredBar] = useState<any | null>(null);

  const handleMouseOver = (
    event: React.MouseEvent<SVGRectElement>,
    datum: DataPoint
  ) => {
    const coords = localPoint(event) || { x: 0, y: 0 };
    console.log("coords", coords);
    showTooltip({
      tooltipData: datum,
      tooltipLeft: coords.x + 500,
      tooltipTop: coords.y + 200,
    });
    setHoveredBar(datum);
  };

  console.log(aggregatedData);

  return (
    <div>
      <svg width={width} height={height}>
        {/* Bars */}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {aggregatedData.map((d: any) => {
            const barHeight =
              height - margin.top - margin.bottom - (yScale(d.value) ?? 0);
            return (
              <Bar
                key={`bar-${d.name}`}
                x={xScale(d.name)}
                y={yScale(d.value)}
                width={xScale.bandwidth()}
                height={barHeight}
                fill={hoveredBar?.name === d.name ? "orange" : "teal"}
                onMouseOver={(event) => handleMouseOver(event, d)}
                onMouseOut={hideTooltip}
              />
            );
          })}
        </g>

        {/* X Axis */}
        <AxisBottom
          top={height - margin.bottom}
          left={margin.left}
          scale={xScale}
          stroke="#000"
          tickStroke="#000"
          hideAxisLine={false}
        />

        {/* X Axis Label */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize={12}
          fill="black"
        >
          {xAxis}
        </text>

        {/* Y Axis */}
        <AxisLeft
          left={margin.left}
          scale={yScale}
          stroke="#000"
          tickStroke="#000"
          hideAxisLine={false}
        />

        {/* Y Axis Label */}
        <text
          x={-height / 2}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          fontSize={12}
          fill="black"
        >
          {yAxis}
        </text>
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

export default BarChart;
