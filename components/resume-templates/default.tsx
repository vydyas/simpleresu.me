import { Card } from "@/components/ui/card";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableLine } from "../draggable-line";
import { LineItem } from "@/types/resume";
import { ResumeConfig } from "@/lib/resume-config";
import { UserData } from "@/types/resume";
import { Header } from "../resume-sections/header";
import { Summary } from "../resume-sections/summary";
import { Experience } from "../resume-sections/experience";
import { Education } from "../resume-sections/education";
import { Skills } from "../resume-sections/skills";
import { Projects } from "../resume-sections/projects";
import { CustomSections } from "../resume-sections/custom-sections";
import { Certifications } from "../resume-sections/certifications";
import { useEffect, useRef, useState } from "react";

interface DefaultTemplateProps {
  config: ResumeConfig;
  userData: UserData;
}

export function DefaultTemplate({ config, userData }: DefaultTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<Set<string>>(new Set());

  // Monitor content height and add page breaks where needed
  useEffect(() => {
    if (!contentRef.current) return;

    const A4_HEIGHT_PX = 1123; // 297mm
    const sections = contentRef.current.children;
    let currentHeight = 0;
    const newPageBreaks = new Set<string>();

    Array.from(sections).forEach((section) => {
      const rect = section.getBoundingClientRect();
      currentHeight += rect.height;

      if (currentHeight > A4_HEIGHT_PX) {
        newPageBreaks.add(section.id);
        currentHeight = rect.height;
      }
    });

    setPageBreaks(newPageBreaks);
  }, [userData, config]);

  return (
    <div ref={contentRef}>
      <section id="header">
        <Header userData={userData} config={config} />
      </section>

      {config.showSummary && (
        <section id="summary" className={pageBreaks.has('summary') ? 'force-page-break' : ''}>
          <Summary userData={userData} />
        </section>
      )}

      <section id="experience" className={pageBreaks.has('experience') ? 'force-page-break' : ''}>
        <Experience userData={userData} />
      </section>

      <section id="education" className={pageBreaks.has('education') ? 'force-page-break' : ''}>
        <Education userData={userData} />
      </section>

      {config.showSkills && (
        <section id="skills" className={pageBreaks.has('skills') ? 'force-page-break' : ''}>
          <Skills userData={userData} />
        </section>
      )}

      {config.showProjects && userData.projects && userData.projects.length > 0 && (
        <section id="projects" className={pageBreaks.has('projects') ? 'force-page-break' : ''}>
          <Projects userData={userData} />
        </section>
      )}

      {config.showCertifications && userData.certifications && userData.certifications.length > 0 && (
        <section id="certifications" className={pageBreaks.has('certifications') ? 'force-page-break' : ''}>
          <Certifications userData={userData} />
        </section>
      )}

      {userData.customSections && (
        <section id="custom-sections" className={pageBreaks.has('custom-sections') ? 'force-page-break' : ''}>
          <CustomSections sections={userData.customSections} />
        </section>
      )}
    </div>
  );
} 