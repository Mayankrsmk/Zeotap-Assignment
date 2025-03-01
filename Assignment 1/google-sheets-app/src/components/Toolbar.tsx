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
    <div className="toolbar bg-white shadow-sm border-b flex items-center p-1 sticky top-0 z-10">
      <div className="flex space-x-1 mr-2">
        <button onClick={onBold} className="p-1.5 rounded hover:bg-gray-100" title="Bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H7V7h4a2.5 2.5 0 012.5 2.5v.5z" />
            <path d="M10.5 15H7v-5h3.5a2.5 2.5 0 010 5z" />
          </svg>
        </button>
        <button onClick={onItalic} className="p-1.5 rounded hover:bg-gray-100" title="Italic">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 5h8v2H6zM6 9h8v2H6zM6 13h8v2H6z" />
          </svg>
        </button>
      </div>
      
      <div className="border-l h-6 mx-2"></div>
      
      <div className="flex space-x-1 mr-2">
        <button onClick={onTrim} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Trim whitespace">TRIM</button>
        <button onClick={onUpper} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Convert to uppercase">UPPER</button>
        <button onClick={onLower} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Convert to lowercase">LOWER</button>
        <button onClick={onRemoveDuplicates} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Remove duplicate values">REMOVE DUPLICATES</button>
      </div>
      
      <div className="border-l h-6 mx-2"></div>
      
      <div className="flex space-x-1">
        <button onClick={onSave} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Save spreadsheet">
          Save
        </button>
        <button onClick={onLoad} className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Load spreadsheet">
          Load
        </button>
      </div>
      
      <div className="border-l h-6 mx-2"></div>
      
      <button onClick={onCreateChart} className="px-3 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100" title="Create chart">
        Create Chart
      </button>
    </div>
  );
};

export default Toolbar; 