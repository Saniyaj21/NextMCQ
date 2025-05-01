import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Attempt from '@/models/Attempt';
import Test from '@/models/Test';
import Question from '@/models/Question';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { attemptId } = params;
    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });
    }
    const attempt = await Attempt.findById(attemptId).lean();
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }
    const test = await Test.findById(attempt.testId).lean();
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    // Get all questions for this test
    const questions = await Question.find({ testId: attempt.testId }).lean();
    // Map answers for review
    const questionReview = questions.map(q => {
      const userAnswer = attempt.answers.find(a => a.questionId.toString() === q._id.toString());
      const correctIndex = q.options.findIndex(opt => opt.isCorrect);
      return {
        id: q._id,
        text: q.text,
        userAnswer: userAnswer ? userAnswer.selectedOption : null,
        correctAnswer: correctIndex,
        options: q.options.map(opt => ({ text: opt.text })),
        explanation: q.explanation || ''
      };
    });
    // Leaderboard position (rank by score desc, timeSpent asc)
    const allAttempts = await Attempt.find({ testId: attempt.testId }).sort({ score: -1, timeSpent: 1 });
    const leaderboardPosition = allAttempts.findIndex(a => a._id.equals(attempt._id)) + 1;
    // Rewards (same as in POST)
    const xp = attempt.score * 5;
    const coins = attempt.score * 5;
    return NextResponse.json({
      test: {
        title: test.title,
        totalQuestions: test.totalQuestions || questions.length
      },
      attempt: {
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.scorePercentage,
        timeSpent: attempt.timeSpent,
        rewards: { xp, coins },
        leaderboardPosition,
        completedAt: attempt.completedAt,
        questions: questionReview
      }
    });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 