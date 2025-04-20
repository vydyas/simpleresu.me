"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeConfig } from "@/lib/resume-config";
import { UserData } from "@/types/resume";
import { RightSidebar } from "./right-sidebar";

interface MobileSidebarProps {
  config: ResumeConfig;
  onConfigChange: (key: keyof ResumeConfig, value: boolean) => void;
  userData: UserData;
  onUserDataChange: (data: Partial<UserData>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function MobileSidebar({
  config,
  onConfigChange,
  userData,
  onUserDataChange,
  zoom,
  onZoomChange,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when printing
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsOpen(false);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only show when sidebar is closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 lg:hidden no-print">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ease-in-out no-print ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="absolute right-0 top-0 h-full w-[90%] max-w-md bg-white dark:bg-gray-900 shadow-xl">
          <RightSidebar
            config={config}
            onConfigChange={onConfigChange}
            userData={userData}
            onUserDataChange={onUserDataChange}
            zoom={zoom}
            onZoomChange={onZoomChange}
            onClose={handleClose}
          />
        </div>
      </div>
    </>
  );
} 