'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiEdit2, FiAward, FiCheckCircle, FiSettings, FiUser, FiBarChart2, FiStar, FiUsers } from 'react-icons/fi';
import { BiCoin } from 'react-icons/bi';
import Loading from '@/components/Loading';
import ReferralLinkGenerator from '@/components/ReferralLinkGenerator';

export default function ProfilePage() {
  const { isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/profile?clerkId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setUserData(data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  const renderAchievementCard = (achievement) => (
    <div key={achievement.name} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <FiAward className="text-blue-600 text-xl" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{achievement.name}</h4>
        <p className="text-sm text-gray-500">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Failed to load user data</p>
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
                  alt={userData.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-500 text-4xl">
                  <FiUser />
                </div>
              )}
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-sm text-blue-600 mt-1">{userData.role}</p>

              <div className="mt-4 w-full space-y-4">
                {/* Coins Display */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Coins</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <BiCoin className="text-yellow-500" />
                      {userData.coins}
                    </span>
                  </div>
                </div>

                {/* XP and Level Display */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Level {userData.level}</span>
                    <span className="text-sm font-medium">{userData.xpPoints} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((userData.xpPoints % 100) / 100 * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Streak Display */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <FiStar className="text-yellow-500" />
                      {userData.streak.current} days
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Longest: {userData.streak.longest} days
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation tabs */}
            <nav className="mt-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
              >
                <FiUser className="text-lg" />
                <span>Profile Information</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
              >
                <FiBarChart2 className="text-lg" />
                <span>Stats & Achievements</span>
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`w-full text-left py-3 px-4 rounded-lg mb-2 flex items-center gap-3 ${activeTab === 'referrals' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
              >
                <FiUsers className="text-lg" />
                <span>Referrals</span>
              </button>
            </nav>
          </div>


        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Profile Information tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 break-words overflow-hidden">
                      {userData.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 break-all overflow-hidden">
                      {userData.email}
                    </p>
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                    <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                      {userData.referralCode}
                    </p>
                  </div>

                  {/* {userData.referredBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                      <p className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                        {userData.referredBy.name} ({userData.referredBy.email})
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            )}

            {/* Stats & Achievements tab */}
            {activeTab === 'stats' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Stats & Achievements</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Level</h4>
                      <FiStar className="text-blue-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mt-2">Level {userData.level}</p>
                    <p className="text-sm text-gray-600">{userData.xpPoints} XP Total</p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Coins</h4>
                      <BiCoin className="text-yellow-600 text-xl" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{userData.coins}</p>
                    <p className="text-sm text-gray-600">Available to spend</p>
                  </div>
                </div>

                <h4 className="font-semibold text-lg mb-4">Achievements</h4>
                <div className="space-y-4">
                  {userData.achievements?.length > 0 ? (
                    userData.achievements.map(achievement => renderAchievementCard(achievement))
                  ) : (
                    <p className="text-gray-500">No achievements yet. Keep practicing!</p>
                  )}
                </div>
              </div>
            )}

            {/* Referrals tab */}
            {activeTab === 'referrals' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Referral Program</h3>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-medium mb-2">Your Impact</h4>
                  <div className="text-3xl font-bold text-blue-600">{userData.referralCount}</div>
                  <p className="text-gray-600">People joined using your referral</p>
                </div>

                {/* Add ReferralLinkGenerator in sidebar */}
                <div className="mt-6">
                  <ReferralLinkGenerator referralCode={userData.referralCode} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}