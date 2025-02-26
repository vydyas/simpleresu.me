"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeShimmer } from "@/components/resume-shimmer";
import { initialUserData } from "@/data/initial-user-data";
import { ClientRightSidebar } from "@/components/client-right-sidebar";
import { defaultConfig, ResumeConfig } from "@/lib/resume-config";
import { ResumeRef } from "@/components/resume";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { UserData } from '@/types/resume';
import { ErrorBoundary } from '@/components/error-boundary';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo-config';
import { cn } from "@/lib/utils";
import { Menu, FileText, Settings } from "lucide-react";
import { SocialLinks } from "@/components/social-links";

const Resume = dynamic(
  () => import("@/components/resume").then((mod) => mod.Resume),
  {
    ssr: false,
    loading: () => <ResumeShimmer />
  }
);

type ConfigKey = keyof ResumeConfig;

const isValidConfigKey = (key: string): key is ConfigKey => {
  return Object.keys(defaultConfig).includes(key);
};

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState("default");
  const [githubId, setGithubId] = useState("vydyas");
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== "undefined") {
      const savedZoom = localStorage.getItem("resumeZoom");
      return savedZoom ? Math.min(parseInt(savedZoom), 110) : 100;
    }
    return 100;
  });
  const [config, setConfig] = useState<ResumeConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeConfig");
      return saved ? JSON.parse(saved) : defaultConfig;
    }
    return defaultConfig;
  });

  const [userData, setUserData] = useState<UserData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeData");
      return saved ? JSON.parse(saved) : initialUserData;
    }
    return initialUserData;
  });

  const resumeRef = useRef<ResumeRef>(null);
  const [template, ] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("resumeTemplate") || "default";
    }
    return "default";
  });

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeData", JSON.stringify(userData));
      localStorage.setItem("resumeConfig", JSON.stringify(config));
      localStorage.setItem("resumeTemplate", activeTemplate);
      localStorage.setItem("resumeGithubId", githubId);
      localStorage.setItem("resumeZoom", zoom.toString());
    }
  }, [userData, config, activeTemplate, githubId, zoom]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTemplate = localStorage.getItem("resumeTemplate");
      const savedGithubId = localStorage.getItem("resumeGithubId");
      const savedZoom = localStorage.getItem("resumeZoom");

      if (savedTemplate) setActiveTemplate(savedTemplate);
      if (savedGithubId) setGithubId(savedGithubId);
      if (savedZoom) setZoom(parseInt(savedZoom));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeTemplate", template);
    }
  }, [template]);

  const handleConfigChange = (key: unknown, value: boolean) => {
    const stringKey = String(key);
    if (!isValidConfigKey(stringKey)) {
      console.error(`Invalid config key: ${stringKey}`);
      return;
    }
    setConfig((prevConfig) => ({
      ...prevConfig,
      [stringKey]: value,
    }));
  };

  const handleUserDataChange = (newData: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col lg:flex-row bg-white min-h-screen">
        <PanelGroup 
          direction="horizontal" 
          className="flex-1 hidden lg:flex"
        >
          {/* Desktop Layout */}
          <Panel defaultSize={60} minSize={50}>
            <div className="flex flex-col items-center">
              {/* Social Links at the top */}
              <div className="w-full p-4 flex justify-center">
                <SocialLinks variant="solid" size="md" />
              </div>
              
              <Resume
                key={JSON.stringify(userData)}
                ref={resumeRef}
                template={template}
                githubId={githubId}
                config={config}
                userData={userData}
                zoom={zoom}
              />
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 hover:bg-gray-300 transition-colors resize-handle">
            <div className="w-1 h-full mx-auto bg-gray-200" />
          </PanelResizeHandle>
          <Panel defaultSize={40} minSize={30}>
            <ClientRightSidebar
              config={config}
              onConfigChange={handleConfigChange}
              userData={userData}
              onUserDataChange={handleUserDataChange}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          </Panel>
        </PanelGroup>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-screen">
          <div className="flex-none p-4 bg-white border-b">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Resume Builder</h1>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
              {/* Social Links for mobile */}
              <SocialLinks variant="outline" size="sm" />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {showSidebar ? (
              <ClientRightSidebar
                config={config}
                onConfigChange={handleConfigChange}
                userData={userData}
                onUserDataChange={handleUserDataChange}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            ) : (
              <div className="p-4">
                <Resume
                  key={JSON.stringify(userData)}
                  ref={resumeRef}
                  template={template}
                  githubId={githubId}
                  config={config}
                  userData={userData}
                  zoom={zoom}
                  scale={0.7} // Smaller scale for mobile
                />
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="flex-none border-t bg-white">
            <nav className="flex justify-around p-4">
              <button
                onClick={() => setShowSidebar(false)}
                className={cn(
                  "flex flex-col items-center",
                  !showSidebar && "text-primary"
                )}
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs mt-1">Resume</span>
              </button>
              <button
                onClick={() => setShowSidebar(true)}
                className={cn(
                  "flex flex-col items-center",
                  showSidebar && "text-primary"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">Edit</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export const metadata: Metadata = {
  title: 'Senior Front End Developer Portfolio',
  description: `${siteConfig.creator} - Senior Front End Developer from India with expertise in React, TypeScript, and modern web technologies. View my portfolio and projects.`,
  openGraph: {
    title: 'Senior Front End Developer Portfolio',
    description: `${siteConfig.creator} - Expert React & TypeScript Developer from India`,
    images: [
      {
        url: '/home-og.png',
        width: 1200,
        height: 630,
        alt: 'Portfolio Preview'
      }
    ]
  }
};
