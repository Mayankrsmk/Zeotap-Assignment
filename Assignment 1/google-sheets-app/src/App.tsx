import React, { useState, useRef } from 'react'
import Spreadsheet from './components/Spreadsheet'
import Toolbar from './components/Toolbar'
import FindReplace from './components/FindReplace'
import FunctionTester from './components/FunctionTester'
import ChartConfig from './components/ChartConfig'
import ChartComponent from './components/ChartComponent'
import { evaluateFormula } from './utils/parser'

const App = () => {
  const [cells, setCells] = useState<string[][]>(Array.from({ length: 10 }, () => Array(10).fill(''))); // 10x10 grid
  const [boldCells, setBoldCells] = useState<boolean[][]>(Array.from({ length: 10 }, () => Array(10).fill(false)));
  const [italicCells, setItalicCells] = useState<boolean[][]>(Array.from({ length: 10 }, () => Array(10).fill(false)));
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
    updateDependencies(row, col); // Update dependencies when a cell changes
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
    <div className="app">
      <h1 className="text-center text-2xl font-bold">Google Sheets</h1>
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
      <FindReplace cells={cells} setCells={setCells} />
      <Spreadsheet cells={cells} setCells={updateCell} boldCells={boldCells} italicCells={italicCells} setEditingCell={setEditingCell} />
      <FunctionTester cells={cells} />
      
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
        <div className="charts-container mt-4 p-4 border-t">
          <h2 className="text-xl font-bold mb-2">Charts</h2>
          <div className="charts-grid grid grid-cols-2 gap-4">
            {charts.map((chart, index) => (
              <div key={index} className="chart-container border p-2">
                <ChartComponent chartConfig={chart} />
                <button 
                  onClick={() => setCharts(charts.filter((_, i) => i !== index))}
                  className="mt-2 bg-red-500 text-white p-1 rounded"
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
