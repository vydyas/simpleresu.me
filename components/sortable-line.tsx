"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableLineProps {
  line: {
    id: string;
    content: React.ReactNode;
    type: string;
  };
}

export function SortableLine({ line }: SortableLineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: line.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative mb-6 last:mb-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-0 hidden h-6 w-6 -translate-x-2 cursor-grab items-center justify-center rounded-md hover:bg-gray-100 group-hover:flex active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      {line.content}
    </div>
  );
} 