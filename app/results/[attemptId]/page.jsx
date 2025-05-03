"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiArrowLeft, FiAward, FiTrendingUp } from "react-icons/fi";
import { GiTwoCoins } from "react-icons/gi";
import Image from "next/image";

export default function ResultsPage() {
  const { attemptId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    fetch(`/api/attempts/${attemptId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch result");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading results...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }
  if (!data) return null;

  const { test, attempt } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/practice" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <FiArrowLeft /> Back to Practice
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Test Results</h1>
          <p className="text-blue-600 mb-4">{test.title}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FiAward className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {attempt.score}/{attempt.maxScore} ({Number(attempt.percentage).toFixed(2)}%)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <GiTwoCoins className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Rewards</p>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-700 flex items-center gap-1">
                    <GiTwoCoins className="w-5 h-5 text-yellow-500" />
                    {attempt.rewards.coins}
                  </span>
                  <span className="font-semibold text-blue-700 flex items-center gap-1">
                    <Image src="/icons/xpicon.png" alt="XP" width={16} height={16} className="inline-block opacity-90" />
                    {attempt.rewards.xp}
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