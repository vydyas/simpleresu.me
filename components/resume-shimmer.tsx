import React from "react";

export function ResumeShimmer() {
  return (
    <div className="min-h-full resume-container w-[220mm]">
      {/* Company chips shimmer */}
      <div className="flex justify-center gap-2 my-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Resume content shimmer */}
      <div className="bg-white p-8 rounded-lg shadow-lg min-h-[297mm] animate-pulse">
        {/* Header shimmer */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-48 bg-gray-200 rounded-md"></div>
          <div className="flex gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Content sections shimmer */}
        <div className="space-y-8">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="space-y-3">
              <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
              <div className="space-y-2 ml-2">
                <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
