import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';
import Question from '@/models/Question';

export async function GET() {
  try {
    await connectDB();

    // First get all public tests
    const tests = await Test.find({ isPublic: true })
      .select('title subject description timeLimit chapter createdAt creator rating attemptsCount')
      .populate({
        path: 'creator',
        model: User,
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    // Get question counts for each test
    const questionCounts = await Question.aggregate([
      {
        $match: {
          testId: { $in: tests.map(test => test._id) }
        }
      },
      {
        $group: {
          _id: '$testId',
          questionCount: { $sum: 1 }
        }
      }
    ]);

    // Create a map of test ID to question count
    const questionCountMap = new Map(
      questionCounts.map(item => [item._id.toString(), item.questionCount])
    );

    // Filter tests to only include those with at least 5 questions
    const filteredTests = tests.filter(test => {
      const count = questionCountMap.get(test._id.toString()) || 0;
      return count >= 5;
    });

    return NextResponse.json({
      success: true,
      tests: filteredTests.map(test => ({
        ...test.toObject(),
        creatorName: test.creator?.name || 'Unknown',
        questionCount: questionCountMap.get(test._id.toString()) || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching public tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
} 