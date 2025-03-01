import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ id, children, style }) => {
  const { isOver, setNodeRef } = useDroppable({
    id
  });
  
  return (
    <div 
      ref={setNodeRef} 
      style={{
        ...style,
        backgroundColor: isOver ? 'rgba(0, 0, 255, 0.1)' : undefined,
        transition: 'background-color 0.2s ease'
      }}
    >
      {children}
    </div>
  );
};

export default DroppableArea; 