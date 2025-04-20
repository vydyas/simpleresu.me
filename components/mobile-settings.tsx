"use client";

import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStyling } from "@/lib/styling-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HeadingStyle } from '@/types/resume';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileSettingsProps {
  onClose?: () => void;
}

interface ThemeColor {
  name: string;
  nameColor: string;
  headingColor: string;
  borderColor: string;
  companyColor: string;
}

const themeColors: ThemeColor[] = [
  {
    name: 'Blue',
    nameColor: '#1a365d',
    headingColor: '#2b4c7e',
    borderColor: '#4a90e2',
    companyColor: '#3b82f6',
  },
  {
    name: 'Green',
    nameColor: '#1b4332',
    headingColor: '#2d6a4f',
    borderColor: '#40916c',
    companyColor: '#059669',
  },
  {
    name: 'Purple',
    nameColor: '#4a1d96',
    headingColor: '#6d28d9',
    borderColor: '#8b5cf6',
    companyColor: '#7c3aed',
  },
  {
    name: 'Gray',
    nameColor: '#1f2937',
    headingColor: '#4b5563',
    borderColor: '#9ca3af',
    companyColor: '#6b7280',
  },
];

const ColorPicker = ({ label, value, onChange }: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex items-center justify-between p-4 border-b">
    <Label className="text-base">{label}</Label>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-12 h-12 cursor-pointer rounded !p-0 border border-gray-200"
    />
  </div>
);

export function MobileSettings({ onClose }: MobileSettingsProps) {
  const { 
    headingColor, 
    updateHeadingColor,
    nameColor,
    updateNameColor,
    borderColor,
    setBorderColor,
    skillsStyle,
    setSkillsStyle,
    headingStyle,
    setHeadingStyle,
    resumeBackgroundColor,
    setResumeBackgroundColor,
    companyColor,
    updateCompanyColor,
  } = useStyling();

  const applyThemeColors = (theme: ThemeColor) => {
    updateNameColor(theme.nameColor);
    updateHeadingColor(theme.headingColor);
    setBorderColor(theme.borderColor);
    updateCompanyColor(theme.companyColor);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4">
            {/* Theme Colors */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Theme Colors</Label>
              <div className="grid grid-cols-2 gap-4">
                {themeColors.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => applyThemeColors(theme)}
                    className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    title={theme.name}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div style={{ backgroundColor: theme.nameColor }} className="h-3 rounded-sm" />
                      <div style={{ backgroundColor: theme.headingColor }} className="h-3 rounded-sm" />
                      <div style={{ backgroundColor: theme.borderColor }} className="h-3 rounded-sm" />
                    </div>
                    <span className="mt-2 text-sm">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Colors</Label>
              <div className="rounded-lg border overflow-hidden">
                <ColorPicker
                  label="Name Color"
                  value={nameColor}
                  onChange={updateNameColor}
                />
                <ColorPicker
                  label="Heading Color"
                  value={headingColor}
                  onChange={updateHeadingColor}
                />
                <ColorPicker
                  label="Border Color"
                  value={borderColor}
                  onChange={setBorderColor}
                />
                <ColorPicker
                  label="Company Color"
                  value={companyColor}
                  onChange={updateCompanyColor}
                />
                <ColorPicker
                  label="Background"
                  value={resumeBackgroundColor}
                  onChange={(value) => {
                    setResumeBackgroundColor(value);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('resumeBackgroundColor', value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Styles */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">Skills Style</Label>
                <RadioGroup
                  value={skillsStyle}
                  onValueChange={(value) => setSkillsStyle(value as 'chips' | 'list')}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="chips" id="chips" />
                    <Label htmlFor="chips" className="text-base">Chips</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="list" id="list" />
                    <Label htmlFor="list" className="text-base">List</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">Heading Style</Label>
                <RadioGroup
                  value={headingStyle}
                  onValueChange={(value) => setHeadingStyle(value as HeadingStyle)}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="background" id="background" />
                    <Label htmlFor="background" className="text-base">Background</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="border-bottom" id="border-bottom" />
                    <Label htmlFor="border-bottom" className="text-base">Bottom Border</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="border-top" id="border-top" />
                    <Label htmlFor="border-top" className="text-base">Top Border</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 