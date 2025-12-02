import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Download, Loader2, Settings } from 'lucide-react';
import { GlobalSettings } from './global-settings';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export function ZoomControl({ zoom, onZoomChange, onDownload, isDownloading }: ZoomControlProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    if (isSettingsOpen && settingsButtonRef.current && settingsDropdownRef.current) {
      const buttonRect = settingsButtonRef.current.getBoundingClientRect();
      const dropdownHeight = settingsDropdownRef.current.offsetHeight;
      
      // Check if there's enough space below the button
      if (window.innerHeight - buttonRect.bottom < dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isSettingsOpen]);

  // Handle clicks outside the settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node) &&
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-4 border-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomChange(Math.max(50, zoom - 10))}
        disabled={zoom <= 50 || isDownloading}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Slider
        value={[zoom]}
        onValueChange={(value) => onZoomChange(value[0])}
        min={50}
        max={200}
        step={10}
        className="w-40"
        disabled={isDownloading}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomChange(Math.min(200, zoom + 10))}
        disabled={zoom >= 200 || isDownloading}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <span className="text-sm w-12 text-center">{zoom}%</span>

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
            className={`absolute z-50 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border
              ${dropdownPosition === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full'}`}
          >
            <GlobalSettings 
              onClose={() => setIsSettingsOpen(false)} 
              key={isSettingsOpen ? 'open' : 'closed'} 
            />
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Button
        variant="outline"
        onClick={onDownload}
        disabled={isDownloading}
        className="flex items-center gap-2"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isDownloading ? 'Downloading...' : 'Download PDF'}
      </Button>
    </div>
  );
}
