import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'SimpleResume - Professional Resume Builder',
    template: '%s | SimpleResume'
  },
  description: 'Create professional resumes instantly with SimpleResume. Free online resume builder with modern templates, AI assistance, and easy customization.',
  keywords: [
    'resume builder',
    'cv maker',
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://simpleresu.me',
    siteName: 'SimpleResume',
    title: 'SimpleResume - Professional Resume Builder',
    description: 'Create professional resumes instantly with SimpleResume. Free online resume builder with modern templates.',
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
    title: 'SimpleResume - Professional Resume Builder',
    description: 'Create professional resumes instantly with SimpleResume',
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