'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiPlus, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function CreateQuestionPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedTestId = searchParams.get('testId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    text: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: '',
    difficulty: 'medium',
    selectedTests: preSelectedTestId ? [preSelectedTestId] : [],
  });

  useEffect(() => {
    const fetchTests = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/tests?creatorId=${user.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch tests');
        setTests(data.tests);
      } catch (error) {
        setError(error.message);
      }
    };

    if (user) fetchTests();
  }, [user]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (index) => {
    const newOptions = formData.options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 5) {
      setFormData({
        ...formData,
        options: [...formData.options, { text: '', isCorrect: false }],
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      // If we're removing the correct answer, make the first option correct
      if (formData.options[index].isCorrect) {
        newOptions[0].isCorrect = true;
      }
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleTestSelection = (testId) => {
    const selectedTests = formData.selectedTests.includes(testId)
      ? formData.selectedTests.filter(id => id !== testId)
      : [...formData.selectedTests, testId];
    setFormData({ ...formData, selectedTests: selectedTests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.text.trim()) throw new Error('Question text is required');
      if (!formData.options.some(opt => opt.isCorrect)) throw new Error('Please select a correct answer');
      if (formData.options.some(opt => !opt.text.trim())) throw new Error('All options must have text');
      if (formData.selectedTests.length === 0) throw new Error('Please select at least one test');

      // Create question for all selected tests at once
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.text,
          options: formData.options,
          explanation: formData.explanation,
          difficulty: formData.difficulty,
          testIds: formData.selectedTests,
          userId: user.id,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create question');
      }

      // Show reward toast
      if (data.rewards) {
        toast.success(
          <div>
            <p>Question created successfully!</p>
            <p className="text-sm mt-1">
              Rewards: +{data.rewards.xp} XP, +{data.rewards.coins} coins
            </p>
          </div>,
          {
            duration: 5000,
            icon: '🎉',
          }
        );
      }

      // Redirect to the test page if only one test was selected
      if (formData.selectedTests.length === 1) {
        router.push(`/tests/edit/${formData.selectedTests[0]}`);
      } else {
        router.push('/tests');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Question</h1>
          <p className="text-gray-600">Add a new question to your test(s)</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Text */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Question Text</span>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                placeholder="Enter your question here..."
                required
              />
            </label>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Options (Min: 2, Max: 5)</span>
                {formData.options.length < 5 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <FiPlus className="w-4 h-4" /> Add Option
                  </button>
                )}
              </div>
              
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-600">Correct</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="mt-6">
              <label className="block">
                <span className="text-gray-700 font-medium">Explanation (Optional)</span>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  rows="2"
                  placeholder="Explain why the correct answer is correct..."
                />
              </label>
            </div>

            {/* Difficulty */}
            <div className="mt-6">
              <label className="block">
                <span className="text-gray-700 font-medium">Difficulty Level</span>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
          </div>

          {/* Test Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-gray-700 font-medium">Select Tests</h3>
              <p className="text-sm text-gray-500 mt-1">Choose one or more tests to add this question to</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <label
                  key={test._id}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.selectedTests.includes(test._id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedTests.includes(test._id)}
                    onChange={() => handleTestSelection(test._id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{test.title}</div>
                    <div className="text-sm text-gray-500">
                      {test.subject} {test.chapter && `• ${test.chapter}`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              } transition-all`}
            >
              {loading ? (
                <>
                  <Loading className="w-4 h-4" />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Create Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 