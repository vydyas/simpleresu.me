import { z } from 'zod';

// Resume validation schemas
export const positionSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export const educationSchema = z.object({
  schoolName: z.string().min(1),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  link: z.string().url().optional().or(z.literal('')),
  description: z.string(),
});

export const certificationSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  completionDate: z.string(),
  description: z.string().optional(),
  credentialUrl: z.string().url().optional(),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string(),
  isVisible: z.boolean(),
});

export const resumeConfigSchema = z.object({
  showPhoto: z.boolean(),
  showSummary: z.boolean(),
  showExperience: z.boolean(),
  showEducation: z.boolean(),
  showSkills: z.boolean(),
  showProjects: z.boolean(),
  showRepositories: z.boolean(),
  showAwards: z.boolean(),
  showCertificates: z.boolean(),
  showLanguages: z.boolean(),
  showVolunteer: z.boolean(),
  showCertifications: z.boolean(),
});

export const createResumeSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  linkedinId: z.string().optional(),
  githubId: z.string().optional(),
  positions: z.array(positionSchema).optional(),
  educations: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  customSections: z.array(customSectionSchema).optional(),
  config: resumeConfigSchema.optional(),
  template: z.string().optional(),
  zoom: z.number().min(50).max(200).optional(),
});

export const updateResumeSchema = createResumeSchema.partial();

// Job tracker validation schemas
export const createJobBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
});

export const updateJobBoardSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const createJobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  link: z.string().url().optional().or(z.literal('')),
  status: z.string().min(1),
  notes: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const createCustomSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
});
