import React, { useState } from 'react'
import Spreadsheet from './components/Spreadsheet'
import Toolbar from './components/Toolbar'
import FindReplace from './components/FindReplace'
import FunctionTester from './components/FunctionTester'
import { evaluateFormula } from './utils/parser'

const App = () => {
  const [cells, setCells] = useState<string[][]>(Array.from({ length: 10 }, () => Array(10).fill(''))); // 10x10 grid
  const [boldCells, setBoldCells] = useState<boolean[][]>(Array.from({ length: 10 }, () => Array(10).fill(false)));
  const [italicCells, setItalicCells] = useState<boolean[][]>(Array.from({ length: 10 }, () => Array(10).fill(false)));
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [dependencies, setDependencies] = useState<Map<string, Set<string>>>(new Map()); // Track dependencies

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

  return (
    <div className="app">
      <h1 className="text-center text-2xl font-bold">Google Sheets</h1>
      <Toolbar onBold={handleBold} onItalic={handleItalic} onTrim={handleTrim} onUpper={handleUpper} onLower={handleLower} onRemoveDuplicates={handleRemoveDuplicates} />
      <FindReplace cells={cells} setCells={setCells} />
      <Spreadsheet cells={cells} setCells={updateCell} boldCells={boldCells} italicCells={italicCells} setEditingCell={setEditingCell} />
      <FunctionTester cells={cells} />
    </div>
  )
}

export default App
