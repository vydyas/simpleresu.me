export const siteConfig = {
  name: 'SimpleResume',
  url: 'https://simpleresu.me',
  ogImage: '/og.png',
  description: 'Senior Front End Developer Portfolio & Resume Builder - Specializing in React, TypeScript, and Modern Web Technologies',
  links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
  creator: 'Your Name',
  location: 'India'
};

export const defaultSEO = {
  title: {
    default: `${siteConfig.creator} - Senior Front End Developer`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.creator} - Senior Front End Developer from India`,
    description: 'Full-stack TypeScript developer specializing in React, Next.js, and modern web applications',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.creator}'s Portfolio`
      }
    ]
  },
  twitter: {
    handle: '@yourhandle',
    site: '@simpleresu_me',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: siteConfig.url
  }
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': siteConfig.url,
  name: siteConfig.creator,
  url: siteConfig.url,
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
  ],
  jobTitle: 'Senior Front End Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'SimpleResume'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'India'
  },
  knowsAbout: [
    'React',
    'TypeScript',
    'Next.js',
    'JavaScript',
    'Web Development',
    'Frontend Architecture',
    'UI/UX Design',
    'Performance Optimization'
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Senior Front End Developer',
    occupationLocation: {
      '@type': 'Country',
      name: 'India'
    },
    estimatedSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: 2000000,
        maxValue: 4000000,
        unitText: 'YEAR'
      }
    },
    skills: [
      'React.js',
      'TypeScript',
      'Next.js',
      'Node.js',
      'GraphQL',
      'TailwindCSS',
      'Redux',
      'Jest',
      'CI/CD'
    ]
  }
}; 