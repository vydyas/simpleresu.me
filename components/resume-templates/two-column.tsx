"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableLine } from "../sortable-line";
import { cn } from "@/lib/utils";
import { TwoColumnHeader } from "./two-column/header";
import { TwoColumnSummary } from "./two-column/summary";
import { TwoColumnExperience } from "./two-column/experience";
import { TwoColumnEducation } from "./two-column/education";
import { TwoColumnSkills } from "./two-column/skills";
import { TwoColumnProjects } from "./two-column/projects";

interface TwoColumnTemplateProps {
  lines: any[];
  onDragEnd: (event: DragEndEvent) => void;
  resumeRef: React.RefObject<HTMLDivElement>;
  wrapperClass: string;
  borderColor: string;
  zoomStyle: React.CSSProperties;
  resumeBackgroundColor: string;
  userData: any;
  config: any;
}

export function TwoColumnTemplate({
  lines,
  onDragEnd,
  resumeRef,
  wrapperClass,
  borderColor,
  zoomStyle,
  resumeBackgroundColor,
  userData,
  config,
}: TwoColumnTemplateProps) {
  return (
    <div
      className={cn(wrapperClass, "relative")}
      style={{ ...zoomStyle, backgroundColor: resumeBackgroundColor }}
      ref={resumeRef}
    >
      <div className="a4-page-dimensions mx-auto p-8" style={{ borderColor }}>
        <div className="flex gap-8">
          {/* Left Column - 60% width */}
          <div className="flex-[6] space-y-6">
            <TwoColumnHeader userData={userData} />
            {config.showSummary && <TwoColumnSummary summary={userData.summary} />}
            {config.showExperience && (
              <TwoColumnExperience positions={userData.positions} />
            )}
          </div>

          {/* Right Column - 40% width */}
          <div className="flex-[4] space-y-6 border-l pl-8">
            {config.showEducation && (
              <TwoColumnEducation educations={userData.educations} />
            )}
            {config.showSkills && <TwoColumnSkills skills={userData.skills} />}
            {config.showProjects && (
              <TwoColumnProjects projects={userData.projects} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 