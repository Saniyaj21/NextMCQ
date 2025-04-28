import { FiUser, FiBarChart2, FiUsers, FiStar } from 'react-icons/fi';
import { BiCoin } from 'react-icons/bi';
import xpIcon from '@/public/icons/xpicon.png';
import Image from 'next/image';

export default function ProfileSidebar({ user, userData, activeTab, setActiveTab }) {
  if (!userData) return null;

  return (
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Coins</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  {userData.coins}
                  <BiCoin className="text-yellow-500" />
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Level {userData.level}</span>
                <span className="text-sm font-medium">{userData.xpPoints}
                <Image src={xpIcon} width={16} height={16} alt="xp" className="inline-block ml-1" />
                </span>
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

            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  {userData.streak?.current} days
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav>
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
  );
}