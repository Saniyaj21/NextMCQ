'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FiPlus, FiClock, FiUsers, FiStar, FiEdit3, FiTrash2, FiX, FiBook, FiBookOpen } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';

export default function TestsPage() {
  const { isLoaded, user } = useUser();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/tests?creatorId=${user.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tests');
        }
        
        setTests(data.tests);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTests();
    }
  }, [user]);

  const handleDelete = async (testId) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/tests/${testId}?creatorId=${user.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete test');
      }
      
      setTests(tests.filter(test => test._id !== testId));
      setDeleteConfirm(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tests</h1>
              <p className="text-gray-600">Manage and organize your created tests</p>
            </div>
            <Link
              href="/tests/create"
              className="bg-blue-50 border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium"
            >
              <FiPlus className="w-4 h-4" /> Create New Test
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <FiX className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-700 p-1 hover:bg-red-100 rounded-lg transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 border-2 border-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBook className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No tests created yet</h3>
              <p className="text-gray-600 mb-8">Start creating your first test to begin your teaching journey!</p>
              <Link
                href="/tests/create"
                className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium"
              >
                <FiPlus className="w-4 h-4" /> Create Your First Test
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {test.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiBookOpen className="w-4 h-4" />
                      <p className="text-sm">
                        {test.subject} {test.chapter && `• ${test.chapter}`}
                      </p>
                    </div>
                  </div>
                  {test.isPublic && (
                    <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      Public
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-blue-600" />
                    <span>{test.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-blue-600" />
                    <span>{test.attemptsCount} attempts</span>
                  </div>
                  {test.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      <span>{test.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/tests/edit/${test._id}`}
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-300 transition-all font-medium"
                  >
                    <FiEdit3 className="w-4 h-4" /> Edit
                  </Link>
                  {deleteConfirm === test._id ? (
                    <div className="flex-[2] flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(test._id)}
                        disabled={deleteLoading}
                        className={`flex-1 bg-red-50 border-2 border-red-500 text-red-600 px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 font-medium ${
                          deleteLoading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-red-100 hover:border-red-600 hover:text-red-700'
                        } transition-all text-sm`}
                      >
                        {deleteLoading ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        disabled={deleteLoading}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(test._id)}
                      className="flex-1 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 hover:border-red-300 transition-all font-medium"
                    >
                      <FiTrash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 