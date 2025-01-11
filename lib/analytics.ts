type GtagArgs = [
  type: 'event' | 'config' | 'js',
  action?: string | Date,
  options?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    page_path?: string;
    [key: string]: string | number | boolean | undefined;
  }
];

// Declare gtag as a global function
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: GtagArgs) => void;
  }
}

export const GA_TRACKING_ID = 'G-XY4H2C61EY';

let isInitialized = false;

// Initialize Google Analytics
export const initGA = () => {
  if (isInitialized) return;

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;

  script1.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: GtagArgs) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID);
    isInitialized = true;
  };

  document.head.appendChild(script1);
};

// Safe gtag wrapper
const safeGtag = (...args: GtagArgs) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!isInitialized) return;
  safeGtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Custom events for our app
export const trackEvents = {
  resumePrinted: () => {
    event({
      action: 'print_resume',
      category: 'Resume',
      label: 'Resume printed',
    });
  },
  settingsOpened: () => {
    event({
      action: 'open_settings',
      category: 'Settings',
      label: 'Settings opened',
    });
  },
  customSectionAdded: () => {
    event({
      action: 'add_custom_section',
      category: 'Resume',
      label: 'Custom section added',
    });
  },
  templateChanged: (template: string) => {
    event({
      action: 'change_template',
      category: 'Resume',
      label: `Template changed to ${template}`,
    });
  },
}; 