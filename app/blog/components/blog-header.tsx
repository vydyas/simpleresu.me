import Link from 'next/link';

export function BlogHeader() {
  return (
    <header className="flex-shrink-0 p-4 bg-white border-b">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800">Blog</h1>
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Resume Builder
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 