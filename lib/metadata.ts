import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'Build Job-Winning Resumes for the Tech Industry | SimpleResume',
    template: '%s | SimpleResume'
  },
  description: 'Create professional resumes tailored for the tech industry, including FAANG and MAANG companies. Stand out with SimpleResume’s modern templates and AI assistance.',
  keywords: [
    'resume builder',
    'tech industry resumes',
    'FAANG resumes',
    'MAANG resumes',
    'professional resume',
    'job application',
    'career tools',
    'resume templates',
    'online resume',
    'free resume builder'
  ],
  authors: [{ name: 'SimpleResume' }],
  creator: 'SimpleResume',
  publisher: 'SimpleResume',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://simpleresu.me',
    siteName: 'SimpleResume',
    title: 'Build Job-Winning Resumes for the Tech Industry | SimpleResume',
    description: 'Create professional resumes tailored for the tech industry, including FAANG and MAANG companies.',
    images: [
      {
        url: 'https://simpleresu.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SimpleResume - Professional Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Job-Winning Resumes for the Tech Industry | SimpleResume',
    description: 'Create professional resumes tailored for the tech industry, including FAANG and MAANG companies.',
    images: ['https://simpleresu.me/twitter-image.png'],
    creator: '@simpleresu_me',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://simpleresu.me',
    languages: {
      'en-US': 'https://simpleresu.me',
      'es-ES': 'https://simpleresu.me/es',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#ffffff',
};

export default defaultMetadata; 