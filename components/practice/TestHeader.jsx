import Image from 'next/image';
import { FiClock, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';

export default function TestHeader({ 
  title, 
  currentQuestionIndex, 
  totalQuestions, 
  timeLeft, 
  rewards, 
  testStatus, 
  onSubmit,
  formatTime 
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between">
          {/* Left Section: Title and Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <FiHelpCircle className="w-4 h-4 text-blue-500" />
                {currentQuestionIndex + 1}/{totalQuestions}
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
                onClick={onSubmit}
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
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
} 