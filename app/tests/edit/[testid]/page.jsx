'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiX, FiEdit3, FiTrash2, FiAlertCircle, FiBook, FiCheck } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';

export default function EditTestPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const params = useParams();
  const testId = params.testid;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      if (!user) return;
      
      try {
        // Fetch test details
        const testResponse = await fetch(`/api/tests/${testId}?creatorId=${user.id}`);
        const testData = await testResponse.json();
        
        if (!testResponse.ok) {
          throw new Error(testData.error || 'Failed to fetch test');
        }
        
        setTest(testData.test);

        // Fetch questions
        const questionsResponse = await fetch(`/api/questions?testId=${testId}`);
        const questionsData = await questionsResponse.json();
        
        if (!questionsResponse.ok) {
          throw new Error(questionsData.error || 'Failed to fetch questions');
        }
        
        setQuestions(questionsData.questions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTestAndQuestions();
    }
  }, [user, testId]);

  const handleDeleteQuestion = async (questionId) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}?testId=${testId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete question');
      }
      
      setQuestions(questions.filter(q => q._id !== questionId));
      setDeleteConfirm(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <p>Test not found or you don't have permission to edit it.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
              <p className="text-gray-600">
                {test.subject} {test.chapter && `• ${test.chapter}`}
              </p>
            </div>
            <Link
              href={`/questions/create?testId=${testId}`}
              className="bg-blue-50 border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium"
            >
              <FiPlus className="w-4 h-4" /> Add Question
            </Link>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 border-2 border-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBook className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No questions yet</h3>
              <p className="text-gray-600 mb-8">Start adding questions to your test!</p>
              <Link
                href={`/questions/create?testId=${testId}`}
                className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-all font-medium"
              >
                <FiPlus className="w-4 h-4" /> Add Your First Question
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {index + 1}. {question.text}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg ${
                            option.isCorrect
                              ? 'bg-green-50 border border-green-200 text-green-700'
                              : 'bg-gray-50 border border-gray-200 text-gray-700'
                          }`}
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="mt-4 text-gray-600 text-sm">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/questions/edit/${question._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <FiEdit3 className="w-5 h-5" />
                    </Link>
                    {deleteConfirm === question._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          disabled={deleteLoading}
                          className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all ${
                            deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          disabled={deleteLoading}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(question._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
