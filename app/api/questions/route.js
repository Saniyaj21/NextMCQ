import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import Test from '@/models/Test';
import { User } from '@/models';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { testIds, text, options, explanation, difficulty, userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!testIds || !Array.isArray(testIds) || testIds.length === 0) {
      return NextResponse.json({ error: 'At least one test ID is required' }, { status: 400 });
    }

    // Validate question data
    if (!text || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Invalid question data' }, { status: 400 });
    }

    // Validate options
    if (options.length < 2 || options.length > 5 || !options.some(opt => opt.isCorrect)) {
      return NextResponse.json({ 
        error: 'Question must have between 2 and 5 options with one correct answer' 
      }, { status: 400 });
    }

    // Get user from Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify all tests exist and user has permission
    const tests = await Test.find({ 
      _id: { $in: testIds },
      creator: user._id 
    });

    if (tests.length !== testIds.length) {
      return NextResponse.json({ 
        error: 'One or more tests not found or unauthorized' 
      }, { status: 404 });
    }

    // Create questions for all tests
    const questions = await Promise.all(
      testIds.map(testId =>
        Question.create({
          testId,
          text,
          options,
          explanation,
          difficulty,
        })
      )
    );

    // Award XP and coins to the user
    const xpReward = 10; // XP for creating a question
    const coinReward = 15; // Coins for creating a question
    
    await User.findByIdAndUpdate(user._id, {
      $inc: { 
        xpPoints: xpReward,
        coins: coinReward
      }
    });

    // Calculate new level after XP update
    const updatedUser = await User.findById(user._id);
    await updatedUser.calculateLevel();

    return NextResponse.json({ 
      success: true,
      questions,
      rewards: {
        xp: xpReward,
        coins: coinReward
      },
      message: `Question added to ${testIds.length} test${testIds.length > 1 ? 's' : ''}`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    await connectDB();

    if (testId) {
      const test = await Test.findById(testId);
      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }
      const user = await User.findOne({clerkId: userId})
      if (test.creator.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const questions = await Question.find({ testId }).sort({ createdAt: -1 });
      return NextResponse.json({ questions });
    }

    const userTests = await Test.find({ creatorId: userId });
    const testIds = userTests.map(test => test._id);
    const questions = await Question.find({ testId: { $in: testIds } }).sort({ createdAt: -1 });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}