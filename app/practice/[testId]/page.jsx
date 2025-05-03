'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import { FiArrowLeft, FiClock, FiHelpCircle, FiCheckCircle, FiXCircle, FiAlertCircle, FiAward, FiStar, FiUsers, FiCodesandbox } from 'react-icons/fi';
import { GiTwoCoins, GiCrownCoin } from 'react-icons/gi';
import Image from 'next/image';
import { TestHeader, Question, TestOverview } from '@/components/practice';

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
   const [amount, setAmount] = useState(1);

  
  
  
  const fetchTest = async () => {
    const response = await fetch(`/api/tests/practice/${testId}`);
    const data = await response.json();
    console.log(data);
    setTest(data.test);
    setTimeLeft(data.test.timeLimit * 60);
    setPreviousAttempts(data.previousAttempts);
    setLeaderboard(data.leaderboard);
    // Set reward amount based on previous attempts
    if (data.previousAttempts && data.previousAttempts.length > 0) {
      setAmount(1);
    } else {
      setAmount(5);
    }
    setLoading(false);
  }


  
  // Mock test data for UI development
  useEffect(() => {
    fetchTest()
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
        coins: prev.coins + amount,
        xp: prev.xp + amount
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

  const handleSubmitTest = async () => {
    setTestStatus('completed');
    // Prepare answers array for API
    const answersArr = test.questions.map(q => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id]
    }));
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          answers: answersArr,
          timeSpent: test.timeLimit ? (test.timeLimit * 60 - timeLeft) : undefined
        })
      });
      const data = await res.json();
      if (data.success && data.attemptId) {
        router.push(`/results/${data.attemptId}`);
      } else {
        alert(data.error || 'Failed to submit test');
      }
    } catch (err) {
      alert('Failed to submit test');
    }
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
      <TestOverview
        test={test}
        previousAttempts={previousAttempts}
        leaderboard={leaderboard}
        totalPotentialRewards={totalPotentialRewards}
        onStartTest={handleStartTest}
        formatTime={formatTime}
      />
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const currentVerification = verifiedAnswers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      <TestHeader
        title={test.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={test.totalQuestions}
        timeLeft={timeLeft}
        rewards={rewards}
        testStatus={testStatus}
        onSubmit={handleSubmitTest}
        formatTime={formatTime}
      />

      {/* Floating Reward Animation */}
      {showReward && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center animate-reward-float">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2 mb-2">
            <GiTwoCoins className="w-6 h-6 text-yellow-500 animate-bounce" />
            <span className="font-bold text-yellow-700">+{amount}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2">
            <Image
              src="/icons/xpicon.png"
              alt="XP"
              width={24}
              height={24}
              className="opacity-90 animate-bounce"
            />
            <span className="font-bold text-blue-700">+{amount}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Question
          amount={amount}
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={test.totalQuestions}
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          verification={currentVerification}
          onAnswerSelect={handleAnswerSelect}
          onVerify={handleVerifyAnswer}
          onNext={handleNextQuestion}
          onSubmit={handleSubmitTest}
          isLastQuestion={currentQuestionIndex === test.totalQuestions - 1}
        />
      </div>
    </div>
  );
} 