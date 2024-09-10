import React, { useMemo, useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

type DataPoint = {
  label: string;
  value: number;
  color: string;
};
const colors = [
  "#FF6384",
  "#FFCE56",
  "#36A2EB",
  "#9966FF",
  "#FF9F40",
  "#b4f689",
  "#c1d851",
  "#5fee9d",
  "#5ac9d1",
  "#43bac5",
  "#5254ce",
  "#8c4dcf",
  "#b14cba",
  "#b33d5b",
  "#96224f",
  "#5a1553",
  "#82308d",
  "#ddf336",
];
const data: DataPoint[] = [
  { label: "Apple", value: 30, color: "#FF6384" },
  { label: "Banana", value: 20, color: "#FFCE56" },
  { label: "Cherry", value: 15, color: "#36A2EB" },
  { label: "Grapes", value: 25, color: "#9966FF" },
  { label: "Orange", value: 10, color: "#FF9F40" },
];

const PieChart: React.FC = ({ aggregatedData }: any) => {
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;
  console.log("Pie Chart", aggregatedData);
  const agData = useMemo(
    () => aggregatedData.map((ele, i) => ({ ...ele, color: colors[i] })),
    [aggregatedData]
  );
  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<DataPoint>();
  const [hoveredSlice, setHoveredSlice] = useState<DataPoint | null>(null);

  const handleMouseOver = (
    event: React.MouseEvent<SVGPathElement>,
    datum: DataPoint
  ) => {
    const coords = localPoint(event) || { x: 0, y: 0 };
    showTooltip({
      tooltipData: datum,
      tooltipLeft: coords.x + 400,
      tooltipTop: coords.y + 200,
    });
    setHoveredSlice(datum);
  };

  return (
    <div>
      <svg width={width} height={height}>
        <Group top={height / 2} left={width / 2}>
          <Pie
            data={agData}
            pieValue={(d) => d.value}
            outerRadius={radius}
            // innerRadius={radius / 2}
            innerRadius={0}
            padAngle={0.02}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => {
                const [centroidX, centroidY] = pie.path.centroid(arc);
                const datum = arc.data;

                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={pie.path(arc) ?? ""}
                      fill={datum.color}
                      onMouseOver={(event) => handleMouseOver(event, datum)}
                      onMouseOut={hideTooltip}
                      style={{
                        opacity: hoveredSlice?.name === datum.name ? 0.8 : 1,
                        cursor: "pointer",
                      }}
                    />
                    {/* Label on the slice */}
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="white"
                      fontSize={10}
                      textAnchor="middle"
                    >
                      {datum.name}
                    </text>
                  </g>
                );
              })
            }
          </Pie>
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

export default PieChart;
