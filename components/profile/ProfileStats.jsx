import { FiStar, FiBarChart2, FiAward, FiTrendingUp } from 'react-icons/fi';
import { BiCoin } from 'react-icons/bi';
import Image from 'next/image';
import xpIcon from '@/public/icons/xpicon.png';

export default function ProfileStats({ userData }) {
  if (!userData) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Stats & Achievements</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-800">Level</h4>
            <FiStar className="text-blue-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-blue-600 mt-2">Level {userData.level}</p>
          <span className="text-sm font-medium">{userData.xpPoints.toLocaleString()}
            <Image src={xpIcon} width={16} height={16} alt="xp" className="inline-block ml-1" />
          </span>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-800">Rank</h4>
            <FiTrendingUp className="text-purple-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-2">#{userData.rank}</p>
          <p className="text-sm text-gray-600">Overall Ranking</p>
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
          userData.achievements.map((achievement) => (
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
          ))
        ) : (
          <p className="text-gray-500">No achievements yet. Keep playing to earn achievements!</p>
        )}
      </div>
    </div>
  );
}