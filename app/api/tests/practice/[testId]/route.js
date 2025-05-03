import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';
import Question from '@/models/Question';
import Attempt from '@/models/Attempt';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { testId } = await params;

    // First get all public tests
    const test = await Test.findById(testId)
      .select('title subject chapter description timeLimit rating attemptsCount createdAt isPublic creator')
      .populate({
        path: 'creator',
        model: User,
        select: 'name email'
      })

    // Get question count for this test
    const totalQuestions = await Question.countDocuments({ testId });

    // Insert totalQuestions into the test object
    const testObj = test?.toObject ? test.toObject() : test;
    if (testObj) testObj.totalQuestions = totalQuestions;

    // get the questions for the test   
    const questions = await Question.find({ testId });

    const transformedQuestions = questions.map(q => {
      // Find the index of the correct option
      const correctOption = q.options.findIndex(opt => opt.isCorrect);

      return {
        id: q._id.toString(),
        text: q.text,
        image: q.image || null,
        options: q.options.map(opt => ({
          text: opt.text,
          image: opt.image || null
        })),
        correctOption,
        explanation: q.explanation
      };
    });

    // Attach questions to the test object
    if (testObj) testObj.questions = transformedQuestions;

    const { userId } = await auth();
    if (!userId) {
      // handle unauthenticated
      return NextResponse.json({
        success: false,
        error: 'Unauthenticated'
      }, { status: 401 });
    }
    const user = await User.findOne({ clerkId: userId });
    // Fetch previous attempts for this test (last 5, any user)
    const previousAttemptsRaw = await Attempt.find({ 
        testId,
        userId: user._id
     })
      .sort({ completedAt: -1 })
      .limit(5);
      
    const previousAttempts = previousAttemptsRaw.map(a => ({
      score: a.score,
      maxScore: a.maxScore,
      timeSpent: a.timeSpent,
      completedAt: a.completedAt
    }));

    // Fetch leaderboard for this test
    const leaderboardRaw = await Attempt.aggregate([
      { $match: { testId: new mongoose.Types.ObjectId(testId) } },
      {
        $group: {
          _id: "$userId",
          xp: { $sum: "$xpPoints" },      // or use $max for best score
          coins: { $sum: "$coins" },
          bestScore: { $max: "$score" }
        }
      },
      { $sort: { xp: -1 } }, // or sort by coins, bestScore, etc.
      { $limit: 10 }
    ]);

    // Fetch user info for leaderboard
    const userIds = leaderboardRaw.map(entry => entry._id);
    const users = await User.find({ _id: { $in: userIds } }, "name profileImage");
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u; });

    const leaderboard = leaderboardRaw.map((entry, idx) => ({
      userId: entry._id.toString(),
      name: userMap[entry._id.toString()]?.name || "Unknown",
      xp: entry.xp,
      coins: entry.coins,
      position: idx + 1,
      avatar: userMap[entry._id.toString()]?.profileImage?.url || null
    }));

    return NextResponse.json({
      success: true,
      test: testObj,
      previousAttempts,
      leaderboard
    });

  } catch (error) {
    console.error('Error fetching public tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
} 