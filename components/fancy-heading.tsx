"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { useStyling } from "@/lib/styling-context";

interface FancyHeadingProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  canDelete?: boolean;
  canRename?: boolean;
}

export default function FancyHeading({ 
  children, 
  onDelete, 
  onRename,
  canDelete = true,
  canRename = true 
}: FancyHeadingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(children?.toString() || "");
  const { headingColor, headingFont, headingStyle } = useStyling();

  const handleRename = () => {
    if (onRename) {
      onRename(editValue);
    }
    setIsEditing(false);
  };

  const getHeadingStyles = () => {
    switch (headingStyle) {
      case 'background':
        return 'bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded';
      case 'border-bottom':
        return 'border-b-2 pb-1';
      case 'border-top':
        return 'border-t-2 pt-1';
      default:
        return '';
    }
  };

  return (
    <div className="group flex items-center justify-between mb-2">
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="text-base font-semibold"
            autoFocus
          />
        </div>
      ) : (
        <h2 
          className={`text-base font-semibold ${headingFont} ${getHeadingStyles()}`}
          style={{ color: headingColor }}
        >
          {children}
        </h2>
      )}
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {canRename && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Rename section"
          >
            <Pencil className="h-3 w-3 text-gray-500" />
          </button>
        )}
        {canDelete && onDelete && (
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Delete section"
          >
            <Trash2 className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
