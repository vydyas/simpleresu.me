"use client";

import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Trash2, Plus, Pencil, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { ResumeConfig, isValidConfigKey, useResumeConfig } from "@/lib/resume-config";
import debounce from "lodash/debounce";
import { FloatingControls } from './floating-controls';
import { OnlineUsers } from './online-users';
import { ResumeScore } from './resume-score';
import { UserData as UserDataType } from "@/types/resume";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CustomSection {
  id: string;
  title: string;
  content: string;
  isVisible: boolean;
}

interface Certification {
  title: string;
  organization: string;
  completionDate: string;
  description?: string;
  credentialUrl?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  summary: string;
  location: string;
  phoneNumber: string;
  linkedinId: string;
  githubId: string;
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
  skills: Array<{
    name: string;
  }>;
  projects?: Array<{
    title: string;
    link: string;
    description: string;
  }>;
  customSections?: CustomSection[];
  certifications?: UserDataType['certifications'];
}

interface RightSidebarProps {
  config: ResumeConfig;
  onConfigChange: (key: keyof ResumeConfig, value: boolean) => void;
  userData: UserData;
  onUserDataChange: (data: Partial<UserData>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onClose?: () => void;
}

export function RightSidebar({
  config,
  onConfigChange,
  userData,
  onUserDataChange,
  zoom,
  onZoomChange,
  onClose,
}: RightSidebarProps) {
  const { isLoaded } = useResumeConfig();
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Create a memoized version of the debounce function
  const debouncedUpdate = useMemo(
    () => debounce((data: Partial<UserData>) => onUserDataChange(data), 300),
    [onUserDataChange]
  );

  // Use the memoized debounce function in handleInputChange
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      const newData = {
        ...userData,
        [field]: value,
      };
      // Update local state immediately
      onUserDataChange(newData);
      // Use the memoized debounced function
      debouncedUpdate(newData);
    },
    [userData, onUserDataChange, debouncedUpdate]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePositionChange = useCallback(
    (index: number, field: string, value: string) => {
      const newPositions = [...userData.positions];
      newPositions[index] = { ...newPositions[index], [field]: value };
      onUserDataChange({ ...userData, positions: newPositions });
    },
    [userData, onUserDataChange]
  );

  const handleEducationChange = useCallback(
    (index: number, field: string, value: string) => {
      const newEducations = [...userData.educations];
      newEducations[index] = { ...newEducations[index], [field]: value };
      onUserDataChange({ ...userData, educations: newEducations });
    },
    [userData, onUserDataChange]
  );

  const handleSkillChange = useCallback(
    (index: number, value: string) => {
      const newSkills = [...userData.skills];
      newSkills[index] = { name: value };
      onUserDataChange({ ...userData, skills: newSkills });
    },
    [userData, onUserDataChange]
  );

  const handleDeletePosition = useCallback(
    (index: number) => {
      const newPositions = userData.positions.filter((_, i) => i !== index);
      onUserDataChange({ ...userData, positions: newPositions });
    },
    [userData, onUserDataChange]
  );

  const handleDeleteEducation = useCallback(
    (index: number) => {
      const newEducations = userData.educations.filter((_, i) => i !== index);
      onUserDataChange({ ...userData, educations: newEducations });
    },
    [userData, onUserDataChange]
  );

  const handleDeleteSkill = useCallback(
    (index: number) => {
      const newSkills = userData.skills.filter((_, i) => i !== index);
      onUserDataChange({ ...userData, skills: newSkills });
    },
    [userData, onUserDataChange]
  );

