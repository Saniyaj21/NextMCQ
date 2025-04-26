'use client';

import { useUser } from '@clerk/nextjs';
import Loading from '@/components/ui/Loading';

export default function OnboardLayout({ children }) {
  const { isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {children}
    </div>
  );
}