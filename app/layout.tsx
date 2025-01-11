import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StylingProvider } from "@/lib/styling-context";
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

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
        <meta name="viewport" content="width=1280, initial-scale=0.3" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:title" content="Build Job-Winning Resumes for the Tech Industry | SimpleResu.me Resume Builder" />
        <meta property="og:description" content="Create professional resumes tailored for the tech industry, including FAANG and MAANG companies." />
        <meta property="og:url" content="https://simpleresu.me" />
        <meta property="og:image" content="https://github.com/user-attachments/assets/95d817d8-6d61-41a3-8298-7d57fddec1cd" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Build Job-Winning Resumes for the Tech Industry | SimpleResu.me Resume Builder" />
        <meta name="twitter:description" content="Create professional resumes tailored for the tech industry, including FAANG and MAANG companies." />
        <meta name="twitter:image" content="https://github.com/user-attachments/assets/95d817d8-6d61-41a3-8298-7d57fddec1cd" />

        {/* Google Analytics - Using Next.js Script component for better loading control */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
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
