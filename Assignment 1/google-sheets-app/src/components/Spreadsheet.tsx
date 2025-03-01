import React, { useState, useRef, useEffect } from 'react';
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
  fontSizes: string[][];
  fontColors: string[][];
  setBoldCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setItalicCells: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setEditingCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ cells, setCells, boldCells, italicCells, fontSizes, fontColors, setBoldCells, setItalicCells, setEditingCell }) => {
  const [editingCellLocal, setEditingCellLocal] = useState<{ row: number; col: number } | null>(null);
  const [formulaValues, setFormulaValues] = useState<Map<string, string>>(new Map());
  const [activeDragData, setActiveDragData] = useState<{ value: string, rowIndex: number, colIndex: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add state to track visible rows and columns
  const [visibleRows, setVisibleRows] = useState<number>(10); // Initially show 10 rows
  const [visibleCols, setVisibleCols] = useState<number>(10); // Initially show 10 columns (A-J)

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

  // Function to handle scroll and dynamically load more rows/columns
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollLeft, clientHeight, clientWidth, scrollHeight, scrollWidth } = containerRef.current;
    
    // If scrolled near the bottom, show more rows
    if (scrollTop + clientHeight > scrollHeight - 100 && visibleRows < cells.length) {
      setVisibleRows(Math.min(cells.length, visibleRows + 5));
    }
    
    // If scrolled near the right edge, show more columns
    if (scrollLeft + clientWidth > scrollWidth - 100 && visibleCols < cells[0].length) {
      setVisibleCols(Math.min(cells[0].length, visibleCols + 5));
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [visibleRows, visibleCols]);

  return (
    <div 
      className="spreadsheet-container overflow-auto max-h-[70vh] max-w-full border border-gray-300 rounded-md" 
      ref={containerRef}
      style={{ 
        height: '500px',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'auto'
      }}
    >
      {/* Column headers A, B, C, etc. */}
      <div className="flex sticky top-0 z-10" style={{ minWidth: 'max-content' }}>
        <div className="w-10 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center sticky left-0 z-20"></div>
        {Array.from({ length: cells[0].length }).map((_, colIndex) => (
          <div 
            key={colIndex} 
            className="bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center font-medium text-gray-600"
            style={{ width: '100px', height: '32px' }}
          >
            {String.fromCharCode(65 + colIndex)}
          </div>
        ))}
      </div>
      
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="spreadsheet" style={{ minWidth: 'max-content' }}>
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* Row headers 1, 2, 3, etc. */}
              <div 
                className="bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center font-medium text-gray-600 sticky left-0 z-10"
                style={{ width: '40px', height: '28px' }}
              >
                {rowIndex + 1}
              </div>
              
              {row.map((cellValue, colIndex) => (
                <DroppableArea 
                  key={`${rowIndex}-${colIndex}`} 
                  id={`${rowIndex}-${colIndex}`}
                  style={{
                    border: '1px solid #e5e7eb',
                    width: '100px',
                    height: '28px'
                  }}
                >
                  <DraggableCell
                    id={`${rowIndex}-${colIndex}`}
                    value={getCellDisplayValue(rowIndex, colIndex)}
                    onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
                    isEditing={editingCellLocal?.row === rowIndex && editingCellLocal?.col === colIndex}
                    onEdit={() => handleEditCell(rowIndex, colIndex)}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                    isBold={boldCells[rowIndex][colIndex]}
                    isItalic={italicCells[rowIndex][colIndex]}
                    fontSize={fontSizes[rowIndex][colIndex]}
                    fontColor={fontColors[rowIndex][colIndex]}
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
                padding: '0.25rem',
                width: '100px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: boldCells[activeDragData.rowIndex][activeDragData.colIndex] ? 'bold' : 'normal',
                fontStyle: italicCells[activeDragData.rowIndex][activeDragData.colIndex] ? 'italic' : 'normal',
                fontSize: `${fontSizes[activeDragData.rowIndex][activeDragData.colIndex]}px`,
                color: fontColors[activeDragData.rowIndex][activeDragData.colIndex]
              }}
            >
              {activeDragData.value}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Scroll indicators */}
      {/* <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs text-gray-500 rounded shadow-sm">
        Scroll to see more rows and columns
      </div> */}
    </div>
  );
};

export default Spreadsheet; 