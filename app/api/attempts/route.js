import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Attempt from '@/models/Attempt';
import Test from '@/models/Test';
import Question from '@/models/Question';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { userId, testId, answers, timeSpent } = await request.json();
    if (!userId || !testId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch test and questions
    const test = await Test.findById(testId);
    if (!test || !test.isPublic) {
      return NextResponse.json({ error: 'Test not found or not public' }, { status: 404 });
    }
    const questions = await Question.find({ testId });
    if (!questions.length) {
      return NextResponse.json({ error: 'No questions found for this test' }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const maxScore = questions.length;
    const answerMap = {};
    questions.forEach(q => {
      answerMap[q._id.toString()] = q;
    });
    const attemptAnswers = answers.map(ans => {
      const q = answerMap[ans.questionId];
      const correctIndex = q.options.findIndex(opt => opt.isCorrect);
      const isCorrect = ans.selectedOption === correctIndex;
      if (isCorrect) score++;
      return {
        questionId: q._id,
        selectedOption: ans.selectedOption,
        isCorrect
      };
    });
    const scorePercentage = Math.round((score / maxScore) * 100);

    const user = await User.findOne({
        clerkId: userId
    })
    // Save attempt
    const attempt = await Attempt.create({
      userId: user._id,
      testId,
      score,
      maxScore,
      answers: attemptAnswers,
      timeSpent,
      scorePercentage,
      difficulty: test.difficulty || 'medium',
      totalQuestions: maxScore
    });

    // Update test attempts count
    await Test.findByIdAndUpdate(testId, { $inc: { attemptsCount: 1 } });

    // Award XP and coins (example: 5 per correct answer)
    const xp = score * 5;
    const coins = score * 5;
    await User.findByIdAndUpdate(user._id, { $inc: { xpPoints: xp, coins: coins } });

    // Leaderboard position (rank by score desc, timeSpent asc)
    const allAttempts = await Attempt.find({ testId }).sort({ score: -1, timeSpent: 1 });
    const leaderboardPosition = allAttempts.findIndex(a => a._id.equals(attempt._id)) + 1;

    return NextResponse.json({
      attemptId: attempt._id,
      score,
      maxScore,
      rewards: { xp, coins },
      leaderboardPosition
    });
  } catch (error) {
    console.error('Error submitting attempt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 