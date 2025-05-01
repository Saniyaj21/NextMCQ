import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Test from '@/models/Test';
import Question from '@/models/Question';
import Attempt from '@/models/Attempt';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { testId } = await params;
    if (!testId) {
      return NextResponse.json({ error: 'Missing testId' }, { status: 400 });
    }
    const test = await Test.findById(testId).lean();
    if (!test || !test.isPublic) {
      return NextResponse.json({ error: 'Test not found or not public' }, { status: 404 });
    }
    // Get questions (omit correct answers)
    const questions = await Question.find({ testId }).lean();
    const safeQuestions = questions.map(q => ({
      id: q._id,
      text: q.text,
      image: q.image,
      options: q.options.map(opt => ({ text: opt.text, image: opt.image })),
      difficulty: q.difficulty,
      explanation: q.explanation || ''
    }));
    // Get leaderboard (top 5 attempts by score desc, timeSpent asc)
    const leaderboardAttempts = await Attempt.find({ testId })
      .sort({ score: -1, timeSpent: 1 })
      .limit(5)
      .populate('userId', 'name');
    const leaderboard = leaderboardAttempts.map((a, i) => ({
      userId: a.userId?._id,
      name: a.userId?.name || 'User',
      score: a.score,
      timeSpent: a.timeSpent,
      position: i + 1
    }));
    // Get previous attempts for current user
    let previousAttempts = [];
    let userId = null;
    try {
      const { userId: clerkId } = await auth();
      if (clerkId) {
        const user = await User.findOne({ clerkId });
        if (user) {
          userId = user._id;
          const attempts = await Attempt.find({ userId, testId }).sort({ completedAt: -1 }).limit(5);
          previousAttempts = attempts.map(a => ({
            score: a.score,
            maxScore: a.maxScore,
            timeSpent: a.timeSpent,
            completedAt: a.completedAt
          }));
        }
      }
    } catch (e) {}
    return NextResponse.json({
      test: {
        id: test._id,
        title: test.title,
        subject: test.subject,
        chapter: test.chapter,
        difficulty: test.difficulty || 'medium',
        timeLimit: test.timeLimit,
        totalQuestions: questions.length,
        description: test.description,
        attemptsCount: test.attemptsCount,
        rating: test.rating,
        isPublic: test.isPublic,
        creator: test.creator
      },
      questions: safeQuestions,
      leaderboard,
      previousAttempts
    });
  } catch (error) {
    console.error('Error fetching public test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 