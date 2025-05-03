import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Attempt, Question, Test, User } from '@/models';
import { auth } from '@clerk/nextjs/server';

export async function GET(req, { params }) {
  await connectDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { attemptId } = params;
  if (!attemptId) return NextResponse.json({ error: 'No attemptId provided' }, { status: 400 });

  // Find the attempt
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  // Check if the attempt belongs to the authenticated user
  const user = await User.findOne({ clerkId: userId });
  if (!user || !attempt.userId.equals(user._id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get test info
  const test = await Test.findById(attempt.testId);
  if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

  // Get all questions for the test
  const questions = await Question.find({ testId: test._id });

  // Build detailed question review
  const detailedQuestions = attempt.answers.map(ans => {
    const q = questions.find(q => q._id.toString() === ans.questionId.toString());
    if (!q) return null;
    const correctIndex = q.options.findIndex(opt => opt.isCorrect);
    return {
      id: q._id,
      text: q.text,
      userAnswer: ans.selectedOption,
      correctAnswer: correctIndex,
      options: q.options.map(opt => ({ text: opt.text, image: opt.image?.url || null })),
      explanation: q.explanation || '',
    };
  }).filter(Boolean);

  // Placeholder for leaderboard position (implement as needed)
  const leaderboardPosition = null;

  return NextResponse.json({
    success: true,
    test: {
      title: test.title,
      totalQuestions: test.attemptsCount || questions.length,
    },
    attempt: {
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.scorePercentage,
      timeSpent: attempt.timeSpent,
      rewards: { xp: attempt.xpPoints, coins: attempt.coins },
      leaderboardPosition,
      completedAt: attempt.completedAt,
      questions: detailedQuestions,
    }
  });
} 