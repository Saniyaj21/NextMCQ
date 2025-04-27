'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import Loading from '@/components/ui/Loading';
import { UserButton, SignedIn, SignedOut, useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import HomeSlider from '@/components/home/HomeSlider';
import Link from 'next/link';
import { FiAward, FiEdit } from 'react-icons/fi';

export default function Home() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // Check if user exists in our database
  useEffect(() => {
    const checkUser = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/check?clerkId=${user.id}`);
          const exists = await response.json();
          
          if (!exists) {
            router.push('/onboard');
            return;
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      }
      setIsChecking(false);
    };

    if (isLoaded && user) {
      checkUser();
    } else if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded, user, router]);
  
  // Only render the content when auth is loaded and component is fully mounted
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  // Show loading state while component is mounting or auth is loading
  if (!isReady || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Render content once everything is ready
  return (
    <>
      {/* Show loading while auth state is being determined - handled by Clerk components */}
      
      {/* Show landing page for non-authenticated users */}
      <SignedOut>
        <LandingPage />
      </SignedOut>
      
      {/* Show personalized content for authenticated users */}
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          

          <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
            {/* Slider Section */}
            <HomeSlider />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Give Test Button */}
              <Link 
                href="/practice"
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
                
                <div className="relative flex items-center gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-all">
                    <FiEdit className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Give Test</h3>
                    <p className="text-gray-600">Practice MCQs and test your knowledge</p>
                  </div>
                </div>
              </Link>

              {/* Leaderboard Button */}
              <Link 
                href="/leaderboard"
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
                
                <div className="relative flex items-center gap-4">
                  <div className="bg-purple-50 p-4 rounded-xl group-hover:bg-purple-100 transition-all">
                    <FiAward className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Leaderboard</h3>
                    <p className="text-gray-600">See where you stand among others</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
