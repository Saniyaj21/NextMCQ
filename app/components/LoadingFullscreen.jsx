'use client';

import React from 'react';

const LoadingFullscreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated circles */}
        <div className="flex gap-2 justify-center mb-8">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        </div>
        
        {/* Logo text */}
        <div className="relative">
          <div className="text-4xl font-bold text-gray-900 animate-pulse">
            NextMCQ
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFullscreen;