import React, { useState, useRef } from 'react'
import Spreadsheet from './components/Spreadsheet'
import Toolbar from './components/Toolbar'
import FindReplace from './components/FindReplace'
import FunctionTester from './components/FunctionTester'
import ChartConfig from './components/ChartConfig'
import ChartComponent from './components/ChartComponent'
import { evaluateFormula } from './utils/parser'

const App = () => {
  const [cells, setCells] = useState<string[][]>(Array.from({ length: 50 }, () => Array(26).fill('')));
  const [boldCells, setBoldCells] = useState<boolean[][]>(Array.from({ length: 50 }, () => Array(26).fill(false)));
  const [italicCells, setItalicCells] = useState<boolean[][]>(Array.from({ length: 50 }, () => Array(26).fill(false)));
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [dependencies, setDependencies] = useState<Map<string, Set<string>>>(new Map()); // Track dependencies
  const [charts, setCharts] = useState<any[]>([]);
  const [showChartConfig, setShowChartConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBold = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      const updatedBoldCells = [...boldCells];
      updatedBoldCells[row][col] = !updatedBoldCells[row][col]; // Toggle bold
      setBoldCells(updatedBoldCells);
    }
  };

  const handleItalic = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      const updatedItalicCells = [...italicCells];
      updatedItalicCells[row][col] = !updatedItalicCells[row][col]; // Toggle italic
      setItalicCells(updatedItalicCells);
    }
  };

  const updateCell = (row: number, col: number, newValue: string) => {
    const updatedCells = [...cells];
    updatedCells[row][col] = newValue;
    setCells(updatedCells);
    
    // If this is a formula, we need to evaluate it
    if (newValue.startsWith('=')) {
      try {
        // This will trigger any dependent cells to update
        updateDependencies(row, col);
      } catch (error) {
        console.error(`Error updating formula: ${error}`);
      }
    } else {
      // For non-formula cells, still update dependencies
      updateDependencies(row, col);
    }
  };

  const updateDependencies = (row: number, col: number) => {
    const cellKey = `${row},${col}`;
    const dependentCells = dependencies.get(cellKey) || new Set();
    
    // Create a copy of the cells array to work with
    const updatedCells = [...cells];

    dependentCells.forEach((dependentCell) => {
      const [depRow, depCol] = dependentCell.split(',').map(Number);
      const result = evaluateFormula(updatedCells[depRow][depCol].slice(1), updatedCells);
      updatedCells[depRow][depCol] = result.toString(); // Update dependent cell
    });

    setCells(updatedCells);
  };

  const handleTrim = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      const updatedCells = [...cells];
      updatedCells[row][col] = updatedCells[row][col].trim();
      setCells(updatedCells);
    }
  };

  const handleUpper = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      const updatedCells = [...cells];
      updatedCells[row][col] = updatedCells[row][col].toUpperCase();
      setCells(updatedCells);
    }
  };

  const handleLower = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      const updatedCells = [...cells];
      updatedCells[row][col] = updatedCells[row][col].toLowerCase();
      setCells(updatedCells);
    }
  };

  const handleRemoveDuplicates = () => {
    if (editingCell) {
      const { row } = editingCell;
      const updatedCells = [...cells];
      const uniqueValues = Array.from(new Set(updatedCells[row]));
      updatedCells[row] = uniqueValues.concat(Array(updatedCells[row].length - uniqueValues.length).fill(''));
      setCells(updatedCells);
    }
  };

  const handleSave = () => {
    const spreadsheetData = {
      cells,
      boldCells,
      italicCells,
      charts,
    };
    
    const blob = new Blob([JSON.stringify(spreadsheetData)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
  };

  const handleLoad = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setCells(data.cells || []);
        setBoldCells(data.boldCells || []);
        setItalicCells(data.italicCells || []);
        setCharts(data.charts || []);
      } catch (error) {
        alert('Error loading spreadsheet: ' + error);
      }
    };
    reader.readAsText(file);
  };

  const handleCreateChart = () => {
    setShowChartConfig(true);
  };

  const handleChartConfigSubmit = (chartConfig: any) => {
    setCharts([...charts, chartConfig]);
    setShowChartConfig(false);
  };

  const handleChartConfigCancel = () => {
    setShowChartConfig(false);
  };

  return (
    <div className="app bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b py-1">
        <div className="flex items-center pl-2">
          {/* Google Sheets-like icon */}
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28">
              <path fill="#43A047" d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"/>
              <path fill="#C8E6C9" d="M40 13L30 13 30 3z"/>
              <path fill="#2E7D32" d="M30 13L40 13 30 3z"/>
              <path fill="#E8F5E9" d="M31,23H17v-2h14V23z M31,27H17v-2h14V27z M31,31H17v-2h14V31z M31,35H17v-2h14V35z"/>
            </svg>
          </div>
          <h1 className="text-lg font-medium text-gray-800 ml-2">Google Sheets</h1>
        </div>
      </header>
      
      <Toolbar 
        onBold={handleBold} 
        onItalic={handleItalic} 
        onTrim={handleTrim} 
        onUpper={handleUpper} 
        onLower={handleLower} 
        onRemoveDuplicates={handleRemoveDuplicates}
        onSave={handleSave}
        onLoad={handleLoad}
        onCreateChart={handleCreateChart}
      />
      
      <div className="max-w-[95%] mx-auto p-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <FindReplace cells={cells} setCells={setCells} />
          
          <div className="spreadsheet-wrapper overflow-hidden border border-gray-300 rounded-lg">
            <Spreadsheet 
              cells={cells} 
              setCells={updateCell} 
              boldCells={boldCells} 
              italicCells={italicCells} 
              setBoldCells={setBoldCells}
              setItalicCells={setItalicCells}
              setEditingCell={setEditingCell} 
            />
          </div>
        </div>
        
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <FunctionTester cells={cells} />
        </div>
      </div>
      
      {/* Hidden file input for loading */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleFileChange} 
      />
      
      {/* Chart configuration modal */}
      {showChartConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ChartConfig 
            cells={cells} 
            onCreateChart={handleChartConfigSubmit} 
            onCancel={handleChartConfigCancel} 
          />
        </div>
      )}
      
      {/* Chart display area */}
      {charts.length > 0 && (
        <div className="max-w-[95%] mx-auto mt-4 p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-800">Charts</h2>
          <div className="charts-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.map((chart, index) => (
              <div key={index} className="chart-container border rounded-lg p-4 shadow-sm">
                <ChartComponent chartConfig={chart} />
                <button 
                  onClick={() => setCharts(charts.filter((_, i) => i !== index))}
                  className="mt-3 bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                >
                  Remove Chart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
