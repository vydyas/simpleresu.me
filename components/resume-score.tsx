"use client";

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface ResumeScoreProps {
  score: number;
}

export function ResumeScore({ score }: ResumeScoreProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(Math.min(score, 100)), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (value: number) => {
    if (value < 50) return "bg-red-500";
    if (value < 80) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Resume Score</span>
          <span 
            className={`text-sm font-bold ${
              progress < 50 ? 'text-red-500' : 
              progress < 80 ? 'text-orange-500' : 
              'text-green-500'
            }`}
          >
            {progress}%
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 transition-all duration-500"
          indicatorColor={getScoreColor(progress)}
        />
        <p className="text-xs text-gray-500">
          {progress < 50 ? 'Your resume needs improvement' :
           progress < 80 ? 'Your resume is getting better' :
           'Your resume looks great!'}
        </p>
      </div>
    </div>
  );
} 