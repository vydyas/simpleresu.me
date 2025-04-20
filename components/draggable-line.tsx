import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableLineProps {
  id: string;
  children: React.ReactNode;
  isMobileOrTablet?: boolean;
}

export function DraggableLine({ id, children, isMobileOrTablet }: DraggableLineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isMobileOrTablet });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isMobileOrTablet ? 'default' : 'move',
    touchAction: 'auto',
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isMobileOrTablet ? {} : { ...attributes, ...listeners })}
      className={`group ${!isMobileOrTablet ? 'hover:bg-muted/50' : ''} rounded px-1 -mx-1`}
    >
      {children}
    </div>
  );
}
