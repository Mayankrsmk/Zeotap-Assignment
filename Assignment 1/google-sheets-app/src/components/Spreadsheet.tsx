import React, { useState } from 'react';
import Cell from './Cell';
import { evaluateFormula } from '../utils/parser';

interface SpreadsheetProps {
  cells: string[][];
  setCells: (row: number, col: number, newValue: string) => void;
  boldCells: boolean[][];
  italicCells: boolean[][];
  setEditingCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ cells, setCells, boldCells, italicCells, setEditingCell }) => {
  const [editingCellLocal, setEditingCellLocal] = useState<{ row: number; col: number } | null>(null);
  const [formulaValues, setFormulaValues] = useState<Map<string, string>>(new Map());

  const handleCellChange = (row: number, col: number, newValue: string) => {
    if (newValue.startsWith('=')) {
      try {
        const result = evaluateFormula(newValue.slice(1), cells);
        setCells(row, col, newValue); // Store the formula
        
        // Store the formula result for display
        const key = `${row},${col}`;
        const updatedFormulaValues = new Map(formulaValues);
        updatedFormulaValues.set(key, result);
        setFormulaValues(updatedFormulaValues);
      } catch (error) {
        alert(`Error evaluating formula: ${error}`);
      }
    } else if (!isNaN(Number(newValue)) || newValue === '') {
      setCells(row, col, newValue); // Allow numbers
    } else if (/\d/.test(newValue) && /[a-zA-Z]/.test(newValue)) {
      alert("Warning: Mixing numbers and text in the same cell is not allowed.");
    } else {
      setCells(row, col, newValue); // Allow pure text
    }
  };
  
  

  const handleEditCell = (row: number, col: number) => {
    setEditingCellLocal({ row, col });
    setEditingCell({ row, col });
  };

  // Get the display value for a cell (formula result or actual value)
  const getCellDisplayValue = (row: number, col: number) => {
    const value = cells[row][col];
    if (value.startsWith('=')) {
      const key = `${row},${col}`;
      return formulaValues.get(key) || value;
    }
    return value;
  };

  return (
    <div className="spreadsheet border border-gray-300">
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cellValue, colIndex) => (
            <Cell
              key={colIndex}
              value={getCellDisplayValue(rowIndex, colIndex)}
              onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
              isEditing={editingCellLocal?.row === rowIndex && editingCellLocal?.col === colIndex}
              onEdit={() => handleEditCell(rowIndex, colIndex)}
              style={{
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                width: '8rem',
                height: '2.5rem'
              }}
              isBold={boldCells[rowIndex][colIndex]}
              isItalic={italicCells[rowIndex][colIndex]}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Spreadsheet; 