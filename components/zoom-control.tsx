import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Download, Loader2, RotateCcw } from 'lucide-react';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDownload: () => void;
  isDownloading: boolean;
  onResetResume?: () => void;
}

export function ZoomControl({ zoom, onZoomChange, onDownload, isDownloading, onResetResume }: ZoomControlProps) {
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

      {onResetResume && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onResetResume}
          className="ml-2"
          title="Reset Resume Layout"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}

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
