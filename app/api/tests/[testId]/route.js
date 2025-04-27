import { Test, User } from '@/models';
import { connectDB } from '@/lib/db';
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    // Get the test ID from the URL
    const { testId } = params;
    
    // Get the creator's Clerk ID from the query params
    const creatorId = req.nextUrl.searchParams.get('creatorId');
    
    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Get MongoDB user from Clerk ID
    const user = await User.findOne({ clerkId: creatorId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find and delete the test, ensuring it belongs to the user
    const test = await Test.findOneAndDelete({
      _id: testId,
      creator: user._id
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { error: 'Failed to delete test', details: error.message },
      { status: 500 }
    );
  }
} 