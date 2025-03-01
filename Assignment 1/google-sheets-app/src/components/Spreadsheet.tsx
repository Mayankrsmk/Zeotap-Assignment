import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import Cell from './Cell';
import DraggableCell from './DraggableCell';
import DroppableArea from './DroppableArea';
import { evaluateFormula } from '../utils/parser';

interface SpreadsheetProps {
  cells: string[][];
  setCells: (row: number, col: number, newValue: string) => void;
  boldCells: boolean[][];
  italicCells: boolean[][];
  setBoldCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setItalicCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setEditingCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ cells, setCells, boldCells, italicCells, setBoldCells, setItalicCells, setEditingCell }) => {
  const [editingCellLocal, setEditingCellLocal] = useState<{ row: number; col: number } | null>(null);
  const [formulaValues, setFormulaValues] = useState<Map<string, string>>(new Map());
  const [activeDragData, setActiveDragData] = useState<{ value: string, rowIndex: number, colIndex: number } | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { value, rowIndex, colIndex } = active.data.current as { value: string, rowIndex: number, colIndex: number };
    setActiveDragData({ value, rowIndex, colIndex });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && activeDragData) {
      const sourceId = active.id as string;
      const targetId = over.id as string;
      
      const [sourceRow, sourceCol] = sourceId.split('-').map(Number);
      const [targetRow, targetCol] = targetId.split('-').map(Number);
      
      // Get the value from the source cell
      const sourceValue = cells[sourceRow][sourceCol];
      
      // Update the target cell with the source value
      setCells(targetRow, targetCol, sourceValue);
      
      // If the source value is a formula, evaluate it in the new location
      if (sourceValue.startsWith('=')) {
        try {
          const result = evaluateFormula(sourceValue.slice(1), cells);
          const key = `${targetRow},${targetCol}`;
          const updatedFormulaValues = new Map(formulaValues);
          updatedFormulaValues.set(key, result);
          setFormulaValues(updatedFormulaValues);
        } catch (error) {
          console.error(`Error evaluating formula after drag: ${error}`);
        }
      }
      
      // Also copy formatting (bold/italic)
      const newBoldCells = [...boldCells];
      const newItalicCells = [...italicCells];
      
      newBoldCells[targetRow][targetCol] = boldCells[sourceRow][sourceCol];
      newItalicCells[targetRow][targetCol] = italicCells[sourceRow][sourceCol];
      
      // Clear the source cell if it's a move operation (not holding Shift key)
      if (!event.activatorEvent.shiftKey) {
        setCells(sourceRow, sourceCol, '');
        
        // If this was a formula, remove its entry from formulaValues
        if (sourceValue.startsWith('=')) {
          const key = `${sourceRow},${sourceCol}`;
          const updatedFormulaValues = new Map(formulaValues);
          updatedFormulaValues.delete(key);
          setFormulaValues(updatedFormulaValues);
        }
      }
    }
    
    setActiveDragData(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="spreadsheet border border-gray-300">
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cellValue, colIndex) => (
              <DroppableArea 
                key={`${rowIndex}-${colIndex}`} 
                id={`${rowIndex}-${colIndex}`}
                style={{
                  border: '1px solid #d1d5db',
                  width: '8rem',
                  height: '2.5rem'
                }}
              >
                <DraggableCell
                  id={`${rowIndex}-${colIndex}`}
                  value={getCellDisplayValue(rowIndex, colIndex)}
                  onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
                  isEditing={editingCellLocal?.row === rowIndex && editingCellLocal?.col === colIndex}
                  onEdit={() => handleEditCell(rowIndex, colIndex)}
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    height: '100%'
                  }}
                  isBold={boldCells[rowIndex][colIndex]}
                  isItalic={italicCells[rowIndex][colIndex]}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                />
              </DroppableArea>
            ))}
          </div>
        ))}
      </div>
      
      {/* Drag overlay for showing the dragged cell */}
      <DragOverlay>
        {activeDragData ? (
          <div 
            className="bg-white border shadow-lg"
            style={{
              padding: '0.5rem',
              width: '8rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: boldCells[activeDragData.rowIndex][activeDragData.colIndex] ? 'bold' : 'normal',
              fontStyle: italicCells[activeDragData.rowIndex][activeDragData.colIndex] ? 'italic' : 'normal'
            }}
          >
            {activeDragData.value}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Spreadsheet; 