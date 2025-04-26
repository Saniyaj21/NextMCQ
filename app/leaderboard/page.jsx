'use client';

import { useState, useEffect } from 'react';
import LeaderboardHeader from '@/components/leaderboard/LeaderboardHeader';
import LeaderboardFilters from '@/components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

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

  const getLeaderboardData = () => {
    // In the future, this will fetch real data based on the filter
    return dummyLeaderboardData.sort((a, b) => {
      switch(selectedFilter) {
        case 'coins':
          return b.coins - a.coins;
        case 'xp':
        default:
          return b.xp - a.xp;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <LeaderboardHeader error={error} />
        
        <LeaderboardFilters 
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        <LeaderboardTable 
          isLoading={isLoading}
          leaderboardData={leaderboardData}
        />
      </div>
    </div>
  );
}