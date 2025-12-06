import { Card } from "@/components/ui/card";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableLine } from "../draggable-line";
import { LineItem } from "@/types/resume";

interface DefaultTemplateProps {
  lines: LineItem[];
  onDragEnd: (event: DragEndEvent) => void;
  resumeRef: React.RefObject<HTMLDivElement>;
  wrapperClass: string;
  borderColor: string;
  zoomStyle: React.CSSProperties;
  resumeBackgroundColor?: string;
}

export function DefaultTemplate({
  lines,
  onDragEnd,
  resumeRef,
  wrapperClass,
  borderColor,
  zoomStyle,
  resumeBackgroundColor,
}: DefaultTemplateProps) {
  return (
    <div className="resume-container">
      <div className="resume-content" style={zoomStyle}>
        <Card
          ref={resumeRef}
          className={`${wrapperClass} resume-content border-t-4 relative`}
          style={{ 
            borderTopColor: borderColor,
            backgroundColor: resumeBackgroundColor || '#ffffff'
          }}
        >
          <div className="h-full overflow-y-auto px-4 py-2">
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext
                items={lines.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {lines.map((line) => (
                  <DraggableLine key={line.id} id={line.id}>
                    {line.content}
                  </DraggableLine>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </Card>
      </div>
    </div>
  );
} 