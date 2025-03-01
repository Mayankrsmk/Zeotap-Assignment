# Google Sheets Application

A feature-rich spreadsheet application built with React and TypeScript that mimics core Google Sheets functionality.

## Tech Stack

- **React**: Used for building the component-based UI with efficient rendering
- **TypeScript**: Provides static typing to improve code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Modern build tool for fast development and optimized production builds
- **@dnd-kit**: Library for drag-and-drop functionality
- **Recharts**: Flexible charting library for data visualization

## Data Structures

### Core State Management

The application uses several key data structures to manage spreadsheet state:

#### Cell Data (2D Array)
- A two-dimensional array stores all cell values, allowing O(1) access to any cell by row and column indices.

#### Formatting State (Multiple 2D Arrays)
- Separate 2D arrays track formatting for each cell, maintaining the same structure as the main cells array for efficient parallel access.

#### Formula Dependencies (Map of Sets)
- A Map where keys are cell coordinates and values are Sets of dependent cell coordinates.
- This enables efficient formula recalculation when referenced cells change.

#### Charts (Array of Objects)
- An array of chart configuration objects that store all necessary data for rendering different chart types.

## Key Design Decisions

### Cell Referencing System
- Cells are referenced using A1 notation (e.g., A1, B2)
- Internally converted to zero-based indices for array access
- Formula parsing extracts cell references using regex

### Formula Evaluation
- Formulas are stored with a leading "=" in the cells array
- A separate Map tracks formula results for display
- Dependencies are tracked to enable reactive updates

### Virtualized Rendering
- Only visible rows and columns are rendered for performance
- Scroll detection dynamically loads more content as needed

### Drag and Drop
- Cell content can be moved or copied (with Shift key)
- Formatting is preserved during drag operations

### Persistence
- Complete spreadsheet state is serialized to JSON
- Custom file naming and loading functionality

## Why These Choices?

- **2D Arrays for Cell Data**: Provides direct O(1) access to any cell by coordinates, matching the natural grid structure of a spreadsheet
- **Separate Arrays for Formatting**: Allows efficient updates to specific formatting properties without affecting other aspects
- **Map for Dependencies**: Enables O(1) lookup of dependent cells when a referenced cell changes
- **TypeScript**: Ensures type safety across complex data structures and prevents common errors
- **React's useState**: Provides reactive updates while maintaining performance through selective re-rendering
- **Tailwind CSS**: Enables rapid UI development with consistent styling

This architecture balances performance, maintainability, and feature richness while keeping the codebase organized and extensible.
