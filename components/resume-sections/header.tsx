import { Github, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface HeaderProps {
  userData: {
    firstName: string;
    lastName: string;
    headline?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    githubId?: string;
    linkedinId?: string;
  };
  nameFont: string;
  nameColor: string;
}

export function Header({ userData, nameColor }: HeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsVerySmallScreen(window.innerWidth < 380);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Function to calculate and set the appropriate scale
  const updateScale = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 8; // Account for safe padding
      const contentWidth = contentRef.current.scrollWidth;
      if (contentWidth > containerWidth) {
        const newScale = containerWidth / contentWidth;
        const minScale = isVerySmallScreen ? 0.4 : (isMobile ? 0.5 : 0.65);
        setScale(Math.max(minScale, newScale * 0.95)); // Add 5% buffer for safety
      } else {
        setScale(1);
      }
    }
  }, [isMobile, isVerySmallScreen]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateScale, 100);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, isVerySmallScreen, updateScale]);

  return (
    <div className="text-center px-0 max-w-4xl mx-auto">
      {/* Name Section */}
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold uppercase mb-1 sm:mb-2`}>
        <span style={{ color: nameColor }}>{userData.firstName}</span>{' '}
        <span style={{ color: nameColor }}>{userData.lastName}</span>
      </div>

      {/* Headline Section */}
      {userData.headline && (
        <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">{userData.headline}</p>
      )}
      
      {/* Contact Information Section - Auto-scaling Container */}
      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto overflow-hidden py-0.5">
        <div 
          ref={contentRef}
          className="flex items-center justify-start text-[10.5px] xs:text-[11px] sm:text-sm text-gray-600 whitespace-nowrap w-full pl-0.5"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'left',
            transition: 'transform 0.2s ease-out',
            width: scale < 1 ? `${(1 / scale) * 100}%` : '100%',
            marginLeft: '10%'
          }}
        >
          {/* Contact Items Container - Removed all extra spacing */}
          <div className="inline-flex items-center gap-x-1 xs:gap-x-1 sm:gap-x-2">
            {/* Email */}
            <div className="inline-flex items-center min-w-fit">
              <Mail className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500 mr-0.5" />
              <span className="select-all" title={userData.email}>
                {userData.email}
              </span>
            </div>
            
            {/* Phone - Minimized bullet spacing */}
            {userData.phoneNumber && (
              <>
                <span className="text-gray-300 text-[6px] xs:text-[8px] sm:text-[10px] flex-shrink-0 mx-0">•</span>
                <div className="inline-flex items-center min-w-fit">
                  <Phone className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500 mr-0.5" />
                  <span className="select-all" title={userData.phoneNumber}>
                    {userData.phoneNumber}
                  </span>
                </div>
              </>
            )}
            
            {/* Location - Minimized bullet spacing */}
            {userData.location && (
              <>
                <span className="text-gray-300 text-[6px] xs:text-[8px] sm:text-[10px] flex-shrink-0 mx-0">•</span>
                <div className="inline-flex items-center min-w-fit">
                  <MapPin className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500 mr-0.5" />
                  <span className="select-all" title={userData.location}>
                    {userData.location}
                  </span>
                </div>
              </>
            )}
            
            {/* Github - Minimized bullet spacing */}
            {userData.githubId && (
              <>
                <span className="text-gray-300 text-[6px] xs:text-[8px] sm:text-[10px] flex-shrink-0 mx-0">•</span>
                <div className="inline-flex items-center min-w-fit">
                  <Github className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500 mr-0.5" />
                  <span className="select-all" title={`github.com/${userData.githubId}`}>
                    {userData.githubId}
                  </span>
                </div>
              </>
            )}
            
            {/* LinkedIn - Minimized bullet spacing */}
            {userData.linkedinId && (
              <>
                <span className="text-gray-300 text-[6px] xs:text-[8px] sm:text-[10px] flex-shrink-0 mx-0">•</span>
                <div className="inline-flex items-center min-w-fit">
                  <Linkedin className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500 mr-0.5" />
                  <span className="select-all" title={`linkedin.com/in/${userData.linkedinId}`}>
                    {userData.linkedinId}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 