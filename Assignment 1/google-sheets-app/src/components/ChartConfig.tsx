import React, { useState } from 'react';

interface ChartConfigProps {
  cells: string[][];
  onCreateChart: (config: any) => void;
  onCancel: () => void;
}

const ChartConfig: React.FC<ChartConfigProps> = ({ cells, onCreateChart, onCancel }) => {
  const [chartType, setChartType] = useState<string>('bar');
  const [dataRange, setDataRange] = useState<string>('A1:B5');
  const [title, setTitle] = useState<string>('Chart Title');

  const handleSubmit = () => {
    // Parse the range
    const [start, end] = dataRange.split(':');
    const startCol = start.charCodeAt(0) - 65;
    const startRow = parseInt(start.slice(1)) - 1;
    const endCol = end.charCodeAt(0) - 65;
    const endRow = parseInt(end.slice(1)) - 1;

    // Extract data from the range
    const data = [];
    for (let i = startRow; i <= endRow; i++) {
      const row = {};
      for (let j = startCol; j <= endCol; j++) {
        if (i === startRow) {
          // This is a header row
          continue;
        }
        
        if (j === startCol) {
          // First column is used as name
          row['name'] = cells[i][j];
        } else {
          // Other columns are data
          row[cells[startRow][j] || `Column ${j - startCol}`] = Number(cells[i][j]) || 0;
        }
      }
      if (i > startRow) {
        data.push(row);
      }
    }

    onCreateChart({
      type: chartType,
      data,
      title,
      dataKeys: cells[startRow].slice(startCol + 1, endCol + 1)
    });
  };

  return (
    <div className="chart-config p-4 border rounded bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Create Chart</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Chart Type</label>
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          className="border p-1 w-full"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="area">Area Chart</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Data Range</label>
        <input 
          type="text" 
          value={dataRange} 
          onChange={(e) => setDataRange(e.target.value)}
          placeholder="e.g., A1:B5" 
          className="border p-1 w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          First row should contain headers, first column should contain labels
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Chart Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button 
          onClick={onCancel}
          className="bg-gray-300 p-2 rounded"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create Chart
        </button>
      </div>
    </div>
  );
};

export default ChartConfig; 