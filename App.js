import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('');
  const [fileName, setFileName] = useState('');
  const chartRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
      }
    });
  };

  const handleDownload = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  

  const renderChart = () => {
    if (!data.length || !chartType) return null;

    const keys = Object.keys(data[0]);
    const xKey = keys[0];
    const yKey = keys[1];

    switch (chartType) {
      case 'Bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#a06ff8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Pie':
        const pieData = data.map(item => ({
          name: item[xKey],
          value: parseFloat(item[yKey]) || 0
        }));

        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={`hsl(${index * 40}, 70%, 60%)`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case 'Scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey={xKey} name={xKey} />
              <YAxis dataKey={yKey} name={yKey} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={data} fill="#a06ff8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'Area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a06ff8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a06ff8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={xKey} />
              <YAxis />
              
              <Tooltip />
              <Area type="monotone" dataKey={yKey} stroke="#a06ff8" fillOpacity={1} fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="logo">FileConverT</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">History</a>

        </nav>
      </header>

      <h1 className="floating-text">Welcome to FileConverT</h1>
      <p>Feel free to convert your data into meaningful plots!</p>

      <label className="upload-btn">
        Upload your CSV File
        <input type="file" accept=".csv" onChange={handleFileUpload} hidden />
      </label>

      {fileName && <p className="file-name">📁 {fileName}</p>}

      <div className="chart-buttons">
        {['Bar', 'Pie', 'Line', 'Scatter', 'Area'].map(type => (
          <button key={type} onClick={() => setChartType(type)}>
            {type} Chart
          </button>
        ))}
      </div>

      <div ref={chartRef} className="chart-container">
        {renderChart()}
      </div>

      {data.length > 0 && chartType && (
        <button className="download-btn" onClick={handleDownload}>
          Convert to PNG File
        </button>
      )}
    </div>
  );
}

export default App;
