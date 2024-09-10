import React, { useState } from "react";
import Papa from "papaparse"; // For parsing CSV files

import BarChart from "./components/Bar";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import AreaChart from "./components/AreaChart";
import ScatterPlot from "./components/ScatterChart";
import Table from "./components/Table";

// import { BarChartVisx } from "./BarChartVisx";

// DataPoint interface for TypeScript
interface DataPoint {
  [key: string]: string | number;
}
const App = () => {
  // State to store parsed CSV data
  const [data, setData] = useState<DataPoint[]>([]);
  const [headers, setHeaders] = useState<string[]>([]); // Store the headers (columns)
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // State to handle axis selection
  const [xAxisKey, setXAxisKey] = useState<string>(""); // User's X-axis choice
  const [yAxisKey, setYAxisKey] = useState<string>(""); // User's Y-axis choice

  // State to handle chart type selection
  const [chartType, setChartType] = useState<string>("bar"); // Default chart type

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Parse CSV and extract data along with headers
  const handleParseCsv = () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true, // Treat first row as headers
      skipEmptyLines: true,
      complete: (results) => {
        // @ts-ignore
        const parsedData: DataPoint[] = results.data;
        const columnHeaders = Object.keys(parsedData[0]);
        setData(parsedData); // Store parsed data
        setHeaders(columnHeaders); // Store headers for user to choose from
        if (columnHeaders.length >= 2) {
          setXAxisKey(columnHeaders[0]); // Set first column as default X-axis
          setYAxisKey(columnHeaders[1]); // Set second column as default Y-axis
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };
  // Function to group data by X-axis and count/sum values for Y-axis
  const aggregateData = (data: DataPoint[], xKey: string, yKey: string) => {
    const groupedData: Record<string, number> = {};

    data.forEach((row) => {
      const xValue = row[xKey] as string;
      const yValue = row[yKey];

      if (!groupedData[xValue]) {
        groupedData[xValue] = 0;
      }

      if (typeof yValue === "number") {
        groupedData[xValue] += yValue;
      } else {
        groupedData[xValue] += 1;
      }
    });

    return Object.keys(groupedData).map((xValue) => ({
      name: xValue,
      value: groupedData[xValue],
    }));
  };

  // Aggregate the data
  const aggregatedData =
    data.length > 0 && xAxisKey && yAxisKey
      ? aggregateData(data, xAxisKey, yAxisKey)
      : [];

  console.log(aggregatedData);
  // Color palette for PieChart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  // Render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart
            aggregatedData={aggregatedData}
            xAxis={xAxisKey}
            yAxis={yAxisKey}
          />
        );
      case "pie":
        return <PieChart aggregatedData={aggregatedData} />;
      case "line":
        return <LineChart aggregatedData={aggregatedData} />;
      case "area":
        return <AreaChart aggregatedData={aggregatedData} />;
      case "scatter":
        return <ScatterPlot aggregatedData={aggregatedData} />;
      // case "funnel":
      //   return <FunnelChart aggregatedData={aggregatedData} />;
      case "table":
        return (
          <Table
            xAxisKey={xAxisKey}
            yAxisKey={yAxisKey}
            aggregatedData={aggregatedData}
          />
        );
      default:
        return null;
    }
  };

  // return <Baraa />;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100vw" }}>
      <div>
        <h2>Build Chart with Custom X & Y Axes from CSV</h2>

        {/* File input to accept CSV file */}
        <input type="file" accept=".csv" onChange={handleFileChange} />

        {/* Button to parse CSV */}
        <button onClick={handleParseCsv} style={{ margin: "10px" }}>
          Load Data
        </button>

        {/* Render X and Y axis selectors only if headers exist */}
        {headers.length > 0 && (
          <div>
            <label>
              X-Axis:
              <select
                value={xAxisKey}
                onChange={(e) => setXAxisKey(e.target.value)}
                style={{ margin: "10px" }}
              >
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Y-Axis:
              <select
                value={yAxisKey}
                onChange={(e) => setYAxisKey(e.target.value)}
                style={{ margin: "10px" }}
              >
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Dropdown to select chart type */}
        <div style={{ margin: "20px" }}>
          <label>
            Select Chart Type:
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ margin: "10px" }}
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="scatter">Scatter Chart</option>
              {/* <option value="funnel">Funnel Chart</option> */}
              <option value="table">Table</option>
            </select>
          </label>
        </div>

        {/* Conditionally render the selected chart */}
        {aggregatedData.length > 0 && renderChart()}

        {/* Display current parsed data as JSON for reference */}
        {/* {data.length > 0 && (
        <div>
          <h4>Parsed CSV Data:</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
      </div>
    </div>
  );
};

export default App;