  const handleAddCustomSection = useCallback(() => {
    const newSection: CustomSection = {
      id: `custom-${userData.customSections?.length || 0}`,
      title: "New Section",
      content: "",
      isVisible: true,
    };

    onUserDataChange({
      ...userData,
      customSections: [...(userData.customSections || []), newSection],
    });

    // Add scroll functionality
    setTimeout(() => {
      const newSectionElement = document.getElementById(`custom-section-${userData.customSections?.length || 0}`);
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // Small delay to ensure the DOM has updated
  }, [userData, onUserDataChange]);

  const handleCustomSectionChange = useCallback(
    (sectionId: string, field: "title" | "content", value: string) => {
      const updatedSections = (userData.customSections || []).map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      );
      onUserDataChange({
        ...userData,
        customSections: updatedSections,
      });
    },
    [userData, onUserDataChange]
  );

  const handleDeleteCustomSection = useCallback(
    (sectionId: string) => {
      const updatedSections = (userData.customSections || []).filter(
        (section) => section.id !== sectionId
      );
      onUserDataChange({
        ...userData,
        customSections: updatedSections,
      });
    },
    [userData, onUserDataChange]
  );

  const renderSectionTitle = (title: string, sectionId: string) => {
    if (editingTitle === sectionId) {
      return (
        <Input
          value={title}
          onChange={(e) =>
            handleCustomSectionChange(sectionId, "title", e.target.value)
          }
          onBlur={() => setEditingTitle(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditingTitle(null);
            }
          }}
          autoFocus
          className="text-sm font-bold w-full"
        />
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span>{title}</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditingTitle(sectionId);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Pencil className="h-3 w-3" />
        </div>
      </div>
    );
  };

  const handleProjectChange = useCallback(
    (index: number, field: string, value: string) => {
      const newProjects = [...(userData.projects || [])];
      newProjects[index] = { ...newProjects[index], [field]: value };
      onUserDataChange({ ...userData, projects: newProjects });
    },
    [userData, onUserDataChange]
  );

  const handleDeleteProject = useCallback(
    (index: number) => {
      const newProjects = userData?.projects?.filter((_, i) => i !== index);
      onUserDataChange({ ...userData, projects: newProjects });
    },
    [userData, onUserDataChange]
  );

  // Calculate resume score
  const calculateResumeScore = () => {
    let score = 0;
    let totalPossibleScore = 0;

    // Basic info checks (10 points)
    totalPossibleScore += 10;
    if (userData.firstName && userData.lastName) score += 4;
    if (userData.email) score += 2;
    if (userData.phoneNumber) score += 2;
    if (userData.location) score += 2;

    // Professional summary (25 points)
    if (userData.summary) {
      totalPossibleScore += 25;
      if (config.showSummary && userData.summary.trim()) { // Only award points if section is visible and has content
        score += 25;
      }
    }

    // Experience section (35 points)
    if (userData.positions.length > 0) {
      totalPossibleScore += 35;
      if (config.showExperience) {
        // Points for having positions
        score += 20;
        // Additional points for descriptions
        userData.positions.forEach(position => {
          if (position.description?.trim()) {
            score += 5;
          }
        });
      }
    }

    // Skills section (15 points)
    if (userData.skills.length > 0) {
      totalPossibleScore += 15;
      if (config.showSkills) {
        score += 15; // Full points for having any skills
      }
    }

    // Projects section (15 points)
    if (userData.projects && userData.projects.length > 0) {
      totalPossibleScore += 15;
      if (config.showProjects) {
        score += 10; // Points for having projects
        // Additional points for descriptions
        if (userData.projects.some(project => project.description?.trim())) {
          score += 5;
        }
      }
    }

    // Education section (5 points)
    if (userData.educations.length > 0) {
      totalPossibleScore += 5;
      if (config.showEducation) {
        score += 5;
      }
    }

    // Custom sections (5 points each)
    if (userData.customSections) {
      userData.customSections.forEach(section => {
        if (section.content.trim()) {
          totalPossibleScore += 5;
          if (section.isVisible) {
            score += 5;
          }
        }
      });
    }

    // Prevent division by zero
    if (totalPossibleScore === 0) return 0;
    
    return Math.round((score / totalPossibleScore) * 100);
  };

  const resumeScore = calculateResumeScore();

  // Add handler functions for certifications
  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCertifications = userData.certifications ? [...userData.certifications] : [];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    onUserDataChange({
      ...userData,
      certifications: updatedCertifications,
    });
  };

