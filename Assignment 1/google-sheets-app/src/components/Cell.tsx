import React, { useState } from 'react';

interface CellProps {
  value: string;
  onChange: (newValue: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  style?: React.CSSProperties;
  isBold?: boolean;
  isItalic?: boolean;
  rowIndex: number;
  colIndex: number;
}

const Cell: React.FC<CellProps> = ({ value, onChange, isEditing, onEdit, style, isBold, isItalic }) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Determine if the cell contains a formula result
  const isFormulaResult = value.startsWith('=');
  
  // Update inputValue when value changes (for drag operations)
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger edit if not dragging
    if (!e.defaultPrevented) {
      onEdit();
    }
  };
  
  return (
    <div
      className={`cell ${isFormulaResult ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
      style={style}
    >
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => { onChange(inputValue); onEdit(); }}
          className="border p-1 w-full h-full"
          autoFocus
        />
      ) : (
        <span 
          className={`flex items-center justify-center h-full ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
          title={isFormulaResult ? `Formula: ${value}` : ''}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default Cell; 