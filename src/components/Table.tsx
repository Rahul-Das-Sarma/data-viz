import React from "react";

// type Props = {}

const Table = ({ xAxisKey, yAxisKey, aggregatedData }: any) => {
  return (
    <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            {xAxisKey}
          </th>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            {yAxisKey}
          </th>
        </tr>
      </thead>
      <tbody>
        {aggregatedData.map((row, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {row.name}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
