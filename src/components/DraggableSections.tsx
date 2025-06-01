import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/SortableItem';

type Section = {
  id: string;
  title: string;
  subsections: string[];
};

type DraggableSectionsProps = {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
};

export function DraggableSections({ sections, onSectionsChange }: DraggableSectionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        onSectionsChange(newSections);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <SortableContext 
          items={sections}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableItem key={section.id} id={section.id}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{section.title}</h4>
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {section.subsections.length} {section.subsections.length === 1 ? 'subsection' : 'subsections'}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {section.subsections.map((subsection, idx) => (
                      <li key={idx}>{subsection}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
