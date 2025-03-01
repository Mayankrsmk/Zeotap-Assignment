import React from 'react';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onTrim: () => void;
  onUpper: () => void;
  onLower: () => void;
  onRemoveDuplicates: () => void;
  onSave: () => void;
  onLoad: () => void;
  onCreateChart: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onBold, onItalic, onTrim, onUpper, onLower, onRemoveDuplicates, onSave, onLoad, onCreateChart 
}) => {
  return (
    <div className="toolbar flex space-x-2 p-2 border-b">
      <button onClick={onBold} className="bg-gray-200 p-1 rounded">Bold</button>
      <button onClick={onItalic} className="bg-gray-200 p-1 rounded">Italic</button>
      <button onClick={onTrim} className="bg-gray-200 p-1 rounded">TRIM</button>
      <button onClick={onUpper} className="bg-gray-200 p-1 rounded">UPPER</button>
      <button onClick={onLower} className="bg-gray-200 p-1 rounded">LOWER</button>
      <button onClick={onRemoveDuplicates} className="bg-gray-200 p-1 rounded">REMOVE DUPLICATES</button>
      <div className="border-l mx-2"></div>
      <button onClick={onSave} className="bg-blue-500 text-white p-1 rounded">Save</button>
      <button onClick={onLoad} className="bg-green-500 text-white p-1 rounded">Load</button>
      <div className="border-l mx-2"></div>
      <button onClick={onCreateChart} className="bg-purple-500 text-white p-1 rounded">Create Chart</button>
    </div>
  );
};

export default Toolbar; 