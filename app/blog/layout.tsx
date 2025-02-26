import type { Metadata } from 'next';
import { BlogHeader } from './components/blog-header';

export const metadata: Metadata = {
  title: 'Blog | SimpleResume',
  description: 'Tips, tricks, and insights about resume building, job hunting, and career development.',
  keywords: [
    'resume tips',
    'career advice',
    'job hunting',
    'resume building',
    'career development',
    'interview tips',
    'professional growth',
    'job search strategies',
    'career blog',
    'resume writing'
  ],
  openGraph: {
    title: 'Blog | SimpleResume',
    description: 'Career insights and resume building tips',
    type: 'website',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'SimpleResume Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | SimpleResume',
    description: 'Career insights and resume building tips',
    images: ['/og-blog.png'],
  },
  alternates: {
    canonical: 'https://simpleresu.me/blog'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'SimpleResume Blog',
  description: 'Tips, tricks, and insights about resume building, job hunting, and career development.',
  url: 'https://simpleresu.me/blog',
  publisher: {
    '@type': 'Organization',
    name: 'SimpleResume',
    url: 'https://simpleresu.me'
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        <BlogHeader />
        <div className="flex-1 overflow-y-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </div>
      </div>
    </div>
  );
} 