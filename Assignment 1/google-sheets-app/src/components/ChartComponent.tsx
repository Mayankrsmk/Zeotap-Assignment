import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface ChartComponentProps {
  chartConfig: {
    type: 'bar' | 'line' | 'pie' | 'area';
    data: Array<{
      name: string;
      [key: string]: string | number;
    }>;
    title: string;
    dataKeys: string[];
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const ChartComponent: React.FC<ChartComponentProps> = ({ chartConfig }) => {
  const { type, data, title, dataKeys } = chartConfig;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.map((item) => ({
                  name: item.name,
                  value: Number(item[dataKeys[0]]) || 0
                }))}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Area key={key} type="monotone" dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart">
      <h3 className="text-center font-bold mb-2">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default ChartComponent; 