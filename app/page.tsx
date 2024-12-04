"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { ResumeShimmer } from "@/components/resume-shimmer";
import { initialUserData } from "@/data/initial-user-data";
import { ZoomControl } from "@/components/zoom-control";
import { RightSidebar } from "@/components/right-sidebar";
import { defaultConfig, ResumeConfig } from "@/lib/resume-config";

const SampleResume = dynamic(() => import("@/components/sample-resume"), {
  loading: () => <ResumeShimmer />,
});

interface UserDataField {
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
  skills: Array<{
    name: string;
  }>;
}

type ConfigKey = keyof ResumeConfig;

const isValidConfigKey = (key: string): key is ConfigKey => {
  return Object.keys(defaultConfig).includes(key);
};

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState("default");
  const [githubId, setGithubId] = useState("vydyas");
  const [zoom, setZoom] = useState(90);
  const [config, setConfig] = useState<ResumeConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumeConfig');
      return saved ? JSON.parse(saved) : defaultConfig;
    }
    return defaultConfig;
  });

  const [userData, setUserData] = useState<UserDataField>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumeData');
      return saved ? JSON.parse(saved) : initialUserData;
    }
    return initialUserData;
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef<{ downloadPDF: () => Promise<void> }>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resumeData', JSON.stringify(userData));
      localStorage.setItem('resumeConfig', JSON.stringify(config));
      localStorage.setItem('resumeTemplate', activeTemplate);
      localStorage.setItem('resumeGithubId', githubId);
      localStorage.setItem('resumeZoom', zoom.toString());
    }
  }, [userData, config, activeTemplate, githubId, zoom]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemplate = localStorage.getItem('resumeTemplate');
      const savedGithubId = localStorage.getItem('resumeGithubId');
      const savedZoom = localStorage.getItem('resumeZoom');

      if (savedTemplate) setActiveTemplate(savedTemplate);
      if (savedGithubId) setGithubId(savedGithubId);
      if (savedZoom) setZoom(parseInt(savedZoom));
    }
  }, []);

  const handleGitHubIdSubmit = (id: string) => {
    setGithubId(id);
  };

  const handleLinkedInImport = () => {
    // TODO: Implement LinkedIn import logic
    console.log('LinkedIn import triggered');
  };

  const handleConfigChange = (key: unknown, value: boolean) => {
    const stringKey = String(key);
    if (!isValidConfigKey(stringKey)) {
      console.error(`Invalid config key: ${stringKey}`);
      return;
    }
    setConfig(prevConfig => ({
      ...prevConfig,
      [stringKey]: value
    }));
  };

  const handleUserDataChange = (newData: Partial<UserDataField>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleDownload = async () => {
    if (!resumeRef.current) {
      console.error('Resume component not ready');
      return;
    }

    try {
      setIsDownloading(true);
      await resumeRef.current.downloadPDF();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Header */}
      <div className="w-full">
        <Header 
          activeTemplate={activeTemplate}
          onTemplateChange={setActiveTemplate}
          githubId={githubId}
          onGitHubIdSubmit={handleGitHubIdSubmit}
          onLinkedInImport={handleLinkedInImport}
        />

        {/* Main Content */}
        <div className="flex flex-col mt-16 flex-grow overflow-hidden">
          <div className="flex flex-row flex-grow overflow-auto">
            <main className="flex flex-1 h-screen">
              <div className="flex-1 overflow-y-auto">
                <SampleResume
                  key={JSON.stringify(userData)}
                  ref={resumeRef}
                  template={activeTemplate}
                  githubId={githubId}
                  config={config}
                  userData={userData}
                  zoom={zoom}
                />
                <ZoomControl 
                  zoom={zoom} 
                  onZoomChange={setZoom} 
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              </div>
              <RightSidebar
                config={config}
                onConfigChange={handleConfigChange}
                userData={userData}
                onUserDataChange={handleUserDataChange}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
