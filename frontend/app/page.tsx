'use client';

import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedHeader } from '@/components/shared-header';
import { CreateResumeModal } from '@/components/create-resume-modal';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const resumeTemplates = [
    {
      title: "Modern Professional",
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-silver-400"
    },
    {
      title: "Minimalist Tech",
      bgColor: "from-slate-800 to-slate-900",
      accentColor: "border-zinc-400"
    },
    {
      title: "Executive Elite",
      bgColor: "from-gray-800 to-gray-900",
      accentColor: "border-slate-400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resumeTemplates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <SharedHeader variant="landing" />

      {/* Hero Section - Split Layout */}
      <main className="min-h-[calc(100vh-4rem)] flex items-center py-8 lg:py-0">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 min-h-[calc(100vh-4rem)]">
            {/* Left Side - Tagline */}
            <div className="flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-white order-2 lg:order-1">
              <div className="max-w-xl space-y-6 lg:space-y-8 w-full">
                <div className="space-y-4 lg:space-y-6">
                  <div className="inline-block">
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs sm:text-sm font-medium">
                      Professional Resume Builder
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                    <span className="block text-black mb-1 sm:mb-2">Craft Your</span>
                    <span className="block bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-400 bg-clip-text text-transparent">
                      Perfect Resume
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-zinc-600 leading-relaxed">
                    Stand out from the crowd with professionally designed resumes.
                    Built for developers, designers, and tech professionals.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 lg:pt-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-lg hover:bg-zinc-800 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 text-base sm:text-lg font-semibold w-full sm:w-auto"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-lg border border-zinc-300 hover:border-black hover:bg-zinc-50 transition-all duration-200 text-base sm:text-lg font-semibold w-full sm:w-auto">
                    View Templates
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-8 border-t border-zinc-200">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-black">10+</div>
                    <div className="text-xs sm:text-sm text-zinc-500">Templates</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-black">5K+</div>
                    <div className="text-xs sm:text-sm text-zinc-500">Users</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-black">ATS</div>
                    <div className="text-xs sm:text-sm text-zinc-500">Optimized</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Resume Carousel */}
            <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 relative overflow-hidden order-1 lg:order-2 py-8 lg:py-0">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {/* Resume Preview Carousel */}
              <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md z-10">
                <div className="relative aspect-[8.5/11] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900/20">
                  {resumeTemplates.map((template, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {/* Resume Template Preview */}
                      <div className="w-full h-full bg-white p-4 sm:p-6 md:p-8 border border-zinc-300 shadow-inner">
                        {/* Header */}
                        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-300">
                          <div className="h-4 sm:h-5 md:h-6 bg-black rounded w-2/3"></div>
                          <div className="h-2 sm:h-2.5 md:h-3 bg-zinc-300 rounded w-1/2"></div>
                          <div className="h-2 sm:h-2.5 md:h-3 bg-zinc-300 rounded w-1/3"></div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="h-3 sm:h-3.5 md:h-4 bg-zinc-700 rounded w-1/4 mb-2 sm:mb-3"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-full"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-5/6"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-4/6"></div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="h-3 sm:h-3.5 md:h-4 bg-zinc-700 rounded w-1/3 mb-2 sm:mb-3"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-full"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-4/5"></div>
                            <div className="h-1.5 sm:h-2 bg-zinc-200 rounded w-3/4"></div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="h-3 sm:h-3.5 md:h-4 bg-zinc-700 rounded w-1/4 mb-2 sm:mb-3"></div>
                            <div className="flex gap-1.5 sm:gap-2">
                              <div className="h-4 sm:h-5 md:h-6 bg-zinc-300 rounded px-2 sm:px-3 w-14 sm:w-16 md:w-20"></div>
                              <div className="h-4 sm:h-5 md:h-6 bg-zinc-300 rounded px-2 sm:px-3 w-14 sm:w-16 md:w-20"></div>
                              <div className="h-4 sm:h-5 md:h-6 bg-zinc-300 rounded px-2 sm:px-3 w-14 sm:w-16 md:w-20"></div>
                            </div>
                          </div>
                        </div>

                        {/* Template Label */}
                        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 border border-zinc-300 shadow-sm">
                            <p className="text-zinc-700 text-xs sm:text-sm font-medium">{template.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                  {resumeTemplates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-6 sm:w-8 bg-black'
                          : 'w-1 sm:w-1.5 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                      aria-label={`View ${resumeTemplates[index].title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-zinc-500 text-xs sm:text-sm">
            Built with Next.js, Clerk, and Supabase
          </p>
        </div>
      </footer>

      {/* Create Resume Modal */}
      <CreateResumeModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
