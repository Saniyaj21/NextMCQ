'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function InvitePage() {
  const { code } = useParams();
  const router = useRouter();
  
  // Store referral code in localStorage and redirect to onboard page
  useEffect(() => {
    if (code) {
      // Store the referral code with a 7-day expiration
      const expirationTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 days
      const referralData = {
        code: code,
        expires: expirationTime
      };
      
      try {
        localStorage.setItem('referralCode', JSON.stringify(referralData));
        
        // Set cookie as a fallback
        document.cookie = `referralCode=${code}; max-age=${60*60*24*7}; path=/; SameSite=Lax`;
        
        // Redirect to onboarding page
        router.push('/onboard');
      } catch (error) {
        console.error('Error saving referral code:', error);
        // Still redirect even if there's an error
        router.push('/onboard');
      }
    } else {
      // No code provided, redirect to home
      router.push('/');
    }
  }, [code, router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-gray-600">Applying your invitation...</p>
      </div>
    </div>
  );
}