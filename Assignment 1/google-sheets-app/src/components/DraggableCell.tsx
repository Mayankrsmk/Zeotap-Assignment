import React, { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableCellProps {
  id: string;
  value: string;
  onChange: (newValue: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  style?: React.CSSProperties;
  isBold?: boolean;
  isItalic?: boolean;
  fontSize?: string;
  fontColor?: string;
  rowIndex: number;
  colIndex: number;
}

const DraggableCell: React.FC<DraggableCellProps> = ({ 
  id, 
  value, 
  onChange, 
  isEditing, 
  onEdit, 
  style, 
  isBold, 
  isItalic, 
  fontSize = '14',
  fontColor = '#000000',
  rowIndex, 
  colIndex 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const isFormulaResult = value.startsWith('=');
  const mouseDownTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  
  // Update inputValue when value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      value,
      rowIndex,
      colIndex
    },
    disabled: isEditing
  });
  
  // Update the dragging ref when isDragging changes
  React.useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  
  const handleMouseDown = () => {
    mouseDownTimeRef.current = Date.now();
  };
  
  const handleMouseUp = () => {
    // If this was a short click (less than 200ms) and we're not dragging, enter edit mode
    const clickDuration = Date.now() - mouseDownTimeRef.current;
    if (clickDuration < 200 && !isDraggingRef.current && !isEditing) {
      onEdit();
    }
  };
  
  const cellStyle = {
    ...style,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isEditing ? 'text' : 'grab',
    position: 'relative' as const,
    zIndex: isDragging ? 1000 : 1
  };
  
  return (
    <div
      ref={setNodeRef}
      className={`cell ${isFormulaResult ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={cellStyle}
      {...(isEditing ? {} : { ...attributes, ...listeners })}
    >
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => { 
            onChange(inputValue); 
            onEdit(); // Exit edit mode on blur
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange(inputValue);
              onEdit(); // Exit edit mode on Enter
            }
          }}
          className="border border-blue-500 p-1 w-full h-full outline-none shadow-sm"
          autoFocus
        />
      ) : (
        <span 
          className={`flex items-center px-4 h-full truncate ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
          style={{ fontSize: `${fontSize}px`, color: fontColor }}
          title={isFormulaResult ? `Formula: ${value}` : value}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default DraggableCell; 