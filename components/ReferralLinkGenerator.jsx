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
          {/* Referral URL Input */}
          <div className="flex items-center">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 flex items-center"
            >
              {copied ? <FiCheck className="h-5 w-5" /> : <FiCopy className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              <FiCopy className="h-4 w-4" />
              Copy Link
            </button>
            
            <button
              onClick={shareLink}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiShare2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
        
        {/* Info Text */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Each friend who joins through your link earns you both bonus XP points!</p>
        </div>
      </div>
    </div>
  );
} 