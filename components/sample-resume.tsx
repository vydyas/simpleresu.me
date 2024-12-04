import React, { Suspense, forwardRef, useImperativeHandle, useRef } from "react";
import dynamic from "next/dynamic";
import { Resume } from "./resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GoogleSearchResume = dynamic(
  () => import("@/components/resume-templates/google-search"),
  { ssr: false }
);
const GitHubProfileResume = dynamic(
  () => import("@/components/resume-templates/github-profile"),
  { ssr: false }
);

interface SampleResumeProps {
  template: string;
  githubId: string;
  config: {
    showPhoto: boolean;
    showSummary: boolean;
    showExperience: boolean;
    showEducation: boolean;
    showSkills: boolean;
    showProjects: boolean;
    showRepositories: boolean;
    showAwards: boolean;
    showLanguages: boolean;
    showVolunteer: boolean;
  };
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    headline: string;
    summary: string;
    positions: Array<{
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    educations: Array<{
      schoolName: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate: string;
    }>;
    skills: Array<{ name: string }>;
  };
  zoom?: number;
}

export interface SampleResumeRef {
  downloadPDF: () => Promise<void>;
}

const SampleResume = forwardRef<SampleResumeRef, SampleResumeProps>(
  ({ template, githubId, config, userData, zoom = 100 }, ref) => {
    const resumeRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      downloadPDF: async () => {
        if (!resumeRef.current) return;

        try {
          // Temporarily remove zoom transform for PDF generation
          const element = resumeRef.current;
          const originalTransform = element.style.transform;
          element.style.transform = 'none';

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });

          // Restore zoom transform
          element.style.transform = originalTransform;

          const imgWidth = 210; // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          // Add image to PDF
          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            0,
            imgWidth,
            imgHeight
          );

          pdf.save(`${userData.firstName}_${userData.lastName}_Resume.pdf`);
        } catch (error) {
          console.error('Error generating PDF:', error);
          throw error;
        }
      }
    }));

    const ResumeComponent = React.useMemo(() => {
      switch (template) {
        case "google-search":
          return GoogleSearchResume;
        case "github-profile":
          return GitHubProfileResume;
        default:
          return Resume;
      }
    }, [template]);

    return (
      <div className="min-h-full">
        <div 
          ref={resumeRef}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ResumeComponent
              userData={userData}
              githubId={githubId}
              template={template}
              config={config}
            />
          </Suspense>
        </div>
      </div>
    );
  }
);

SampleResume.displayName = 'SampleResume';

export default SampleResume;
