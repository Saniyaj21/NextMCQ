"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiClock, FiArrowLeft, FiAward, FiTrendingUp } from "react-icons/fi";
import { GiTwoCoins } from "react-icons/gi";
import Image from "next/image";

export default function ResultsPage() {
  // Placeholder/mock data
  const test = {
    title: "Sample Mathematics Test",
    totalQuestions: 10,
  };
  const attempt = {
    score: 8,
    maxScore: 10,
    percentage: 80,
    timeSpent: 720, // seconds
    rewards: { xp: 40, coins: 40 },
    leaderboardPosition: 3,
    completedAt: new Date(),
    questions: [
      {
        id: 1,
        text: "What is the value of x in the equation 2x + 5 = 13?",
        userAnswer: 1,
        correctAnswer: 1,
        options: [
          { text: "x = 3" },
          { text: "x = 4" },
          { text: "x = 5" },
          { text: "x = 6" },
        ],
        explanation: "2x + 5 = 13\n2x = 8\nx = 4",
      },
      {
        id: 2,
        text: "What is 5 + 7?",
        userAnswer: 2,
        correctAnswer: 1,
        options: [
          { text: "12" },
          { text: "13" },
          { text: "14" },
          { text: "15" },
        ],
        explanation: "5 + 7 = 12",
      },
      // ...more questions
    ],
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Test Results</h1>
          <p className="text-gray-600 mb-4">{test.title}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FiAward className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {attempt.score}/{attempt.maxScore} ({attempt.percentage}%)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <GiTwoCoins className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Rewards</p>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-700">+{attempt.rewards.coins} coins</span>
                  <span className="font-semibold text-blue-700 flex items-center gap-1">
                    +{attempt.rewards.xp}
                    <Image src="/icons/xpicon.png" alt="XP" width={16} height={16} className="inline-block opacity-90" /> XP
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <FiClock className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="font-semibold text-gray-900">{formatTime(attempt.timeSpent)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Leaderboard Position</p>
                <p className="font-semibold text-purple-700">#{attempt.leaderboardPosition}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 mb-2">
            <Link href="/practice" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              Retake Test
            </Link>
            <Link href="/dashboard" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Question Review</h2>
          <div className="space-y-6">
            {attempt.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">Q{idx + 1}.</span>
                  <span className="text-gray-900">{q.text}</span>
                </div>
                <div className="space-y-2 mb-2">
                  {q.options.map((opt, i) => {
                    const isUser = i === q.userAnswer;
                    const isCorrect = i === q.correctAnswer;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
                          ${isCorrect ? "border-green-500 bg-green-50" :
                            isUser && !isCorrect ? "border-red-500 bg-red-50" :
                            "border-gray-200"}
                        `}
                      >
                        {isCorrect ? (
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                        ) : isUser ? (
                          <FiXCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <span className="w-4 h-4 inline-block" />
                        )}
                        <span className={isCorrect ? "font-semibold text-green-700" : isUser ? "font-semibold text-red-700" : ""}>
                          {opt.text}
                        </span>
                        {isUser && !isCorrect && <span className="ml-2 text-xs text-red-500">Your answer</span>}
                        {isCorrect && <span className="ml-2 text-xs text-green-600">Correct answer</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-wrap">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 