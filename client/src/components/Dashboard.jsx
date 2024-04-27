import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const monthNames = [
    'Jan 2023',
    'Feb 2023',
    'March 2023',
    'April 2023',
    'May 2023',
    'June 2023',
    'July 2023',
    'August 2023',
    'September 2023',
    'October 2023',
    'November 2023',
    'December 2023',
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#ff0000', '#00c49f'];


  const [metrics, setMetrics] = useState([]);
  // const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('https://environment-dashboard-server.vercel.app/api/data');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleCellEdit = (rowIndex, columnName, value) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[rowIndex][columnName] = value;
    setMetrics(updatedMetrics);
  };

  const handleSave = async () => {
    try {
      await axios.put('https://environment-dashboard-server.vercel.app/api/data', metrics);
      console.log('Metrics saved successfully');
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  };

  const chartData = monthNames.map(month => {
    const dataPoint = { month };
    metrics.forEach((metric, index) => {
      const key = metric[''];
      dataPoint[key] = parseFloat(metric[month]);
    });
    return dataPoint;
  });

  const renderAbbreviatedXAxisTick = ({ x, y, payload }) => {
    const abbreviatedLabel = payload.value.slice(0, 3); // Take the first three characters
    return (
      <text x={x} y={y} dy={16} textAnchor="end" fill="#666">
        {abbreviatedLabel}
      </text>
    );
  };

  return (
    <div>
      <h1>Environmental Metrics Dashboard</h1>
      {metrics.length > 0 ? (
        <>
          <div style={{display: "flex", width: "100vw", justifyContent: "center"}}>
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {monthNames.map((month) => (
                    <th key={month}>{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{row['']}</td>
                    {monthNames.map((month) => (
                      <td
                        key={month}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleCellEdit(rowIndex, month, e.target.textContent)
                        }
                      >
                        {row[month]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave}>Save</button>
          <div>
            <h2>Charts</h2>
              <div className="chart-container">
                {metrics.map((metric, index) => (
                  <div key={metric['']} className="chart-item">
                    <h3>{metric['']}</h3>
                    <LineChart width={400} height={300} data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" interval={2} tick={renderAbbreviatedXAxisTick} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={metric['']} stroke={colors[index % colors.length]} />
                    </LineChart>
                  </div>
                ))}
              </div>
          </div>
        </>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
};

export default Dashboard;