  const handleDeleteCertification = (index: number) => {
    if (!userData.certifications) return;
    const updatedCertifications = userData.certifications.filter((_, i) => i !== index);
    onUserDataChange({
      ...userData,
      certifications: updatedCertifications,
    });
  };

  // Render visibility toggle button
  const renderVisibilityToggle = (section: keyof ResumeConfig) => {
    if (!isLoaded) return null;
    
    const isVisible = config[section];
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onConfigChange(section, !isVisible);
        }}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${section.replace('show', '').toLowerCase()} section`}
      >
        {isVisible ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-background shadow-md h-screen flex flex-col right-sidebar lg:relative">
      <div className="p-4">
        <div className="rounded-2xl bg-white/60 shadow-lg backdrop-blur-xl border border-white/40 p-4 mx-auto transition-all duration-300 bg-white/70 dark:bg-white/20 dark:bg-white/30 shadow-xl group border-b-4 border-purple-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent whitespace-nowrap transition-transform duration-500 ease-out group-hover:scale-105">
              simpleresu.me
            </h1>
            {isMobile ? (
              <div className="flex items-center gap-2 w-full">
                <Button 
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 flex-shrink-0"
                  variant="ghost"
                  size="sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-sm">Back to Builder</span>
                </Button>
                <Link 
                  href="/job-tracker"
                  className="group flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-full transition-all duration-200 flex-shrink-0"
                >
                  <span className="text-sm">Job Tracker</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <div className="flex items-center ml-auto">
                  <OnlineUsers />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/job-tracker"
                  className="relative px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 group/link hover:text-white dark:hover:text-white transition-all duration-200 w-full sm:w-auto flex justify-center items-center bg-white/50 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-primary hover:to-purple-600 rounded-full border border-gray-200/50 dark:border-gray-700/50 hover:border-transparent shadow-sm hover:shadow-md"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span>Job Tracker</span>
                  </span>
                </Link>
                <div className="flex-shrink-0">
                  <OnlineUsers />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 px-4 mb-4 relative"
        >
          <Accordion
            type="multiple"
            className="w-full space-y-4 pt-4 mb-16"
            defaultValue={["summary"]}
          >
            <AccordionItem
              value="personal-info"
              className="border rounded-lg"
              key="personal-info"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Personal Information
                </AccordionTrigger>
                {renderVisibilityToggle('showPhoto')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName" className="text-lg font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-lg font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      onBlur={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">Location</Label>
                    <Input
                      value={userData?.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">Phone Number</Label>
                    <Input
                      value={userData?.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">LinkedIn Username</Label>
                    <Input
                      value={userData?.linkedinId || ""}
                      onChange={(e) =>
                        handleInputChange("linkedinId", e.target.value)
                      }
                      placeholder="Enter your LinkedIn username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">GitHub Username</Label>
                    <Input
                      value={userData?.githubId || ""}
                      onChange={(e) =>
                        handleInputChange("githubId", e.target.value)
                      }
                      placeholder="Enter your GitHub username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headline" className="text-lg font-medium">
                      Headline
                    </Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={userData?.headline}
                      onChange={(e) =>
                        handleInputChange("headline", e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputChange("headline", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="summary"
              className="border rounded-lg"
              key="summary"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Summary
                </AccordionTrigger>
                {renderVisibilityToggle('showSummary')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <RichTextEditor
                  content={userData.summary}
                  onChange={(content) => handleInputChange("summary", content)}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="experience"
              className="border rounded-lg"
              key="experience"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Experience
                </AccordionTrigger>
                {renderVisibilityToggle('showExperience')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <Accordion
                  type="multiple"
                  className="w-full space-y-2"
                  key="positions-accordion"
                >
                  {userData.positions.map((position, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <Accordion
                          type="single"
                          collapsible
                          key={`position-accordion-${index}`}
                        >
                          <AccordionItem
                            value={`position-${index}`}
                            key={`position-item-${index}`}
                          >
                            <AccordionTrigger className="text-lg font-bold">
                              {position.title || `Position ${index + 1}`}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 mt-2">
                                <Input
                                  value={position.title}
                                  onChange={(e) =>
                                    handlePositionChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handlePositionChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Job Title"
                                  className="mb-2"
                                />
                                <Input
                                  value={position.company}
                                  onChange={(e) =>
                                    handlePositionChange(
                                      index,
                                      "company",
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handlePositionChange(
                                      index,
                                      "company",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Company"
                                  className="mb-2"
                                />
                                <div className="flex gap-2">
                                  <Input
                                    value={position.startDate}
                                    onChange={(e) =>
                                      handlePositionChange(
                                        index,
                                        "startDate",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handlePositionChange(
                                        index,
                                        "startDate",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Start Date"
                                  />
                                  <Input
                                    value={position.endDate}
                                    onChange={(e) =>
                                      handlePositionChange(
                                        index,
                                        "endDate",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      handlePositionChange(
                                        index,
                                        "endDate",
                                        e.target.value
                                      )
                                    }
                                    placeholder="End Date"
                                  />
                                </div>
                                <RichTextEditor
                                  content={position.description}
                                  onChange={(content) =>
                                    handlePositionChange(
                                      index,
                                      "description",
                                      content
                                    )
                                  }
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeletePosition(index)}
                                  className="mt-2"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Position
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </Accordion>
                <Button
                  onClick={() =>
                    onUserDataChange({
                      ...userData,
                      positions: [
                        ...userData.positions,
                        {
                          title: "",
                          company: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        },
                      ],
                    })
                  }
                  className="mt-2 w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="education"
              className="border rounded-lg"
              key="education"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Education
                </AccordionTrigger>
                {renderVisibilityToggle('showEducation')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <Accordion
                  type="multiple"
                  className="w-full space-y-2"
                  key="education-accordion"
                >
                  {userData.educations.map((education, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Input
                            value={education.schoolName}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "schoolName",
                                e.target.value
                              )
                            }
                            onBlur={(e) =>
                              handleEducationChange(
                                index,
                                "schoolName",
                                e.target.value
                              )
                            }
                            placeholder="School Name"
                            className="mb-2"
                          />
                          <Input
                            value={education.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            onBlur={(e) =>
                              handleEducationChange(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="Degree"
                            className="mb-2"
                          />
                          <Input
                            value={education.fieldOfStudy}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            onBlur={(e) =>
                              handleEducationChange(
                                index,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            placeholder="Field of Study"
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Input
                              value={education.startDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                handleEducationChange(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              placeholder="Start Date"
                            />
                            <Input
                              value={education.endDate}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                handleEducationChange(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              placeholder="End Date"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEducation(index)}
                            className="mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Education
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Accordion>
                <Button
                  onClick={() =>
                    onUserDataChange({
                      ...userData,
                      educations: [
                        ...userData.educations,
                        {
                          schoolName: "",
                          degree: "",
                          fieldOfStudy: "",
                          startDate: "",
                          endDate: "",
                        },
                      ],
                    })
                  }
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="skills"
              className="border rounded-lg"
              key="skills"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Skills
                </AccordionTrigger>
                {renderVisibilityToggle('showSkills')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <Accordion
                  type="multiple"
                  className="w-full space-y-2"
                  key="skills-accordion"
                >
                  {userData.skills.map((skill, index) => (
                    <div key={index} className="mb-2 flex items-center">
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                        onBlur={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Skill"
                        className="flex-grow"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => handleDeleteSkill(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </Accordion>
                <Button
                  onClick={() =>
                    onUserDataChange({
                      ...userData,
                      skills: [...userData.skills, { name: "" }],
                    })
                  }
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="projects"
              className="border rounded-lg"
              key="projects"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Projects
                </AccordionTrigger>
                {renderVisibilityToggle('showProjects')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <Accordion type="multiple" className="w-full space-y-2" key="projects-accordion">
                  {(userData.projects || []).map((project, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <Label>Project Title</Label>
                            <Input
                              value={project.title}
                              onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                              placeholder="Project Title"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Project Link</Label>
                            <Input
                              value={project.link}
                              onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <RichTextEditor
                              content={project.description}
                              onChange={(content) => handleProjectChange(index, "description", content)}
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProject(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Accordion>
                <Button
                  onClick={() =>
                    onUserDataChange({
                      ...userData,
                      projects: [
                        ...(userData.projects || []),
                        { title: "", link: "", description: "" },
                      ],
                    })
                  }
                  className="w-full mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </AccordionContent>
            </AccordionItem>
            {(userData.customSections || []).map((section, index) => (
              <AccordionItem
                key={`custom-section-${index}`}
                id={`custom-section-${index}`}
                value={section.id}
                className="border rounded-lg group"
              >
                <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                    {renderSectionTitle(section.title, section.id)}
                  </AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomSection(section.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedSections = userData.customSections?.map(
                          (s) =>
                            s.id === section.id
                              ? { ...s, isVisible: !s.isVisible }
                              : s
                        );
                        onUserDataChange({
                          ...userData,
                          customSections: updatedSections,
                        });
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {section.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <AccordionContent className="p-4">
                  <RichTextEditor
                    content={section.content}
                    onChange={(content) =>
                      handleCustomSectionChange(section.id, "content", content)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
            <AccordionItem
              value="certifications"
              className="border rounded-lg"
              key="certifications"
            >
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="text-sm font-bold hover:no-underline flex-1">
                  Certifications
                </AccordionTrigger>
                {renderVisibilityToggle('showCertifications')}
              </div>
              <AccordionContent className="p-4 text-lg">
                <Accordion
                  type="multiple"
                  className="w-full space-y-2"
                  key="certifications-accordion"
                >
                  {userData.certifications?.map((cert, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Input
                            value={cert.title}
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Certification Title"
                            className="mb-2"
                          />
                          <Input
                            value={cert.organization}
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "organization",
                                e.target.value
                              )
                            }
                            placeholder="Issuing Organization"
                            className="mb-2"
                          />
                          <Input
                            value={cert.completionDate}
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "completionDate",
                                e.target.value
                              )
                            }
                            placeholder="Completion Date (e.g., Jan 2021)"
                            className="mb-2"
                          />
                          <Input
                            value={cert.credentialUrl}
                            onChange={(e) =>
                              handleCertificationChange(
                                index,
                                "credentialUrl",
                                e.target.value
                              )
                            }
                            placeholder="Credential URL (optional)"
                            className="mb-2"
                          />
                          <div>
                            <Label>Description (optional)</Label>
                            <RichTextEditor
                              content={cert.description || ''}
                              onChange={(content) =>
                                handleCertificationChange(
                                  index,
                                  "description",
                                  content
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCertification(index)}
                            className="mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Certification
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Accordion>
                <Button
                  onClick={() =>
                    onUserDataChange({
                      ...userData,
                      certifications: [
                        ...(userData.certifications || []),
                        {
                          title: "",
                          organization: "",
                          completionDate: "",
                          description: "",
                          credentialUrl: "",
                        },
                      ],
                    })
                  }
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-background">
          <FloatingControls
            zoom={zoom}
            onZoomChange={onZoomChange}
            onAddCustomSection={handleAddCustomSection}
            resumeScore={resumeScore}
          />
        </div>
        {!isMobile && <ResumeScore score={resumeScore} />}
      </div>
    </div>
  );
}
