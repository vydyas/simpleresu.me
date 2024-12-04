import React from "react";
import { Shimmer } from "@/components/ui/shimmer";

export function ResumeShimmer() {
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <Shimmer className="h-12 w-3/4" />
      <Shimmer className="h-6 w-1/2" />
      <div className="space-y-2">
        {[1, 2, 3].map((index) => (
          <Shimmer key={`shimmer-${index}`} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
