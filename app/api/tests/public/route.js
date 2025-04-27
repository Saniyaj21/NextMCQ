import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // First get all public tests
    const tests = await Test.find({ isPublic: true })
      .select('title subject description timeLimit chapter createdAt creator')
      .populate({
        path: 'creator',
        model: User,
        select: 'name email'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tests: tests.map(test => ({
        ...test.toObject(),
        creatorName: test.creator?.name || 'Unknown'
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