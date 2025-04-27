import { Test, User } from '@/models';
import { connectDB } from '@/lib/db';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    // First get the MongoDB user from Clerk ID
    const user = await User.findOne({ clerkId: data.creatorId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create new test with MongoDB user ID
    const newTest = await Test.create({
      title: data.title,
      subject: data.subject,
      chapter: data.chapter,
      description: data.description,
      creator: user._id, // Use MongoDB user ID
      timeLimit: data.timeLimit || 60,
      isPublic: data.isPublic || false
    });

    return NextResponse.json({ 
      success: true,
      test: newTest
    });

  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const creatorId = req.nextUrl.searchParams.get('creatorId');
    const isPublic = req.nextUrl.searchParams.get('isPublic');
    
    let query = {};
    if (creatorId) {
      // First get MongoDB user ID from Clerk ID
      const user = await User.findOne({ clerkId: creatorId });
      if (user) {
        query.creator = user._id;
      }
    }
    if (isPublic !== null) {
      query.isPublic = isPublic === 'true';
    }

    const tests = await Test.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ 
      success: true,
      tests
    });

  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests', details: error.message },
      { status: 500 }
    );
  }
} 