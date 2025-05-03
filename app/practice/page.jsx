'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Loading from '@/components/ui/Loading';
import { FiSearch, FiFilter, FiClock, FiBook, FiArrowLeft, FiUser, FiAward, FiFileText, FiCalendar, FiStar } from 'react-icons/fi';
import Link from 'next/link';

export default function PracticePage() {
  const { isLoaded, user } = useUser();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [filterSubject, setFilterSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);

  console.log(tests);
  
  // Fetch tests
  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch('/api/tests/public');
        const data = await response.json();
        if (data.success) {
          setTests(data.tests);
          // Extract unique subjects
          const uniqueSubjects = [...new Set(data.tests.map(test => test.subject))];
          setSubjects(uniqueSubjects);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchTests();
    }
  }, [isLoaded]);

  // Filter and sort tests
  const filteredAndSortedTests = tests
    .filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === 'all' || test.subject === filterSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link 
              href="/dashboard" 
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
            >
              <FiArrowLeft />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Practice Tests</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTests.map(test => (
            <Link
              key={test._id}
              href={`/practice/${test._id}`}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-100 transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Badges Section */}
                    <div className="space-y-2 mb-4">
                      {/* Subject Badge */}
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 border-2 border-blue-500 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-blue-100 hover:border-blue-600 transition-all">
                          <FiBook className="w-3.5 h-3.5" />
                          <span className="font-semibold tracking-wide uppercase">{test.subject}</span>
                        </span>
                      </div>
                      
                      {/* Chapter Badge - Only shown if exists */}
                      {test.chapter && (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <FiFileText className="w-3.5 h-3.5" />
                            <span>Chapter: {test.chapter}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {test.title}
                    </h3>
                    {test.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-4">
                        {test.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{test.timeLimit}m</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center border-l border-r border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">{test.questionCount|| 0}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                {/* <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{test?.rating}</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div> */}
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{test?.attemptsCount || 0}</div>
                  <div className="text-xs text-gray-500">Attempts</div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 mt-auto bg-gray-50 group-hover:bg-blue-50/50 transition-colors">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${test.creatorName}`}
                      alt={test.creatorName}
                      className="w-6 h-6 rounded-full bg-blue-100"
                    />
                    <span className="text-gray-600 font-medium">{test.creatorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Start Test Button - Shown on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                <button className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-full font-medium transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  Start Test
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 