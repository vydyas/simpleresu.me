"use client";

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface ResumeScoreProps {
  score: number;
}

export function ResumeScore({ score }: ResumeScoreProps) {
  // Cap the score at 100%
  const displayScore = Math.min(score, 100);

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
              displayScore < 50 ? 'text-red-500' : 
              displayScore < 80 ? 'text-orange-500' : 
              'text-green-500'
            }`}
          >
            {displayScore}%
          </span>
        </div>
        <Progress 
          value={displayScore} 
          className="h-2 transition-all duration-500"
          indicatorColor={getScoreColor(displayScore)}
        />
        <p className="text-xs text-gray-500">
          {displayScore === 100 ? 'Your resume looks great!' : 'Keep adding relevant information to improve your score.'}
        </p>
      </div>
    </div>
  );
} 