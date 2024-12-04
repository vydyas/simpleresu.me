import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ZoomIn, ZoomOut, Download, Loader2 } from 'lucide-react';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  onDownload: () => void;
  isDownloading?: boolean;
}

export function ZoomControl({ zoom, onZoomChange, onDownload, isDownloading = false }: ZoomControlProps) {
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
        onValueChange={([value]) => onZoomChange(value)}
        min={50}
        max={150}
        step={1}
        className="w-[200px]"
        disabled={isDownloading}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoomChange(Math.min(150, zoom + 10))}
        disabled={zoom >= 150 || isDownloading}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
        {zoom}%
      </span>

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
