'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerSpec {
  [key: string]: unknown;
}

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<SwaggerSpec | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch OpenAPI spec from server-side API route
    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => {
        console.error('Error loading API spec:', err);
        setError('Failed to load API documentation');
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error Loading Documentation</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SimpleResu.me API Documentation</h1>
              <p className="mt-1 text-sm text-gray-500">
                Interactive API documentation and testing interface
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Authentication Required</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Most endpoints require Clerk authentication. To test APIs:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Log in to the app to get a Clerk session token</li>
                  <li>Click the &quot;Authorize&quot; button below</li>
                  <li>Paste your session token in the &quot;Value&quot; field</li>
                  <li>Click &quot;Authorize&quot; and then &quot;Close&quot;</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="swagger-wrapper bg-white rounded-lg shadow-sm border border-gray-200">
          <SwaggerUI spec={spec} />
        </div>
      </div>

      <style jsx global>{`
        /* Customize Swagger UI to match the app theme */
        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .information-container {
          margin: 20px 0;
        }

        .swagger-ui .scheme-container {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }

        .swagger-ui .opblock-tag {
          border-bottom: 2px solid #e5e7eb;
          padding: 15px 0;
        }

        .swagger-ui .opblock {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .swagger-ui .opblock.opblock-post {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .swagger-ui .opblock.opblock-get {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .swagger-ui .btn.authorize {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .swagger-ui .btn.authorize svg {
          fill: white;
        }

        .swagger-ui .btn.execute {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .swagger-wrapper {
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
