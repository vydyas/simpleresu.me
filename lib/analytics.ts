export const GA_TRACKING_ID = 'G-XY4H2C61EY';

type GtagArgs = [
  type: 'event' | 'config' | 'js',
  action?: string | Date,
  options?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined;
  }
];

declare global {
  interface Window {
    dataLayer: Array<unknown>;
    gtag: (...args: GtagArgs) => void;
  }
}

// Track events helper function
const trackEvent = ({ action, category, label }: { 
  action: string; 
  category?: string; 
  label?: string;
}) => {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
  });
};

// Export trackEvents for components to use
export const trackEvents = {
  resumePrinted: () => {
    trackEvent({
      action: 'print_resume',
      category: 'Resume',
      label: 'Resume printed',
    });
  },
  settingsOpened: () => {
    trackEvent({
      action: 'open_settings',
      category: 'Settings',
      label: 'Settings opened',
    });
  },
  customSectionAdded: () => {
    trackEvent({
      action: 'add_custom_section',
      category: 'Resume',
      label: 'Custom section added',
    });
  },
  templateChanged: (template: string) => {
    trackEvent({
      action: 'change_template',
      category: 'Resume',
      label: `Template changed to ${template}`,
    });
  },
}; 