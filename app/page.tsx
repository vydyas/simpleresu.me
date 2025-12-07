'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SharedHeader } from '@/components/shared-header';

const KEYWORDS = ['Builders', 'Thinkers', 'Developers', 'Hackers', 'Tinkerers'];

export default function LandingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const resumeTemplates = [
    {
      title: "Modern Professional",
      image: "/resume1.png"
    },
    {
      title: "Minimalist Tech",
      image: "/resume2.png"
    },
    {
      title: "Executive Elite",
      image: "/resume3.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resumeTemplates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [resumeTemplates.length]);

  // Typing effect for keywords
  useEffect(() => {
    const currentKeyword = KEYWORDS[currentKeywordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (typingText.length < currentKeyword.length) {
        timeout = setTimeout(() => {
          setTypingText(currentKeyword.slice(0, typingText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Deleting
      if (typingText.length > 0) {
        timeout = setTimeout(() => {
          setTypingText(typingText.slice(0, -1));
        }, 50);
      } else {
        // Finished deleting, move to next keyword
        setIsDeleting(false);
        setCurrentKeywordIndex((prev) => (prev + 1) % KEYWORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typingText, currentKeywordIndex, isDeleting]);

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
                       Built for : {' '}
                        <span className="inline-block min-w-[140px] text-left">
                          <span className="text-orange-600">{typingText}</span>
                        </span>
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
                    onClick={() => router.push('/resume-builder')}
                    className="group relative px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base font-medium w-full sm:w-auto overflow-hidden transform hover:scale-[1.02] active:scale-100"
                  >
                    <span className="relative z-10">Create Your Resume</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
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

              {/* 3D Resume Carousel */}
              <div className="relative w-full max-w-[400px] sm:max-w-md md:max-w-lg lg:max-w-xl z-10" style={{ perspective: '1200px' }}>
                <div className="relative h-[500px] sm:h-[600px] md:h-[700px]">
                  {resumeTemplates.map((template, index) => {
                    // Calculate the relative position from current slide
                    let position = index - currentSlide;
                    
                    // Handle circular wrapping
                    if (position > resumeTemplates.length / 2) {
                      position -= resumeTemplates.length;
                    } else if (position < -resumeTemplates.length / 2) {
                      position += resumeTemplates.length;
                    }

                    // Calculate rotation angle (60 degrees per position)
                    const rotateY = position * 60;
                    // Calculate Z translation (depth)
                    const translateZ = -Math.abs(position) * 150;
                    // Calculate X translation (horizontal position)
                    const translateX = position * 120;
                    // Opacity based on position (center = 1, sides = 0.4)
                    const opacity = position === 0 ? 1 : 0.4;
                    // Scale based on position (center = 1, sides = 0.85)
                    const scale = position === 0 ? 1 : 0.85;
                    // Z-index to ensure center is on top
                    const zIndex = position === 0 ? 10 : 5 - Math.abs(position);

                    return (
                      <div
                        key={index}
                        className="absolute inset-0 transition-all duration-700 ease-in-out"
                        style={{
                          transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                          transformStyle: 'preserve-3d',
                          pointerEvents: position === 0 ? 'auto' : 'none',
                        }}
                      >
                        {/* Resume Image */}
                        <div className="relative w-full h-full" style={{ borderRadius: '5%' }}>
                          <Image
                            src={template.image}
                            alt={template.title}
                            fill
                            className="object-contain"
                            style={{ borderRadius: '5%' }}
                            priority={index === 0}
                            sizes="(max-width: 640px) 400px, (max-width: 768px) 448px, (max-width: 1024px) 512px, 640px"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mt-8 sm:mt-10">
                  {resumeTemplates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 sm:w-10 bg-black'
                          : 'w-2 sm:w-2.5 bg-zinc-300 hover:bg-zinc-400'
                      }`}
                      aria-label={`View resume ${index + 1}`}
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
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500">
            <a
              href="https://www.linkedin.com/in/siddhucse/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              LinkedIn
            </a>
            <span>|</span>
            <a
              href="https://github.com/vydyas/simpleresu.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              GitHub
            </a>
            <span>|</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
