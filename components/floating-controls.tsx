import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Download from 'lucide-react/dist/esm/icons/download';
import PlusCircle from 'lucide-react/dist/esm/icons/plus-circle';
import { GlobalSettings } from './global-settings';
import { MobileSettings } from './mobile-settings';
import { RippleButton } from './ui/ripple-button';
import { fireConfetti } from '@/lib/confetti';
import { trackEvents } from '@/lib/analytics';
import { useMediaQuery } from '@/hooks/use-media-query';

interface FloatingControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onAddCustomSection?: () => void;
  resumeScore: number;
}

export function FloatingControls({
  zoom,
  onZoomChange,
  onAddCustomSection,
  resumeScore,
}: FloatingControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown position
  useEffect(() => {
    if (!isMobile && isSettingsOpen && settingsButtonRef.current && settingsDropdownRef.current) {
      const buttonRect = settingsButtonRef.current.getBoundingClientRect();
      const dropdownHeight = settingsDropdownRef.current.offsetHeight;
      setDropdownPosition(
        window.innerHeight - buttonRect.bottom < dropdownHeight ? 'top' : 'bottom'
      );
    }
  }, [isSettingsOpen, isMobile]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        isSettingsOpen &&
        !settingsButtonRef.current?.contains(event.target as Node) &&
        !settingsDropdownRef.current?.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen, isMobile]);

  const handleZoomIn = () => {
    if (zoom < 110) {
      onZoomChange(zoom + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      onZoomChange(zoom - 10);
    }
  };

  const handlePrint = async () => {
    try {
      trackEvents.resumePrinted();
      await window.print();
      fireConfetti();
    } catch (error) {
      console.error('Print failed:', error);
    }
  };

  const handleSettingsClick = () => {
    trackEvents.settingsOpened();
    setIsSettingsOpen(!isSettingsOpen);
  };

  const renderMobileView = () => {
    // Cap the score at 100%
    const displayScore = Math.min(resumeScore, 100);
    
    return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe-area-inset-bottom z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Resume Score */}
          <div className="py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Resume Score
              </span>
              <span className="text-sm font-medium text-green-500">
                {displayScore}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${displayScore}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="py-2">
            <div className="grid grid-cols-12 items-center gap-2">
              {/* Zoom controls - takes 6 columns */}
              <div className="col-span-6 flex items-center justify-start gap-1">
                <Button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[48px] text-center">
                  {zoom}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  disabled={zoom >= 110}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Action buttons - takes 6 columns */}
              <div className="col-span-6 flex items-center justify-end gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10"
                  aria-label="Download resume"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  onClick={onAddCustomSection}
                  size="sm"
                  variant="outline"
                  className="h-10 w-10"
                  aria-label="Add custom section"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
                <Button
                  ref={settingsButtonRef}
                  onClick={handleSettingsClick}
                  size="sm"
                  variant="default"
                  className="h-10 w-10 bg-primary"
                  aria-label="Open settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <MobileSettings onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
    );
  };

  const renderDesktopView = () => (
    <div className="flex items-center justify-between w-full">
      <nav className="floating-controls" aria-label="Resume controls">
        <div className={`
          bg-white dark:bg-gray-900
          backdrop-blur-xl
          ${isScrolled ? 'bg-white/70 dark:bg-gray-900/70' : ''}
          rounded-[24px]
          shadow-lg
          border border-[#7a3eea]
          px-4 py-1
          flex items-center gap-4
          transition-all duration-300
        `}>
          {/* Zoom Controls */}
          <div className="flex items-center gap-2" role="group" aria-label="Zoom controls">
            <Button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              size="icon"
              variant="outline"
              className="w-8 h-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500 min-w-[48px] text-center">
              {zoom}%
            </span>
            <Button
              onClick={handleZoomIn}
              disabled={zoom >= 110}
              size="icon"
              variant="outline"
              className="w-8 h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <RippleButton
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            className="relative overflow-hidden w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Print Resume"
          >
            <Download className="h-4 w-4" />
          </RippleButton>

          <Separator orientation="vertical" className="h-6" />

          <div className="relative">
            <Button
              ref={settingsButtonRef}
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="w-8 h-8"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {isSettingsOpen && (
              <div
                ref={settingsDropdownRef}
                className={`absolute z-50 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl border
                  ${dropdownPosition === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full'}`}
              >
                <GlobalSettings onClose={() => setIsSettingsOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </nav>

      <Button 
        onClick={onAddCustomSection}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-sm hover:shadow-md rounded-full px-6 py-2.5"
        variant="ghost"
      >
        <div className="flex items-center justify-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Add Custom Section</span>
        </div>
      </Button>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
}
