import React, { useState } from 'react';
import { evaluateFormula } from '../utils/parser';

interface FunctionTesterProps {
  cells: string[][];
}

const FunctionTester: React.FC<FunctionTesterProps> = ({ cells }) => {
  const [formula, setFormula] = useState('=SUM(A1:A5)');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = () => {
    try {
      if (!formula.startsWith('=')) {
        throw new Error('Formula must start with =');
      }
      
      const value = evaluateFormula(formula.slice(1), cells);
      setResult(value);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  };

  return (
    <div className="function-tester">
      <h2 className="text-lg font-medium mb-3 text-gray-800">Formula Tester</h2>
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter a formula</label>
          <div className="flex">
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="=SUM(A1:A5)"
            />
            <button 
              onClick={handleTest} 
              className="px-4 py-2 text-sm text-gray-700 rounded-r hover:bg-gray-100 border border-gray-300 border-l-0"
            >
              Test
            </button>
          </div>
        </div>
        
        {result !== null && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <h3 className="text-sm font-medium text-green-800 mb-1">Result:</h3>
            <div className="text-green-700">{result}</div>
          </div>
        )}
        
        {error !== null && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h3 className="text-sm font-medium text-red-800 mb-1">Error:</h3>
            <div className="text-red-700">{error}</div>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Available Functions:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li><code>SUM(range)</code> - Sum all values in range</li>
            <li><code>AVERAGE(range)</code> - Calculate average of values in range</li>
            <li><code>COUNT(range)</code> - Count non-empty cells in range</li>
            <li><code>MAX(range)</code> - Find maximum value in range</li>
            <li><code>MIN(range)</code> - Find minimum value in range</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FunctionTester; 