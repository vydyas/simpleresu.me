"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import "../app/custom-styles.css";
import { Check } from "lucide-react";
import FancyHeading from "./fancy-heading";
import { useStyling } from "@/lib/styling-context";
import { ResumeShimmer } from "./resume-shimmer";
import { Header, Summary, Experience, Education, Skills, Projects, Certifications } from './resume-sections';
import { DefaultTemplate } from './resume-templates/default';
import { ModernTemplate } from './resume-templates/modern';
// import Image from 'next/image';
import { ResumeConfig, UserData } from '@/types/resume';
import { ResumeConfig as ResumeConfigLib } from "@/lib/resume-config";

interface ResumeProps {
  userData: UserData & {
    certifications?: Array<{
      title: string;
      organization: string;
      completionDate: string;
      description?: string;
      credentialUrl?: string;
    }>;
  };
  config: ResumeConfig;
  onUserDataChange?: (newData: UserData) => void;
  githubId?: string;
  template?: string;
  zoom: number;
  scale?: number;
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

export const Resume = forwardRef<ResumeRef, ResumeProps>(
  function Resume(
    {
      userData,
      config,
      githubId,
      template = "default",
      zoom,
      scale = 1,
    }: ResumeProps,
    ref: React.ForwardedRef<ResumeRef>
  ) {
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [lines, setLines] = useState<LineItem[]>([]);
    const [showSaveIndicator, setShowSaveIndicator] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const { nameFont, nameColor, borderColor, skillsStyle, resumeBackgroundColor, fontSize } = useStyling();

    // A4 dimensions in pixels (assuming 96 DPI)
    const A4_WIDTH_PX = 794;  // 210mm
    const A4_HEIGHT_PX = 1123; // 297mm

    useImperativeHandle(ref, () => ({
      downloadPDF: async () => {
        console.log('PDF download requested');
      }
    }), []);

    const generateLines = useCallback(() => {
      console.log("Generating lines for:", userData, config);
      const newLines: LineItem[] = [];

      // Header section
      newLines.push({
        id: `line-${newLines.length}`,
        content: (
          <Header 
            userData={userData}
            nameFont={nameFont}
            nameColor={nameColor}
          />
        ),
        type: "header",
        section: "header",
      });

      // Summary section
      if (config.showSummary && userData.summary) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Summary summary={userData.summary} />,
          type: "summary",
          section: "summary",
        });
      }

      // Experience section
      if (config.showExperience && userData.positions?.length > 0) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Experience positions={userData.positions} />,
          type: "positions",
          section: "positions",
        });
      }

      // Education section
      if (config.showEducation && userData.educations?.length > 0) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Education educations={userData.educations} />,
          type: "education",
          section: "education",
        });
      }

      // Skills section
      if (config.showSkills && userData.skills?.length > 0) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Skills skills={userData.skills} style={skillsStyle} />,
          type: "skills",
          section: "skills",
        });
      }

      // Projects section
      if (config.showProjects && userData.projects?.length > 0) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Projects projects={userData.projects} />,
          type: "projects",
          section: "projects",
        });
      }

      // Add Certifications section
      if (config.showCertifications) {
        newLines.push({
          id: `line-${newLines.length}`,
          content: <Certifications certifications={userData.certifications} />,
          type: "certifications",
          section: "certifications",
        });
      }

      // Custom sections
      userData.customSections?.forEach((section) => {
        if (section.isVisible) {
          newLines.push({
            id: `line-${newLines.length}`,
            content: (
              <div>
                <FancyHeading>{section.title}</FancyHeading>
                <div
                  className="text-base ml-2 rich-text-content"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ),
            type: "custom",
            section: section.id,
          });
        }
      });

      return newLines;
    }, [userData, config, nameColor, nameFont, skillsStyle]);

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
          setLines((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            // Save the new order to localStorage
            const lineOrder = newItems.map((item) => item.id);
            localStorage.setItem("resumeLineOrder", JSON.stringify(lineOrder));
            setShowSaveIndicator(true); // Show save indicator
            setTimeout(() => setShowSaveIndicator(false), 2000); // Hide after 2 seconds
            return newItems;
          });
        }
      },
      [setShowSaveIndicator]
    );

    const applyStoredLineOrder = useCallback((generatedLines: LineItem[]) => {
      try {
        const savedOrder = localStorage.getItem("resumeLineOrder");
        if (savedOrder) {
          const orderArray = JSON.parse(savedOrder);
          // Create a map of id to line item for efficient lookup
          const lineMap = new Map(
            generatedLines.map((line: LineItem) => [line.id, line])
          );
          // Reconstruct lines array based on saved order
          const orderedLines = orderArray
            .map((id: string) => lineMap.get(id))
            .filter(
              (line: LineItem | undefined): line is LineItem =>
                line !== undefined
            );
          // Add any new lines that weren't in the saved order
          const newLines = generatedLines.filter(
            (line: LineItem) => !orderArray.includes(line.id)
          );
          return [...orderedLines, ...newLines];
        }
      } catch (error) {
        console.error("Error loading line order:", error);
      }
      return generatedLines;
    }, []);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient) {
        const lines = generateLines();
        const orderedLines = applyStoredLineOrder(lines);
        setLines(orderedLines);
      }
    }, [isClient, generateLines, applyStoredLineOrder]);

    useEffect(() => {
      const lines = generateLines();
      const orderedLines = applyStoredLineOrder(lines);
      setLines(orderedLines);
    }, [userData, config, githubId, generateLines, applyStoredLineOrder, nameColor]);

    useEffect(() => {
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }, [isFirstLoad]);

    if (isFirstLoad) {
      return <ResumeShimmer />;
    }

    const wrapperClass =
      "mx-auto bg-white overflow-hidden shadow-lg mt-8 mb-8";
    const zoomStyle = {
      transform: `scale(${zoom / 100})`,
      transformOrigin: "top center",
      width: zoom > 100 ? `${(100 * 100) / zoom}%` : "100%",
      margin: "0 auto",
    };

    const TemplateComponent = template === 'modern' ? ModernTemplate : DefaultTemplate;

    return (
      <div 
        className="relative bg-white shadow-lg mx-auto print:shadow-none"
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          fontSize: `${fontSize}px`,
          // Enable page breaks
          pageBreakAfter: 'always',
          pageBreakInside: 'avoid',
        }}
      >
        {/* Page Numbers */}
        <div className="fixed bottom-4 right-4 text-gray-400 text-sm print:block hidden">
          <span className="page"></span>
        </div>

        {/* Resume Content with page break considerations */}
        <div className="p-12 print:p-0">
          <TemplateComponent
            lines={lines}
            onDragEnd={handleDragEnd}
            resumeRef={resumeContainerRef}
            wrapperClass={wrapperClass}
            borderColor={borderColor}
            zoomStyle={zoomStyle}
            resumeBackgroundColor={resumeBackgroundColor}
          />
        </div>

        {showSaveIndicator && (
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-opacity shadow-sm z-50">
            <Check className="w-4 h-4" />
            <span className="text-sm">Saved</span>
          </div>
        )}

        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            /* Add page numbers */
            .page::after {
              content: counter(page);
            }

            /* Handle page breaks for sections */
            section {
              break-inside: avoid;
            }

            /* Force page break before specific sections if needed */
            .force-page-break {
              break-before: page;
            }
          }
        `}</style>
      </div>
    );
  }
);

Resume.displayName = 'Resume';
