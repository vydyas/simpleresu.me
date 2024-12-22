import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Settings, Printer } from 'lucide-react';
import { GlobalSettings } from './global-settings';

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

  return (
    <div className="floating-controls">
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
        <Slider
          value={[zoom]}
          onValueChange={(value) => onZoomChange(value[0])}
          min={50}
          max={200}
          step={10}
          className="w-20"
        />
        <span className="text-sm w-12 text-center">{zoom}%</span>

        <Separator orientation="vertical" className="h-6" />

        {/* Print Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.print()}
          className="flex items-center gap-2"
          title="Print Resume"
        >
          <Printer className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Settings */}
        <div className="relative">
          <Button
            ref={settingsButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {isSettingsOpen && (
            <div
              ref={settingsDropdownRef}
              className={`absolute z-50 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl border
                ${dropdownPosition === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full'}`}
            >
              <GlobalSettings
                onClose={() => setIsSettingsOpen(false)}
                key={isSettingsOpen ? 'open' : 'closed'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
