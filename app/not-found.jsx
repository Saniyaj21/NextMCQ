 'use client';

import Link from 'next/link';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] font-bold text-gray-200 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
           
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-blue-50 text-blue-600 border-2 border-blue-500 px-6 py-2 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <FiHome className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-50 text-gray-600 border-2 border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 hover:border-gray-400 hover:text-gray-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact support or visit our help center.</p>
        </div>
      </div>
    </div>
  );
}