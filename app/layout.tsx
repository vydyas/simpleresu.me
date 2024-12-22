import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StylingProvider } from "@/lib/styling-context";

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build your professional resume",
  themeColor: 'white',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <title>Build Job-Winning Resumes for the Tech Industry | SimpleResu.me Resume Builder</title>
        <meta name="description" content="Create professional resumes tailored for the tech industry, including FAANG and MAANG companies." />
        <meta name="keywords" content="resume builder, tech industry resumes, FAANG resumes, MAANG resumes, professional resume, job application, career tools, resume templates, online resume, free resume builder" />
        {/* Add Open Graph and Twitter meta tags */}
        <meta property="og:title" content="Build Job-Winning Resumes for the Tech Industry | SimpleResu.me Resume Builder" />
        <meta property="og:description" content="Create professional resumes tailored for the tech industry, including FAANG and MAANG companies." />
        <meta property="og:url" content="https://simpleresu.me" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Build Job-Winning Resumes for the Tech Industry | SimpleResu.me Resume Builder" />
        <meta name="twitter:description" content="Create professional resumes tailored for the tech industry, including FAANG and MAANG companies." />
        {/* Add any other necessary meta tags */}
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <StylingProvider>
            {children}
          </StylingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
