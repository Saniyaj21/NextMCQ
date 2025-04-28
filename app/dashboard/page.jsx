'use client';

import { useUser } from '@clerk/nextjs';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import { FiPlus, FiList, FiPlay, FiBookOpen } from 'react-icons/fi';

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
        
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Welcome, {user?.firstName || 'User'}!</h2>
            <p className="text-gray-600 mb-6">
              Here's your MCQ practice dashboard. Start practicing or create new tests.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/practice"
                className="bg-blue-50 text-blue-600 border-2 border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium flex items-center gap-2"
              >
                <FiPlay className="w-4 h-4" />
                Start Practice
              </Link>
              <Link 
                href="/tests" 
                className="bg-blue-50 text-blue-600 border-2 border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium flex items-center gap-2"
              >
                <FiList className="w-4 h-4" />
                My Tests
              </Link>
              <Link 
                href="/tests/create" 
                className="bg-blue-50 text-blue-600 border-2 border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Create Test
              </Link>
              <Link 
                href="/questions/create" 
                className="bg-blue-50 text-blue-600 border-2 border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Question
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tests Card */}
            <Link 
              href="/tests"
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-all">
                  <FiBookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">My Tests</h3>
              </div>
              <p className="text-gray-600 text-sm">View, edit and manage all your created tests</p>
            </Link>

            {/* Stats Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tests Completed</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your XP</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}