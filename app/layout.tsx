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
        <meta name="viewport" content="device-width" initial-scale="1" maximum-scale="1" />
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
