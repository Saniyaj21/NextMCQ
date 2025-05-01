'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import { FiArrowLeft, FiClock, FiHelpCircle, FiCheckCircle, FiXCircle, FiAlertCircle, FiAward, FiStar, FiUsers, FiCodesandbox } from 'react-icons/fi';
import { GiTwoCoins, GiCrownCoin } from 'react-icons/gi';
import Image from 'next/image';

export default function TestPage() {
  const { testId } = useParams();
  const router = useRouter();
  const { isLoaded, user } = useUser();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [verifiedAnswers, setVerifiedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [testStatus, setTestStatus] = useState('not_started'); // not_started, in_progress, completed
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState({ coins: 0, xp: 0 });
  const [showReward, setShowReward] = useState(false);
  
  // Mock test data for UI development
  useEffect(() => {
    const mockTest = {
      _id: testId,
      title: "Sample Mathematics Test",
      subject: "Mathematics",
      chapter: "Algebra",
      difficulty: "medium",
      timeLimit: 30,
      totalQuestions: 10,
      description: "Test your knowledge of basic algebraic concepts",
      attemptsCount: 156,
      rating: 4.5,
      isPublic: true,
      creator: {
        name: "John Doe",
        _id: "123"
      },
      questions: [
        {
          id: 1,
          text: "What is the value of x in the equation 2x + 5 = 13?",
          image: null,
          options: [
            { text: "x = 3", image: null },
            { text: "x = 4", image: null },
            { text: "x = 5", image: null },
            { text: "x = 6", image: null }
          ],
          correctOption: 1,
          difficulty: "medium",
          explanation: "2x + 5 = 13\n2x = 8\nx = 4"
        }
      ]
    };

    // Mock previous attempts
    const mockAttempts = [
      { score: 8, maxScore: 10, timeSpent: 1200, completedAt: new Date() },
      { score: 7, maxScore: 10, timeSpent: 1500, completedAt: new Date(Date.now() - 86400000) }
    ];

    // Updated mock leaderboard with both XP and coins
    const mockLeaderboard = [
      { userId: "1", name: "Alice", xp: 50, coins: 45, position: 1, avatar: null },
      { userId: "2", name: "Bob", xp: 45, coins: 40, position: 2, avatar: null },
      { userId: "3", name: "Charlie", xp: 40, coins: 35, position: 3, avatar: null },
      { userId: "4", name: "David", xp: 35, coins: 30, position: 4, avatar: null },
      { userId: "5", name: "Eva", xp: 30, coins: 25, position: 5, avatar: null }
    ];

    setTest(mockTest);
    setTimeLeft(mockTest.timeLimit * 60);
    setPreviousAttempts(mockAttempts);
    setLeaderboard(mockLeaderboard);
    setLoading(false);
  }, [testId]);

  // Timer effect
  useEffect(() => {
    if (testStatus === 'in_progress' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTestStatus('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStatus, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStatus('in_progress');
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (!verifiedAnswers[questionId]) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex
      }));
    }
  };

  const handleVerifyAnswer = (questionId) => {
    const currentQuestion = test.questions[currentQuestionIndex];
    const isCorrect = selectedAnswers[questionId] === currentQuestion.correctOption;
    
    setVerifiedAnswers(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        selectedOption: selectedAnswers[questionId]
      }
    }));

    if (isCorrect) {
      setRewards(prev => ({
        coins: prev.coins + 5,
        xp: prev.xp + 5
      }));
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    setTestStatus('completed');
    // Submit logic would go here
  };

  // Calculate total potential rewards
  const totalPotentialRewards = test?.totalQuestions ? {
    coins: test.totalQuestions * 5,
    xp: test.totalQuestions * 5
  } : { coins: 0, xp: 0 };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
            <p className="text-gray-600 mb-6">The test you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft />
              Back to Practice Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (testStatus === 'not_started') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/practice" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FiArrowLeft />
            Back to Practice Tests
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{test.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" />
                      {test.attemptsCount} attempts
                    </span>
                    <span className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      {test.rating.toFixed(1)}
                    </span>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      test.difficulty === 'hard' ? 'bg-red-100 text-red-700 border border-red-200' :
                      test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        test.difficulty === 'hard' ? 'bg-red-400' :
                        test.difficulty === 'medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiClock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time Limit</p>
                    <p className="font-semibold text-gray-900">{test.timeLimit} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FiHelpCircle className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="font-semibold text-gray-900">{test.totalQuestions} questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <GiTwoCoins className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Rewards</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-yellow-700">{totalPotentialRewards.coins}</span>
                        <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-blue-700">{totalPotentialRewards.xp}</span>
                        <Image
                          src="/icons/xpicon.png"
                          alt="XP"
                          width={16}
                          height={16}
                          className="opacity-90"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {previousAttempts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Attempts</h2>
                <div className="grid gap-3">
                  {previousAttempts.map((attempt, index) => {
                    const scorePercentage = (attempt.score / attempt.maxScore) * 100;
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                        <div className="relative">
                          {/* Score Progress Bar */}
                          <div 
                            className={`absolute top-0 left-0 h-full ${
                              scorePercentage >= 70 ? 'bg-green-50' :
                              scorePercentage >= 50 ? 'bg-yellow-50' :
                              'bg-red-50'
                            } transition-all duration-300`}
                            style={{ width: `${scorePercentage}%` }}
                          />
                          
                          {/* Content */}
                          <div className="relative p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                scorePercentage >= 70 ? 'bg-green-100' :
                                scorePercentage >= 50 ? 'bg-yellow-100' :
                                'bg-red-100'
                              }`}>
                                <FiCheckCircle className={`w-5 h-5 ${
                                  scorePercentage >= 70 ? 'text-green-600' :
                                  scorePercentage >= 50 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`} />
                              </div>
                              <div>
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-gray-900">
                                    {attempt.score}/{attempt.maxScore}
                                  </span>
                                  <span className={`text-sm ${
                                    scorePercentage >= 70 ? 'text-green-600' :
                                    scorePercentage >= 50 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {scorePercentage.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <FiClock className="w-4 h-4" />
                                  {formatTime(attempt.timeSpent)}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 sm:text-right">
                              {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {leaderboard.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={index} 
                      className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold bg-blue-100 text-blue-800">
                            {entry.position}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900 truncate">{entry.name}</span>
                              {index === 0 && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                  <GiCrownCoin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                                  Leader
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rewards Info */}
                        <div className="flex items-center gap-4 ml-10 sm:ml-0">
                          <div className="flex items-center gap-1.5">
                            <Image
                              src="/icons/xpicon.png"
                              alt="XP"
                              width={16}
                              height={16}
                              className="opacity-90 w-4 h-4 sm:w-4 sm:h-4"
                            />
                            <span className="font-semibold text-blue-700 text-sm sm:text-base">{entry.xp}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-yellow-700 text-sm sm:text-base">{entry.coins}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-400"
                          style={{ 
                            width: `${(entry.xp / leaderboard[0].xp) * 100}%`,
                            transition: 'all 0.5s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleStartTest}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const currentVerification = verifiedAnswers[currentQuestion.id];
  const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between">
            {/* Left Section: Title and Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{test.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <FiHelpCircle className="w-4 h-4 text-blue-500" />
                  {currentQuestionIndex + 1}/{test.totalQuestions}
                </span>
                <span className="hidden sm:block text-gray-300">|</span>
                <span className={`flex items-center gap-1.5 ${
                  timeLeft < 300 ? 'text-red-600 font-medium' : ''
                }`}>
                  <FiClock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`} />
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Right Section: Rewards and Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
              {/* Rewards Display */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-yellow-700 text-sm">+{rewards.coins}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Image
                    src="/icons/xpicon.png"
                    alt="XP"
                    width={16}
                    height={16}
                    className="opacity-90"
                  />
                  <span className="font-medium text-blue-700 text-sm">+{rewards.xp}</span>
                </div>
              </div>

              {/* Submit Button */}
              {testStatus === 'in_progress' && (
                <button
                  onClick={handleSubmitTest}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit Test</span>
                  <span className="sm:hidden">Submit</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-gray-100 mt-3">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ 
                width: `${((currentQuestionIndex + 1) / test.totalQuestions) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Reward Animation */}
      {showReward && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center animate-reward-float">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2 mb-2">
            <GiTwoCoins className="w-6 h-6 text-yellow-500 animate-bounce" />
            <span className="font-bold text-yellow-700">+5</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2">
            <Image
              src="/icons/xpicon.png"
              alt="XP"
              width={24}
              height={24}
              className="opacity-90 animate-bounce"
            />
            <span className="font-bold text-blue-700">+5</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Question Number and Info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Question {currentQuestionIndex + 1} of {test.totalQuestions}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                  currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                </span>
                {!currentVerification && (
                  <span className="text-sm text-gray-500">
                    • Answer correctly to earn 5 coins and XP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="text-gray-900 text-lg mb-6">
              {currentQuestion.text}
              {currentQuestion.image && (
                <img
                  src={currentQuestion.image.url}
                  alt="Question"
                  className="mt-4 max-w-full rounded-lg"
                />
              )}
            </div>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  disabled={currentVerification}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentVerification
                      ? index === currentQuestion.correctOption
                        ? 'border-green-500 bg-green-50'
                        : index === selectedAnswers[currentQuestion.id]
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 opacity-50'
                      : selectedAnswers[currentQuestion.id] === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      currentVerification
                        ? index === currentQuestion.correctOption
                          ? 'border-green-500 bg-green-500'
                          : index === selectedAnswers[currentQuestion.id]
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        : selectedAnswers[currentQuestion.id] === index
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                    }`}>
                      {(currentVerification && index === currentQuestion.correctOption) && (
                        <FiCheckCircle className="w-4 h-4 text-white" />
                      )}
                      {(currentVerification && index === selectedAnswers[currentQuestion.id] && !currentVerification.isCorrect) && (
                        <FiXCircle className="w-4 h-4 text-white" />
                      )}
                      {(!currentVerification && selectedAnswers[currentQuestion.id] === index) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-900">{option.text}</span>
                      {option.image && (
                        <img
                          src={option.image.url}
                          alt={`Option ${index + 1}`}
                          className="mt-2 max-w-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation - shown after verification */}
          {currentVerification && (
            <div className={`mt-6 p-4 rounded-lg ${
              currentVerification.isCorrect ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                {currentVerification.isCorrect ? (
                  <>
                    <FiCheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-green-800">Correct!</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 rounded text-sm">
                          <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-yellow-700">+5</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded text-sm">
                          <Image
                            src="/icons/xpicon.png"
                            alt="XP"
                            width={16}
                            height={16}
                            className="opacity-90"
                          />
                          <span className="font-medium text-blue-700">+5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{currentQuestion.explanation}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FiXCircle className="w-6 h-6 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800 mb-2">Incorrect</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{currentQuestion.explanation}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
            {!currentVerification && hasSelectedAnswer && (
              <button
                onClick={() => handleVerifyAnswer(currentQuestion.id)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Answer
              </button>
            )}
            {currentVerification && (
              currentQuestionIndex < test.totalQuestions - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Test
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 