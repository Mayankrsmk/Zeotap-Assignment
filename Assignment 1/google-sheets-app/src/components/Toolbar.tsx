import React from 'react';

const Toolbar: React.FC<{ onBold: () => void; onItalic: () => void; onTrim: () => void; onUpper: () => void; onLower: () => void; onRemoveDuplicates: () => void; }> = ({ onBold, onItalic, onTrim, onUpper, onLower, onRemoveDuplicates }) => {
  return (
    <div className="toolbar flex space-x-2 p-2 border-b">
      <button onClick={onBold} className="bg-gray-200 p-1 rounded">Bold</button>
      <button onClick={onItalic} className="bg-gray-200 p-1 rounded">Italic</button>
      <button onClick={onTrim} className="bg-gray-200 p-1 rounded">TRIM</button>
      <button onClick={onUpper} className="bg-gray-200 p-1 rounded">UPPER</button>
      <button onClick={onLower} className="bg-gray-200 p-1 rounded">LOWER</button>
      <button onClick={onRemoveDuplicates} className="bg-gray-200 p-1 rounded">REMOVE DUPLICATES</button>
    </div>
  );
};

export default Toolbar; 