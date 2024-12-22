"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeShimmer } from "@/components/resume-shimmer";
import { initialUserData } from "@/data/initial-user-data";
import { ClientRightSidebar } from "@/components/client-right-sidebar";
import { defaultConfig, ResumeConfig } from "@/lib/resume-config";
import { ResumeRef } from "@/components/resume";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { UserData } from '@/types/resume'; // Import the types

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
  const [zoom, setZoom] = useState(100);
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
    <div className="flex bg-muted h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={60} minSize={50}>
          <div className="flex justify-center flex-col items-center">
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
    </div>
  );
}
