'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function CreateTest() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    chapter: '',
    description: '',
    timeLimit: 60,
    isPublic: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test');
      }

      // Redirect to the test edit page or dashboard
      router.push(`/tests`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <FiArrowLeft />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Test</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Title*
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject*
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter
            </label>
            <input
              type="text"
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chapter (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              min="5"
              max="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
              Make this test public
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              } transition`}
            >
              {loading ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 