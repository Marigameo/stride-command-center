import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
};

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative group"
    >
      <div 
        {...listeners} 
        {...attributes}
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="9" cy="5" r="1"></circle>
          <circle cx="9" cy="19" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <circle cx="15" cy="5" r="1"></circle>
          <circle cx="15" cy="19" r="1"></circle>
        </svg>
      </div>
      {children}
    </div>
  );
}
