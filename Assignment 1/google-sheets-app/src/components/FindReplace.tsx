import React, { useState } from 'react';

const FindReplace: React.FC<{ cells: string[][]; setCells: React.Dispatch<React.SetStateAction<string[][]>> }> = ({ cells, setCells }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleFindReplace = () => {
    const updatedCells = cells.map(row =>
      row.map(cell => (cell.includes(findText) ? cell.replace(new RegExp(findText, 'g'), replaceText) : cell))
    );
    setCells(updatedCells);
  };

  return (
    <div className="find-replace flex space-x-2 p-2 border-b">
      <input
        type="text"
        placeholder="Find"
        value={findText}
        onChange={(e) => setFindText(e.target.value)}
        className="border p-1"
      />
      <input
        type="text"
        placeholder="Replace"
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        className="border p-1"
      />
      <button onClick={handleFindReplace} className="bg-gray-200 p-1 rounded">Find & Replace</button>
    </div>
  );
};

export default FindReplace; 