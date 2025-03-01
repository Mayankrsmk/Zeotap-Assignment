import React, { useState } from 'react';
import { evaluateFormula } from '../utils/parser';

interface FunctionTesterProps {
  cells: string[][];
}

const FunctionTester: React.FC<FunctionTesterProps> = ({ cells }) => {
  const [selectedFunction, setSelectedFunction] = useState<string>('SUM');
  const [range, setRange] = useState<string>('A1:A3');
  const [result, setResult] = useState<string>('');

  const functions = [
    'SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT',
    'TRIM', 'UPPER', 'LOWER', 'REMOVE_DUPLICATES'
  ];

  const handleTest = () => {
    try {
      const formula = `${selectedFunction}(${range})`;
      const testResult = evaluateFormula(formula, cells);
      setResult(testResult);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="function-tester p-4 border-t mt-4">
      <h2 className="text-xl font-bold mb-2">Function Tester</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2 items-center">
          <label className="w-24">Function:</label>
          <select 
            value={selectedFunction} 
            onChange={(e) => setSelectedFunction(e.target.value)}
            className="border p-1"
          >
            {functions.map(func => (
              <option key={func} value={func}>{func}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2 items-center">
          <label className="w-24">Range:</label>
          <input 
            type="text" 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g., A1:A3" 
            className="border p-1"
          />
        </div>
        
        <button 
          onClick={handleTest} 
          className="bg-blue-500 text-white px-4 py-2 rounded w-24"
        >
          Test
        </button>
        
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <div className="border p-2 mt-1 min-h-[40px] bg-gray-50">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionTester; 