'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Loading from '@/components/ui/Loading';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileStats from '@/components/profile/ProfileStats';
import ReferralSection from '@/components/profile/ReferralSection';

export default function ProfilePage() {
  const { isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/users/profile?clerkId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserData(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

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
        {/* Sidebar */}
        <ProfileSidebar 
          user={user}
          userData={userData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main content area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Profile Information tab */}
            {activeTab === 'profile' && <ProfileInfo userData={userData} />}

            {/* Stats & Achievements tab */}
            {activeTab === 'stats' && <ProfileStats userData={userData} />}

            {/* Referrals tab */}
            {activeTab === 'referrals' && <ReferralSection userData={userData} />}
          </div>
        </div>
      </div>
    </div>
  );
}