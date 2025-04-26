'use client';

import { useUser } from '@clerk/nextjs';
import Loading from '@/components/Loading';

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || 'User'}!</h2>
          <p className="text-gray-600 mb-2">
            Here's your MCQ practice dashboard. Start practicing or create new tests.
          </p>
          <div className="flex gap-3 mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Start Practice
            </button>
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              Browse Tests
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tests Completed</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your XP</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
} 