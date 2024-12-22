"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ResumeConfig } from "@/lib/resume-config";
import { RightSidebarPlaceholder } from './right-sidebar-placeholder';
import { UserData } from '@/types/resume';

// Import RightSidebar dynamically
const RightSidebar = dynamic(
  () => import('./right-sidebar').then((mod) => mod.RightSidebar),
  {
    ssr: false,
    loading: () => <RightSidebarPlaceholder />,
  }
);

interface ClientRightSidebarProps {
  config: ResumeConfig;
  onConfigChange: (key: keyof ResumeConfig, value: boolean) => void;
  userData: UserData;
  onUserDataChange: (data: Partial<ClientRightSidebarProps['userData']>) => void;
  onLinkedInImport?: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ClientRightSidebar(props: ClientRightSidebarProps) {
  return (
    <Suspense fallback={<RightSidebarPlaceholder />}>
      <RightSidebar
        config={props.config}
        onConfigChange={props.onConfigChange}
        userData={props.userData}
        onUserDataChange={props.onUserDataChange}
        zoom={props.zoom}
        onZoomChange={props.onZoomChange}
      />
    </Suspense>
  );
} 