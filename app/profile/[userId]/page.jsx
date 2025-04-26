'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useUser } from '@clerk/nextjs';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiStar, FiBarChart2, FiAward, FiTrendingUp } from 'react-icons/fi';
import { BiCoin } from 'react-icons/bi';

export default function UserProfilePage({ params }) {
  const router = useRouter();
  const userId = React.use(params).userId;
  const { isLoaded, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        if (data.success) {
          setUserData(data.user);
          // Check if the profile belongs to the current user and redirect
          if (data.user.id === user?.id) {
            router.replace('/profile');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId && isLoaded) {
      fetchUserData();
    }
  }, [userId, isLoaded, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">{error || 'Failed to load user data'}</p>
        <Link href="/leaderboard" className="text-blue-600 hover:text-blue-700">
          Return to Leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userData.name}
            </h1>
            <p className="text-gray-600 mt-1">Public Profile</p>
          </div>
          <Link 
            href="/leaderboard"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            Back to Leaderboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-6">Profile Overview</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Level</h4>
                  <FiStar className="text-blue-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mt-2">Level {userData.level}</p>
                <p className="text-sm text-gray-600">{userData.xpPoints.toLocaleString()} XP Total</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-800">Rank</h4>
                  <FiTrendingUp className="text-purple-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-purple-600 mt-2">#{userData.rank}</p>
                <p className="text-sm text-gray-600">Overall Ranking</p>
              </div>

              
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 capitalize">
                  {userData.role}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-8">
              {/* Achievements section */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userData.achievements?.map((achievement, index) => (
                    <div 
                      key={index}
                      className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiAward className="text-blue-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!userData.achievements || userData.achievements.length === 0) && (
                    <p className="text-gray-500 col-span-2">No achievements yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}