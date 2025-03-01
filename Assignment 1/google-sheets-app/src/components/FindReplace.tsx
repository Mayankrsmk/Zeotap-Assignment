import React, { useState } from 'react';

interface FindReplaceProps {
  cells: string[][];
  setCells: React.Dispatch<React.SetStateAction<string[][]>>;
}

const FindReplace: React.FC<FindReplaceProps> = ({ cells, setCells }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFind = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (cell.includes(findText) ? cell.replace(new RegExp(findText, 'g'), replaceText) : cell))
    );
    setCells(updatedCells);
  };

  const handleReplace = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (cell.includes(findText) ? cell.replace(new RegExp(findText, 'g'), replaceText) : cell))
    );
    setCells(updatedCells);
  };

  const handleReplaceAll = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (cell.includes(findText) ? cell.replace(new RegExp(findText, 'g'), replaceText) : cell))
    );
    setCells(updatedCells);
  };

  return (
    <div className="find-replace border-b">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Find & Replace
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-auto transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Find</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Text to find"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Replace</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="Replace with"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleFind}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Find
            </button>
            <button
              onClick={handleReplace}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              Replace All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindReplace; 