export interface ResumeConfig {
  showPhoto: boolean;
  showSummary: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showRepositories: boolean;
  showAwards: boolean;
  showCertificates: boolean;
  showLanguages: boolean;
  showVolunteer: boolean;
  showCertifications: boolean;
}

export type ConfigKey = keyof ResumeConfig;

export function isValidConfigKey(key: string): key is ConfigKey {
  return key in defaultConfig;
}

export const defaultConfig: ResumeConfig = {
  showPhoto: true,
  showSummary: true,
  showExperience: true,
  showEducation: true,
  showSkills: true,
  showProjects: true,
  showRepositories: true,
  showAwards: true,
  showCertificates: true,
  showLanguages: true,
  showVolunteer: true,
  showCertifications: true,
};
