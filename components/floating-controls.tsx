import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Minus from 'lucide-react/dist/esm/icons/minus';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { GlobalSettings } from './global-settings';
import { RippleButton } from './ui/ripple-button';
import { fireConfetti } from '@/lib/confetti';
import { trackEvents } from '@/lib/analytics';
import Download from 'lucide-react/dist/esm/icons/download';

interface FloatingControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function FloatingControls({
  zoom,
  onZoomChange,
}: FloatingControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown position
  useEffect(() => {
    if (isSettingsOpen && settingsButtonRef.current && settingsDropdownRef.current) {
      const buttonRect = settingsButtonRef.current.getBoundingClientRect();
      const dropdownHeight = settingsDropdownRef.current.offsetHeight;
      setDropdownPosition(
        window.innerHeight - buttonRect.bottom < dropdownHeight ? 'top' : 'bottom'
      );
    }
  }, [isSettingsOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        !settingsButtonRef.current?.contains(event.target as Node) &&
        !settingsDropdownRef.current?.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

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

  return (
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
            aria-label={`Zoom out (current zoom: ${zoom}%)`}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-sm text-gray-500 min-w-[48px] text-center" aria-live="polite">
            {zoom}%
          </span>
          <Button
            onClick={handleZoomIn}
            disabled={zoom >= 110}
            size="icon"
            variant="outline"
            className="w-8 h-8"
            aria-label={`Zoom in (current zoom: ${zoom}%)`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Print Button */}
        <RippleButton
          variant="ghost"
          size="icon"
          onClick={handlePrint}
          className="relative overflow-hidden w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Print Resume (opens print dialog)"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
        </RippleButton>

        <Separator orientation="vertical" className="h-6" />

        {/* Settings Button */}
        <div className="relative">
          <Button
            ref={settingsButtonRef}
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            aria-label="Open Settings Menu"
            aria-expanded={isSettingsOpen}
            aria-haspopup="dialog"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>

          {isSettingsOpen && (
            <div
              ref={settingsDropdownRef}
              className={`absolute z-50 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl border
                ${dropdownPosition === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full'}`}
              role="dialog"
              aria-modal="true"
              aria-label="Settings Panel"
            >
              <GlobalSettings
                onClose={() => setIsSettingsOpen(false)}
                key={isSettingsOpen ? 'open' : 'closed'}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
