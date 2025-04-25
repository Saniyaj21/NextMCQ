'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import Loading from '@/components/Loading';
import { UserButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isLoaded } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Only render the content when auth is loaded and component is fully mounted
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  // Show loading state while component is mounting or auth is loading
  if (!isReady) {
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
