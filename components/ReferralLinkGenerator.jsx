'use client';

import { useState } from 'react';
import { FiUserPlus, FiCopy, FiCheck, FiShare2 } from 'react-icons/fi';

export default function ReferralLinkGenerator({ referralCode }) {
  const [copied, setCopied] = useState(false);
  
  // Generate the full referral URL
  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/invite/${referralCode}`
    : `/invite/${referralCode}`;
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    });
  };
  
  // Share link using Web Share API if available
  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on NextMCQ!',
        text: 'I\'m using NextMCQ for MCQ practice. Use my invite link to join!',
        url: referralUrl
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback to copy if Web Share API not available
      copyToClipboard();
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-blue-50 p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiUserPlus className="text-blue-600" />
          Invite Friends
        </h3>
        <p className="text-gray-600 mt-1">Share your invitation link and earn rewards when friends join</p>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Referral URL Input Group */}
          <div className="relative">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm pr-24"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <button
                onClick={copyToClipboard}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-sm transition-all duration-200
                  ${copied 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {copied ? (
                  <>
                    <FiCheck className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Share Button */}
          <button
            onClick={shareLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiShare2 className="h-4 w-4" />
            Share with Friends
          </button>
        </div>
        
        {/* Success Message */}
        <div className={`mt-3 text-sm transition-all duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-green-600 flex items-center gap-1.5">
            <FiCheck className="h-4 w-4" />
            Link copied to clipboard!
          </p>
        </div>
        
        {/* Info Text */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Each friend will get 200 coins, and you will get 300 coins for every referal!</p>
        </div>
      </div>
    </div>
  );
} 