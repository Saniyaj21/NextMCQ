'use client';

import { FiUser, FiBook } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';
import Image from 'next/image';
import xpIcon from '@/public/icons/xpicon.png';

export default function LeaderboardFilters({ 
  selectedFilter, 
  setSelectedFilter, 
  selectedCategory, 
  setSelectedCategory 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category filters */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">Category</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedCategory === '' 
                  ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <FiUser className={`text-sm ${selectedCategory === '' ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-xs">All Users</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('student')}
              className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedCategory === 'student' 
                  ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <FiBook className={`text-sm ${selectedCategory === 'student' ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-xs">Students</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('teacher')}
              className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedCategory === 'teacher' 
                  ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <FiUser className={`text-sm ${selectedCategory === 'teacher' ? 'text-green-500' : 'text-gray-500'}`} />
              <span className="text-xs">Teachers</span>
            </button>
          </div>
        </div>

        {/* Sorting filters */}
        <div>
          <h3 className="text-xs font-medium text-gray-700 mb-2">Sort By</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button 
              onClick={() => setSelectedFilter('xp')}
              className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedFilter === 'xp' 
                  ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <Image src={xpIcon} width={16} height={16} alt="xp" className="inline-block" />
              <span className="text-xs">XP Points</span>
            </button>
            <button 
              onClick={() => setSelectedFilter('coins')}
              className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                selectedFilter === 'coins' 
                  ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <BiCoin className="text-yellow-500 text-sm" />
              <span className="text-xs">Coins</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}