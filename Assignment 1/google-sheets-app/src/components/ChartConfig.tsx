import React, { useState, useRef, useEffect } from 'react';

interface ChartConfigProps {
  cells: string[][];
  onCreateChart: (config: {
    type: string;
    data: any[];
    title: string;
    dataKeys: string[];
  }) => void;
  onCancel: () => void;
}

const ChartConfig: React.FC<ChartConfigProps> = ({ cells, onCreateChart, onCancel }) => {
  const [chartType, setChartType] = useState('bar');
  const [dataRange, setDataRange] = useState('A1:C5');
  const [chartTitle, setChartTitle] = useState('Chart Title');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse the data range (e.g., A1:C5)
    const [start, end] = dataRange.split(':');
    const startCol = start.charCodeAt(0) - 65; // Convert A to 0, B to 1, etc.
    const startRow = parseInt(start.substring(1)) - 1; // Convert 1-based to 0-based
    const endCol = end.charCodeAt(0) - 65;
    const endRow = parseInt(end.substring(1)) - 1;
    
    // Extract data from the specified range
    const data: any[] = [];
    for (let i = startRow + 1; i <= endRow; i++) { // Skip header row
      const row: any = {};
      for (let j = startCol; j <= endCol; j++) {
        if (j === startCol) {
          // First column is used as name
          row['name'] = cells[i][j];
        } else {
          // Other columns are data
          row[cells[startRow][j] || `Column ${j - startCol}`] = Number(cells[i][j]) || 0;
        }
      }
      data.push(row);
    }
    
    // Get data keys (column headers)
    const dataKeys: string[] = [];
    for (let j = startCol + 1; j <= endCol; j++) {
      dataKeys.push(cells[startRow][j] || `Column ${j - startCol}`);
    }
    
    onCreateChart({
      type: chartType,
      data,
      title: chartTitle,
      dataKeys
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" ref={modalRef}>
      <h2 className="text-xl font-medium mb-4 text-gray-800">Chart Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Range (e.g., A1:C5)</label>
          <input 
            type="text" 
            value={dataRange} 
            onChange={(e) => setDataRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
          <input 
            type="text" 
            value={chartTitle} 
            onChange={(e) => setChartTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 border border-gray-300"
          >
            Create Chart
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChartConfig; 