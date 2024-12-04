import React, { useCallback } from "react";
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
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { ResumeConfig, isValidConfigKey } from "@/lib/resume-config";

interface RightSidebarProps {
  config: ResumeConfig;
  onConfigChange: (key: keyof ResumeConfig, value: boolean) => void;
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
    photo?: string;
    projects?: Array<{
      name: string;
      description?: string;
      technologies?: string[];
      link?: string;
    }>;
    awards?: Array<{
      name: string;
      issuer?: string;
      date?: string;
      description?: string;
    }>;
    languages?: Array<{
      name: string;
      proficiency?: string;
    }>;
    volunteer?: Array<{
      organization: string;
      role: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>;
  };
  onUserDataChange: (newData: Partial<RightSidebarProps['userData']>) => void;
}

export function RightSidebar({
  config,
  onConfigChange,
  userData,
  onUserDataChange,
}: RightSidebarProps) {
  const handleInputChange = useCallback((field: string, value: string) => {
    console.log('Updating field:', field, 'with value:', value);
    onUserDataChange({
      ...userData,
      [field]: value
    });
  }, [userData, onUserDataChange]);

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

  return (
    <div className="w-[600px] bg-white shadow-md h-screen flex flex-col">
      <CardContent className="flex-1 overflow-y-auto">
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 p-4 space-y-4">
          <Accordion 
            type="multiple" 
            className="w-full space-y-4 pt-4"
            defaultValue={["personal-info", "summary"]}
          >
            <AccordionItem value="personal-info" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Personal Information
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showPhoto')) {
                      onConfigChange('showPhoto', !config.showPhoto);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showPhoto ? 'Hide photo' : 'Show photo'}
                >
                  {config.showPhoto ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headline" className="text-sm font-medium">
                      Headline
                    </Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={userData.headline}
                      onChange={(e) => handleInputChange("headline", e.target.value)}
                      onBlur={(e) => handleInputChange("headline", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="summary" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Summary
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showSummary')) {
                      onConfigChange('showSummary', !config.showSummary);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showSummary ? 'Hide summary' : 'Show summary'}
                >
                  {config.showSummary ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
                <RichTextEditor
                  content={userData.summary}
                  onChange={(content) => handleInputChange("summary", content)}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="experience" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Experience
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showExperience')) {
                      onConfigChange('showExperience', !config.showExperience);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showExperience ? 'Hide experience section' : 'Show experience section'}
                >
                  {config.showExperience ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
                <Accordion type="multiple" className="w-full space-y-2">
                  {userData.positions.map((position, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`position-${index}`}>
                            <AccordionTrigger className="text-sm font-medium">
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
            <AccordionItem value="education" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Education
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showEducation')) {
                      onConfigChange('showEducation', !config.showEducation);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showEducation ? 'Hide education section' : 'Show education section'}
                >
                  {config.showEducation ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
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
                            handleEducationChange(index, "degree", e.target.value)
                          }
                          onBlur={(e) =>
                            handleEducationChange(index, "degree", e.target.value)
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
                  <Plus
                    className="h
-4 w-4 mr-2"
                  />
                  Add Education
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="skills" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Skills
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showSkills')) {
                      onConfigChange('showSkills', !config.showSkills);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showSkills ? 'Hide skills section' : 'Show skills section'}
                >
                  {config.showSkills ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <Input
                      value={skill.name}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
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
            <AccordionItem value="projects" className="border rounded-lg">
              <div className="flex items-center justify-between bg-muted px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <AccordionTrigger className="hover:no-underline">
                  Projects
                </AccordionTrigger>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (isValidConfigKey('showProjects')) {
                      onConfigChange('showProjects', !config.showProjects);
                    }
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={config.showProjects ? 'Hide projects section' : 'Show projects section'}
                >
                  {config.showProjects ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AccordionContent className="p-4">
                {/* Projects content */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </div>
  );
}
