import React, { useState, useRef, useEffect } from 'react';

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
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onChangeFontSize: (size: string) => void;
  onChangeFontColor: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onBold, 
  onItalic, 
  onTrim, 
  onUpper, 
  onLower, 
  onRemoveDuplicates, 
  onSave, 
  onLoad, 
  onCreateChart,
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onChangeFontSize,
  onChangeFontColor
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  const fontSizes = ['10', '11', '12', '14', '16', '18', '20', '24', '28', '32'];
  
  // Smaller color palette with fewer colors but still well-organized
  const colorPalette = [
    // Row 1: Black, grays, white
    '#000000', '#434343', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    // Row 2: Blues
    '#0000FF', '#0066CC', '#3399FF', '#99CCFF', '#CCE8FF', '#E6F2FF',
    // Row 3: Reds
    '#FF0000', '#CC0000', '#FF6666', '#FF9999', '#FFCCCC', '#FCE5E5',
    // Row 4: Greens
    '#00FF00', '#00CC00', '#66FF66', '#99FF99', '#CCFFCC', '#E5FCE5',
    // Row 5: Yellows/Oranges
    '#FFFF00', '#FFCC00', '#FF9900', '#FFCC66', '#FFFFCC', '#FFF9E5',
    // Row 6: Purples/Pinks
    '#9900CC', '#FF00FF', '#CC66FF', '#FF99FF', '#FF66FF', '#FFE5FF'
  ];
  
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChangeFontColor(color);
    setShowColorPicker(false);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar bg-white shadow-sm border-b flex items-center p-1 sticky top-0 z-20 flex-wrap">
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
        
        {/* Font Size Dropdown */}
        <div className="relative">
          <select 
            onChange={(e) => onChangeFontSize(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded bg-white"
            title="Font Size"
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        {/* Font Color */}
        <div className="relative" ref={colorPickerRef}>
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)} 
            className="p-1.5 rounded hover:bg-gray-100 flex items-center"
            title="Font Color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            <div className="w-4 h-4 ml-1 rounded-sm border border-gray-300" style={{ backgroundColor: selectedColor }}></div>
          </button>
          
          {showColorPicker && (
            <div className="fixed mt-1 p-2 bg-white shadow-lg rounded border z-[1000]" 
                 style={{ 
                   width: '160px',
                   top: colorPickerRef.current ? colorPickerRef.current.getBoundingClientRect().bottom + 5 : 0,
                   left: colorPickerRef.current ? colorPickerRef.current.getBoundingClientRect().left : 0
                 }}>
              <div className="grid grid-cols-6 gap-1">
                {colorPalette.map((color, index) => (
                  <div 
                    key={index} 
                    className="w-4 h-4 cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      marginBottom: index % 6 === 5 ? '3px' : '0px' // Add space between rows
                    }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  ></div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '90px' }}>{selectedColor}</div>
                <button 
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-l h-6 mx-2"></div>
      
      {/* Row/Column Management */}
      <div className="flex space-x-1 mr-2">
        <button onClick={onAddRow} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Add Row">
          Add Row
        </button>
        <button onClick={onAddColumn} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Add Column">
          Add Column
        </button>
        <button onClick={onDeleteRow} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Delete Row">
          Delete Row
        </button>
        <button onClick={onDeleteColumn} className="px-2 py-1 text-sm rounded hover:bg-gray-100" title="Delete Column">
          Delete Column
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
        <button 
          onClick={onSave} 
          className="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 border border-gray-300" 
          title="Save spreadsheet"
        >
          Save
        </button>
        <button 
          onClick={onLoad} 
          className="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 border border-gray-300" 
          title="Load spreadsheet"
        >
          Load
        </button>
      </div>
      
      <div className="border-l h-6 mx-2"></div>
      
      <button 
        onClick={onCreateChart} 
        className="px-3 py-1 text-sm text-gray-700 rounded hover:bg-gray-100 border border-gray-300" 
        title="Create chart"
      >
        Create Chart
      </button>
    </div>
  );
};

export default Toolbar; 