export const evaluateFormula = (formula: string, cells: string[][]): string => {
  // Helper function to get values from a range of cells
  const getRangeValues = (range: string, cells: string[][]): string[] => {
    const [start, end] = range.split(':');
    const startCol = start.charCodeAt(0) - 65; // Convert column letter to index
    const startRow = parseInt(start.slice(1)) - 1; // Convert to zero-based index
    const endCol = end.charCodeAt(0) - 65;
    const endRow = parseInt(end.slice(1)) - 1;

    const values: string[] = [];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (i >= 0 && i < cells.length && j >= 0 && j < cells[i].length) {
          values.push(cells[i][j]); // Collect cell values as strings
        }
      }
    }
    return values;
  };

  // Mathematical Functions
  if (formula.startsWith('SUM')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
      return sum.toString();
    }
  } else if (formula.startsWith('AVERAGE')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const numValues = values.map(val => Number(val) || 0);
      const sum = numValues.reduce((acc, val) => acc + val, 0);
      return values.length > 0 ? (sum / values.length).toString() : '0';
    }
  } else if (formula.startsWith('MAX')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const numValues = values.map(val => Number(val) || 0);
      return numValues.length > 0 ? Math.max(...numValues).toString() : '0';
    }
  } else if (formula.startsWith('MIN')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const numValues = values.map(val => Number(val) || 0);
      return numValues.length > 0 ? Math.min(...numValues).toString() : '0';
    }
  } else if (formula.startsWith('COUNT')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const nonZeroValues = values.filter(val => val !== '' && !isNaN(Number(val)));
      return nonZeroValues.length.toString();
    }
  } 
  // Data Quality Functions
else if (formula.startsWith('TRIM')) {
  const matches = formula.match(/\(([^)]+)\)/);
  if (matches) {
    const cellReference = matches[1].trim();

    if (/^[A-Z]+\d+$/.test(cellReference)) { // Single cell reference (e.g., A1)
      const colIndex = cellReference.charCodeAt(0) - 65; // Convert column letter to index
      const rowIndex = parseInt(cellReference.slice(1)) - 1; // Convert to zero-based index
      
      if (rowIndex >= 0 && rowIndex < cells.length && colIndex >= 0 && colIndex < cells[rowIndex].length) {
        return cells[rowIndex][colIndex].trim(); // Trim only the single cell value
      }
    } else { // Range case
      const values = getRangeValues(cellReference, cells);
      return values.map(val => val.trim()).join(', '); // Trim all values in range
    }
  }
}
 else if (formula.startsWith('UPPER')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const cellReference = matches[1].trim();

      if (/^[A-Z]+\d+$/.test(cellReference)) { // Single cell reference (e.g., A1)
        const colIndex = cellReference.charCodeAt(0) - 65; // Convert column letter to index
        const rowIndex = parseInt(cellReference.slice(1)) - 1; // Convert to zero-based index
        
        if (rowIndex >= 0 && rowIndex < cells.length && colIndex >= 0 && colIndex < cells[rowIndex].length) {
          return cells[rowIndex][colIndex].toUpperCase(); // Convert only the single cell value to uppercase
        }
      } else { // Range case
        const values = getRangeValues(cellReference, cells);
        return values.map(val => val.toUpperCase()).join(', '); // Convert all values in range to uppercase
      }
    }
  } else if (formula.startsWith('LOWER')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const cellReference = matches[1].trim();

      if (/^[A-Z]+\d+$/.test(cellReference)) { // Single cell reference (e.g., A1)
        const colIndex = cellReference.charCodeAt(0) - 65; // Convert column letter to index
        const rowIndex = parseInt(cellReference.slice(1)) - 1; // Convert to zero-based index
        
        if (rowIndex >= 0 && rowIndex < cells.length && colIndex >= 0 && colIndex < cells[rowIndex].length) {
          return cells[rowIndex][colIndex].toLowerCase(); // Convert only the single cell value to lowercase
        }
      } else { // Range case
        const values = getRangeValues(cellReference, cells);
        return values.map(val => val.toLowerCase()).join(', '); // Convert all values in range to lowercase
      }
    }
  } else if (formula.startsWith('REMOVE_DUPLICATES')) {
    const matches = formula.match(/\(([^)]+)\)/);
    if (matches) {
      const values = getRangeValues(matches[1], cells);
      const uniqueValues = Array.from(new Set(values));
      return uniqueValues.join(', ');
    }
  }
  
  return ''; // Default return for unsupported formulas
}; 