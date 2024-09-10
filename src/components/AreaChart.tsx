import React, { useState } from "react";
import { AreaClosed } from "@visx/shape";
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

// Example data
// const data: DataPoint[] = [
//   { name: "yes", value: 1456 },
//   { name: "no", value: 885 },
// ];

const AreaChart: React.FC = ({ aggregatedData }: any) => {
  const width = 500;
  const height = 400;
  const margin = { top: 40, right: 20, bottom: 60, left: 60 };
  console.log("Area Chart", aggregatedData);
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
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const handleMouseMove = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    point: DataPoint
  ) => {
    const coords = localPoint(event) || { x: 0, y: 0 };
    showTooltip({
      tooltipData: point,
      tooltipLeft: xScale(point.name) + margin.left,
      tooltipTop: yScale(point.value) + margin.top,
    });
    setHoveredPoint(point);
  };

  return (
    <div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Area Path */}
          <AreaClosed
            data={aggregatedData}
            x={(d) => xScale(d.name) ?? 0}
            y={(d) => yScale(d.value)}
            yScale={yScale}
            fill="#FF6384"
            stroke="#FF6384"
            strokeWidth={2}
            curve={curveMonotoneX}
            onMouseMove={(event) =>
              handleMouseMove(
                event,
                aggregatedData.find(
                  (d) => d.name === xScale.invert(event.clientX - margin.left)
                ) || { name: "", value: 0 }
              )
            }
            onMouseLeave={hideTooltip}
          />

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

export default AreaChart;
