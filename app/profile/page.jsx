'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiEdit2, FiAward, FiCheckCircle, FiSettings, FiUser, FiBarChart2 } from 'react-icons/fi';
import Loading from '@/components/Loading';
import ReferralLinkGenerator from '@/components/ReferralLinkGenerator';

export default function ProfilePage() {
  const { isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [userReferralCode, setUserReferralCode] = useState('');
  
  // Mock data for demonstration
  const stats = {
    testsCompleted: 24,
    totalXP: 1250,
    questionsAnswered: 146,
    accuracy: 78,
    streak: 7,
    rank: 'Intermediate'
  };
  
  // Generate a mock referral code based on the user's name
  useEffect(() => {
    if (user?.firstName) {
      const namePrefix = user.firstName.substring(0, 3).toUpperCase();
      const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
      setUserReferralCode(`${namePrefix}${randomString}`);
    }
  }, [user]);
  
  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar with user info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center mb-6">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || 'User'} 
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-500 text-4xl">
                  <FiUser />
                </div>
              )}
              <h2 className="text-xl font-semibold">{user.fullName || user.username || 'User'}</h2>
              <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress || ''}</p>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">XP Level</span>
                  <span className="text-sm font-medium">{stats.rank}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Navigation tabs */}
            <nav className="mt-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <FiUser className="text-lg" />
                <span>Profile Information</span>
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${
                  activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <FiBarChart2 className="text-lg" />
                <span>My Stats</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${
                  activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <FiSettings className="text-lg" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          
          {/* Add ReferralLinkGenerator in sidebar */}
          {userReferralCode && (
            <div className="mt-6">
              <ReferralLinkGenerator referralCode={userReferralCode} />
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Profile Information tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  <button className="text-blue-600 flex items-center gap-1">
                    <FiEdit2 className="text-sm" /> Edit
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.fullName || 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.primaryEmailAddress?.emailAddress || 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.username || 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Stats tab */}
            {activeTab === 'stats' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">My Stats</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Total XP</h4>
                      <FiAward className="text-blue-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalXP}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Tests Completed</h4>
                      <FiCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.testsCompleted}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Questions Answered</span>
                      <span className="font-bold">{stats.questionsAnswered}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Accuracy Rate</span>
                      <span className="font-bold">{stats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stats.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Current Streak</span>
                      <span className="font-bold">{stats.streak} days</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    View Detailed Stats
                  </button>
                </div>
              </div>
            )}
            
            {/* Settings tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                          <span>Email notifications</span>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                          <span>Daily practice reminders</span>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                          <span>Achievement notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                          <span>Show me in leaderboards</span>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                          <span>Allow friends to see my progress</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Account</h4>
                    <div className="space-y-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        Change password
                      </button>
                      <div>
                        <button className="text-red-600 hover:text-red-800">
                          Delete account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 