'use client';

import Link from 'next/link';
import { FaStar, FaTrophy, FaMedal } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';

export default function LeaderboardRow({ user, index }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-400 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-xl" />;
      default:
        return <span className="text-gray-500">{rank}</span>;
    }
  };

  return (
    <tr className={`${index < 3 ? 'bg-blue-50/50' : ''} hover:bg-gray-50 transition-colors`}>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          {getRankIcon(user.rank)}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <Link 
          href={`/profile/${user.id}`}
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {user.name}
        </Link>
      </td>
      <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 capitalize">
          {user.role}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center gap-1">
          <FaStar className="text-yellow-400" />
          {user.xpPoints.toLocaleString()}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 flex items-center gap-1">
          <BiCoin className="text-yellow-500" />
          {user.coins.toLocaleString()}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-blue-600">
          {user.level}
        </div>
      </td>
    </tr>
  );
}