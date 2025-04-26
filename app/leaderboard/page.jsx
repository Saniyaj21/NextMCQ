'use client';

import { useState, useEffect } from 'react';
import { BiCoin } from 'react-icons/bi';
import { FaStar, FaTrophy, FaMedal } from 'react-icons/fa';
import { FiBook, FiUser } from 'react-icons/fi';
import Loading from '@/components/Loading';

export default function LeaderboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('xp');
  const [selectedCategory, setSelectedCategory] = useState(''); // '' means all
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedFilter, selectedCategory]);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        sortBy: selectedFilter,
      });
      if (selectedCategory) {
        queryParams.append('category', selectedCategory);
      }
      const response = await fetch(`/api/leaderboard?${queryParams}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch leaderboard data');
      }
      
      setLeaderboardData(data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-400 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaMedal className="text-yellow-600 text-xl" />;
      default:
        return <span className="text-gray-500">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900  sm:mb-0">Leaderboard</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Filter section with improved design */}
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
                  <FaStar className="text-yellow-500 text-sm" />
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
                <button 
                  onClick={() => setSelectedFilter('level')}
                  className={`flex-1 sm:flex-none px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    selectedFilter === 'level' 
                      ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                      : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <FaTrophy className="text-yellow-500 text-sm" />
                  <span className="text-xs">Level</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard table with responsive design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Rank
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    XP
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`${index < 3 ? 'bg-blue-50/50' : ''} hover:bg-gray-50 transition-colors`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No leaderboard data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}