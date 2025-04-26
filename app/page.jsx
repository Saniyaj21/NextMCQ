'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import Loading from '@/components/Loading';
import { UserButton, SignedIn, SignedOut, useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to your dashboard!
          </h1>
          <div className="absolute top-4 right-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>
    </>
  );
}
