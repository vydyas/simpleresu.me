function Shimmer() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
  );
}

function JobCardSkeleton() {
  return (
    <div className="relative bg-white p-4 rounded-md shadow-sm border">
      <div className="space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded relative overflow-hidden">
          <Shimmer />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-3 w-1/2 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-3 w-24 bg-gray-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnSkeleton() {
  return (
    <div className="flex-shrink-0 w-[350px]">
      <div className="flex flex-col h-full rounded-lg border-2 border-gray-100 bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white bg-opacity-50">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-gray-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-6 w-10 bg-gray-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 p-4 overflow-y-auto">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <div className="h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="flex-shrink-0 p-4 bg-white border-b">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-8 w-32 bg-gray-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-10 w-[200px] bg-gray-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              <div className="h-10 w-24 bg-gray-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>
        </div>

        {/* Board Skeleton */}
        <div className="flex-1 min-h-0 p-4">
          <div className="h-full max-w-[1800px] mx-auto">
            <div className="flex-1 overflow-x-auto">
              <div className="inline-flex gap-4 p-0.5 h-full min-w-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <ColumnSkeleton key={i} />
                ))}
                
                {/* Add Section Button Skeleton */}
                <div className="flex-shrink-0 w-[350px]">
                  <div className="h-full min-h-[700px] w-full rounded-lg border-2 border-dashed border-gray-200 relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 