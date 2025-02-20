import { Job } from "@/app/job-tracker/page";

export interface CustomSection {
  id: string;
  title: string;
  color: string;
  isDefault?: boolean;
}

export interface JobBoard {
  id: string;
  name: string;
  jobs: Job[];
  createdAt: string;
} 