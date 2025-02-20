import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Application Tracker | SimpleResume',
  description: 'Track and manage your job applications with our intuitive Kanban board. Organize applications by status, from shortlist to offer, and never miss a follow-up.',
  keywords: [
    'job tracker',
    'application tracking',
    'job search organizer',
    'kanban board',
    'career management',
    'job hunting tool',
    'application status',
    'interview tracking',
    'job search management',
    'career organization'
  ],
  openGraph: {
    title: 'Job Application Tracker | SimpleResume',
    description: 'Organize your job search with our intuitive application tracking system',
    type: 'website',
    images: [
      {
        url: '/og-job-tracker.png',
        width: 1200,
        height: 630,
        alt: 'Job Application Tracker Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Application Tracker | SimpleResume',
    description: 'Track your job applications effortlessly',
    images: ['/og-job-tracker.png'],
  },
  alternates: {
    canonical: 'https://simpleresu.me/job-tracker'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Job Application Tracker',
  applicationCategory: 'Career Management Tool',
  description: 'Track and manage your job applications with our intuitive Kanban board system.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Kanban board visualization',
    'Custom status columns',
    'Application tracking',
    'Interview status management',
    'Drag and drop interface'
  ],
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://simpleresu.me/job-tracker'
};

export default function JobTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
} 