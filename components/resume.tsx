"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { GitHubRepos } from "./github-repos";
import { Shimmer } from "@/components/ui/shimmer";
import "../app/custom-styles.css"; // Make sure this import is present
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableSection } from "./sortable-section";

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
  userData: UserData;
  githubId: string;
  template: string;
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
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: Error) => void;
}

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

export function Resume({
  userData,
  githubId,
  template,
  config,
}: ResumeProps) {
  const [sections, setSections] = useState<Array<{
    id: string;
    component: () => React.ReactNode;
    show: boolean;
  }>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const renderPersonalInfo = () => (
      <CardHeader className="flex items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-gray-500">{userData.email}</p>
          <p className="text-gray-700 mt-2">{userData.headline}</p>
        </div>
      </CardHeader>
    );

    const renderSummary = () => (
      <div>
        <h3 className="text-sm font-semibold pb-2 uppercase">Summary</h3>
        <div dangerouslySetInnerHTML={{ __html: userData.summary }} />
      </div>
    );

    const renderExperience = () => (
      <div>
        <h3 className="text-sm font-semibold pb-2 uppercase">Experience</h3>
        {userData.positions.map((position, index) => (
          <div key={index} className="mb-2">
            <h4 className="font-medium">{position.title}</h4>
            <p className="text-gray-600">{position.company}</p>
            <p className="text-gray-500 text-sm">
              {position.startDate} - {position.endDate}
            </p>
            <p className="mt-1">{position.description}</p>
          </div>
        ))}
      </div>
    );

    const renderEducation = () => (
      <div>
        <h3 className="text-sm font-semibold pb-2 uppercase">Education</h3>
        {userData.educations.map((education, index) => (
          <div key={index} className="mb-2">
            <h4 className="font-medium">{education.schoolName}</h4>
            <p className="text-gray-600">
              {education.degree} in {education.fieldOfStudy}
            </p>
            <p className="text-gray-500 text-sm">
              {education.startDate} - {education.endDate}
            </p>
          </div>
        ))}
      </div>
    );

    const renderSkills = () => (
      <div>
        <h3 className="text-sm font-semibold pb-2 uppercase">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill, index) => (
            <span
              key={`skill-${index}`}
              className="skill-chip bg-muted text-primary px-3 py-1 rounded-full text-sm inline-flex items-center justify-center"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    );

    setSections([
      { id: 'personal-info', component: renderPersonalInfo, show: true },
      { id: 'summary', component: renderSummary, show: config.showSummary },
      { id: 'experience', component: renderExperience, show: config.showExperience },
      { id: 'education', component: renderEducation, show: config.showEducation },
      { id: 'skills', component: renderSkills, show: config.showSkills },
      { id: 'repositories', component: () => config.showRepositories ? (
        <div>
          <GitHubRepos githubId={githubId} />
        </div>
      ) : null, show: config.showRepositories },
    ]);
  }, [config, userData, githubId]);

  const renderTemplate = () => {
    const content = (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map((s) => s.id)}>
          <div className="space-y-2">
            {sections.map(
              (section) =>
                section.show && (
                  <SortableSection key={section.id} id={section.id}>
                    <div className="border-b-2 relative group transition-all duration-200 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:ring-2 hover:ring-blue-400 p-2 hover:cursor-grab active:cursor-grabbing">
                      {section.component()}
                    </div>
                  </SortableSection>
                )
            )}
          </div>
        </SortableContext>
      </DndContext>
    );

    const wrapperClass = "w-[210mm] mx-auto bg-white overflow-hidden shadow-lg";
    const templateClass = template === "modern" ? "p-8" : "";

    switch (template) {
      case "modern":
        return (
          <div className={`${wrapperClass} resume-content ${templateClass}`}>
            <div className="h-full">{content}</div>
          </div>
        );
      default:
        return (
          <Card className={`${wrapperClass} resume-content`}>
            <div className="h-full overflow-y-auto px-6 border-2 border-dashed">{content}</div>
          </Card>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="resume-container">
        <div className="resume-content">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
