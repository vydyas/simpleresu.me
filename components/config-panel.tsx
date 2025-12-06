import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConfigPanelProps {
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
  onConfigChange: (key: string, value: boolean) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const configOptions = [
    { key: "showPhoto", label: "Photo" },
    { key: "showSummary", label: "Summary" },
    { key: "showExperience", label: "Experience" },
    { key: "showEducation", label: "Education" },
    { key: "showSkills", label: "Skills" },
    { key: "showProjects", label: "Projects" },
    { key: "showRepositories", label: "GitHub Repositories" },
    { key: "showAwards", label: "Awards" },
    { key: "showLanguages", label: "Languages" },
    { key: "showVolunteer", label: "Volunteer Experience" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Resume Configuration</h2>
      <div className="grid grid-cols-2 gap-4">
        {configOptions.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="flex flex-col space-y-1">
              <span>Show {label}</span>
            </Label>
            <Switch
              id={key}
              checked={config[key as keyof typeof config]}
              onCheckedChange={(checked) => onConfigChange(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
