import { useEffect, useState } from 'react';

export interface ResumeConfig {
  showPhoto: boolean;
  showSummary: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showCertifications: boolean;
}

// Default configuration with all sections visible
export const defaultConfig: ResumeConfig = {
  showPhoto: true,
  showSummary: true,
  showExperience: true,
  showEducation: true,
  showSkills: true,
  showProjects: true,
  showCertifications: true,
};

// Type guard to check if a key is valid
export const isValidConfigKey = (key: string): key is keyof ResumeConfig => {
  return key in defaultConfig;
};

// Hook to manage resume configuration with SSR support
export const useResumeConfig = () => {
  // Initialize with default state
  const [config, setConfig] = useState<ResumeConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('resumeConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Update configuration
  const updateConfig = (key: keyof ResumeConfig, value: boolean) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    localStorage.setItem('resumeConfig', JSON.stringify(newConfig));
  };

  return {
    config,
    updateConfig,
    isLoaded,
  };
};
