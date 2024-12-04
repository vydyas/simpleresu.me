import "./globals.css";
import "./custom-styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simpleresu.me - Create Your Professional Resume",
  description:
    "Generate a professional resume in minutes using your LinkedIn profile and GitHub repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} colorful-light-gradient`}>
        {children}
      </body>
    </html>
  );
}
