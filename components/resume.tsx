"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { Card } from "@/components/ui/card";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { DraggableLine } from "./draggable-line";
import { GitHubRepos } from "./github-repos";
import { Shimmer } from "@/components/ui/shimmer";
import "../app/custom-styles.css";

interface Position {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  name: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  summary: string;
  positions: Position[];
  educations: Education[];
  skills: Skill[];
}

interface ResumeProps {
  userData: any;
  config: any;
  onUserDataChange?: (newData: any) => void;
  githubId?: string;
  template?: string;
  onResetResume?: (resetFn: () => void) => void;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
  zoom: number;
}

interface LineItem {
  id: string;
  content: React.ReactNode;
  type: string;
  section: string;
}

export interface ResumeRef {
  downloadPDF: () => Promise<void>;
}

export const Resume = forwardRef<ResumeRef, ResumeProps>(({
  userData,
  config,
  onUserDataChange,
  githubId,
  template = "default",
  onResetResume,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
  zoom,
}, ref) => {
  const resumeContainerRef = React.useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [lines, setLines] = React.useState<LineItem[]>([]);
  const [originalLines, setOriginalLines] = React.useState<LineItem[]>([]);

  const generateLines = React.useCallback(() => {
    const newLines: LineItem[] = [];
    let counter = 0;

    // Personal Info
    newLines.push({
      id: `line-${counter++}`,
      content: (
        <h1 className="text-2xl font-bold">
          {userData.firstName} {userData.lastName}
        </h1>
      ),
      type: 'header',
      section: 'personal'
    });

    if (userData.email) {
      newLines.push({
        id: `line-${counter++}`,
        content: <p className="text-gray-500">{userData.email}</p>,
        type: 'text',
        section: 'personal'
      });
    }

    if (userData.headline) {
      newLines.push({
        id: `line-${counter++}`,
        content: <p className="text-gray-700">{userData.headline}</p>,
        type: 'text',
        section: 'personal'
      });
    }

    // Summary
    if (config.showSummary && userData.summary) {
      newLines.push({
        id: `line-${counter++}`,
        content: <h3 className="text-sm font-semibold pb-2 uppercase">Summary</h3>,
        type: 'section-header',
        section: 'summary'
      });
      newLines.push({
        id: `line-${counter++}`,
        content: <div className="mt-2" dangerouslySetInnerHTML={{ __html: userData.summary }} />,
        type: 'text',
        section: 'summary'
      });
    }

    // Experience
    if (config.showExperience && userData.positions?.length > 0) {
      newLines.push({
        id: `line-${counter++}`,
        content: <h3 className="text-sm font-semibold pb-2 uppercase">Experience</h3>,
        type: 'section-header',
        section: 'experience'
      });

      userData.positions.forEach((position: any, index: number) => {
        newLines.push({
          id: `line-exp-title-${index}-${counter++}`,
          content: <h4 className="font-medium">{position.title}</h4>,
          type: 'subsection-header',
          section: 'experience'
        });
        newLines.push({
          id: `line-exp-company-${index}-${counter++}`,
          content: <p className="text-gray-600">{position.company}</p>,
          type: 'text',
          section: 'experience'
        });
        newLines.push({
          id: `line-exp-dates-${index}-${counter++}`,
          content: (
            <p className="text-gray-500 text-sm">
              {position.startDate} - {position.endDate}
            </p>
          ),
          type: 'text',
          section: 'experience'
        });
        if (position.description) {
          newLines.push({
            id: `line-exp-desc-${index}-${counter++}`,
            content: <p className="mt-1">{position.description}</p>,
            type: 'text',
            section: 'experience'
          });
        }
      });
    }

    // Education
    if (config.showEducation && userData.educations?.length > 0) {
      newLines.push({
        id: `line-${counter++}`,
        content: <h3 className="text-sm font-semibold pb-2 uppercase">Education</h3>,
        type: 'section-header',
        section: 'education'
      });

      userData.educations.forEach((education: any, index: number) => {
        newLines.push({
          id: `line-edu-school-${index}-${counter++}`,
          content: <h4 className="font-medium">{education.schoolName}</h4>,
          type: 'subsection-header',
          section: 'education'
        });
        newLines.push({
          id: `line-edu-degree-${index}-${counter++}`,
          content: (
            <p className="text-gray-600">
              {education.degree} in {education.fieldOfStudy}
            </p>
          ),
          type: 'text',
          section: 'education'
        });
        newLines.push({
          id: `line-edu-dates-${index}-${counter++}`,
          content: (
            <p className="text-gray-500 text-sm">
              {education.startDate} - {education.endDate}
            </p>
          ),
          type: 'text',
          section: 'education'
        });
      });
    }

    // Skills
    if (config.showSkills && userData.skills?.length > 0) {
      newLines.push({
        id: `line-${counter++}`,
        content: <h3 className="text-sm font-semibold pb-2 uppercase">Skills</h3>,
        type: 'section-header',
        section: 'skills'
      });

      // Group skills in rows of 3
      const skillGroups = [];
      for (let i = 0; i < userData.skills.length; i += 3) {
        skillGroups.push(userData.skills.slice(i, Math.min(i + 3, userData.skills.length)));
      }

      skillGroups.forEach((group, groupIndex) => {
        newLines.push({
          id: `line-skills-${groupIndex}-${counter++}`,
          content: (
            <div className="flex flex-wrap gap-2">
              {group.map((skill: any, idx: number) => (
                <span
                  key={idx}
                  className="skill-chip bg-muted text-primary px-3 py-1 rounded-full text-sm inline-flex items-center justify-center"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ),
          type: 'skills-group',
          section: 'skills'
        });
      });
    }

    // GitHub Repositories
    if (config.showRepositories && githubId) {
      newLines.push({
        id: `line-${counter++}`,
        content: <h3 className="text-sm font-semibold pb-2 uppercase">Open Source</h3>,
        type: 'section-header',
        section: 'repositories'
      });
      newLines.push({
        id: `line-${counter++}`,
        content: <GitHubRepos githubId={githubId} />,
        type: 'component',
        section: 'repositories'
      });
    }

    return newLines;
  }, [userData, config, githubId]);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleReset = React.useCallback(() => {
    setLines([...originalLines]);
  }, [originalLines]);

  useImperativeHandle(ref, () => ({
    downloadPDF: async () => {
      if (!resumeContainerRef.current) {
        console.error('Resume container not ready');
        return;
      }

      try {
        // Dynamically import html2pdf.js
        const html2pdf = (await import('html2pdf.js')).default;
        
        // Create a deep clone of the resume container to manipulate
        const clonedContainer = resumeContainerRef.current.cloneNode(true) as HTMLDivElement;
        
        // Remove any interactive elements or buttons
        const interactiveElements = clonedContainer.querySelectorAll('button, [contenteditable]');
        interactiveElements.forEach(el => el.remove());

        // Adjust styles for PDF
        clonedContainer.style.transform = 'scale(1)';
        clonedContainer.style.transformOrigin = 'top left';
        clonedContainer.style.width = '210mm';
        clonedContainer.style.height = '297mm';
        clonedContainer.style.margin = '0';
        clonedContainer.style.padding = '10mm';
        clonedContainer.style.boxSizing = 'border-box';
        clonedContainer.style.overflow = 'hidden';

        // Additional styling to control paragraph spacing
        const paragraphs = clonedContainer.querySelectorAll('p');
        paragraphs.forEach(p => {
          (p as HTMLElement).style.margin = '0';
          (p as HTMLElement).style.padding = '0';
          (p as HTMLElement).style.lineHeight = '1.2';
        });

        const opt = {
          margin: [0, 0, 0, 0],
          filename: `${userData.firstName}_${userData.lastName}_Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
          },
          pagebreak: {
            mode: 'avoid-all'
          }
        };

        html2pdf().set(opt).from(clonedContainer).save();
      } catch (error) {
        console.error('PDF download failed:', error);
      }
    }
  }), [userData]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient) {
      const newLines = generateLines();
      setLines(newLines);
      setOriginalLines(newLines);
    }
  }, [isClient, generateLines]);

  React.useEffect(() => {
    if (onResetResume) {
      onResetResume(handleReset);
    }
  }, [onResetResume, handleReset]);

  if (!isClient) {
    return null;
  }

  const wrapperClass = "w-[210mm] mx-auto bg-white overflow-hidden shadow-lg";
  const templateClass = template === "modern" ? "p-8" : "";

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="resume-container">
        <div className="resume-content">
          <Card 
            ref={resumeContainerRef}
            className={`${wrapperClass} resume-content`}
          >
            <div className="h-full overflow-y-auto px-6 py-8 border-2 border-dashed">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={lines.map(item => item.id)}
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
      <button onClick={handleReset}>Reset</button>
    </div>
  );
});

export function ResumeShimmer() {
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <Shimmer className="h-12 w-3/4" />
      <Shimmer className="h-6 w-1/2" />
      <div className="space-y-2">
        {[1, 2, 3].map((index) => (
          <Shimmer key={`shimmer-${index}`} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
