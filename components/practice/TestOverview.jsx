import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiUsers, FiStar, FiClock, FiHelpCircle } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';

export default function TestOverview({
  test,
  previousAttempts,
  leaderboard,
  totalPotentialRewards,
  onStartTest,
  formatTime
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/practice" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6"
        >
          <FiArrowLeft />
          Back to Practice Tests
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="mb-6 sm:mb-8">
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
                        <div className="relative p-2 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              scorePercentage >= 70 ? 'bg-green-100' :
                              scorePercentage >= 50 ? 'bg-yellow-100' :
                              'bg-red-100'
                            }`}>
                              <FiStar className={`w-5 h-5 ${
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

          {leaderboard && leaderboard.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
              <div className="grid gap-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                    <div className="p-2 sm:p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{entry.name}</div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Image
                                src="/icons/xpicon.png"
                                alt="XP"
                                width={16}
                                height={16}
                                className="opacity-90"
                              />
                              <span className="text-blue-600">+{entry.xp}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-600">+{entry.coins}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      } font-semibold text-sm`}>
                        #{entry.position}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={onStartTest}
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