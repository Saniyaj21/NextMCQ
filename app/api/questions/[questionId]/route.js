import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import Test from '@/models/Test';
import { User } from '@/models';

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { questionId } = await params;
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Verify the question belongs to the specified test
    if (question.testId.toString() !== testId) {
      return NextResponse.json({ error: 'Question does not belong to this test' }, { status: 400 });
    }

    // Get MongoDB user from Clerk ID and verify test ownership
    const user = await User.findOne({ clerkId: userId });
    const test = await Test.findById(testId);
    
    if (!test || test.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete question
    await Question.findByIdAndDelete(questionId);

    // Update the test's timeLimit after deleting the question
    const questionCount = await Question.countDocuments({ testId });
    await Test.findByIdAndUpdate(testId, { timeLimit: questionCount });

    return NextResponse.json({ 
      success: true,
      message: 'Question deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await params;
    await connectDB();

    // Find question and populate test details
    const question = await Question.findById(questionId).populate('testId');
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Get MongoDB user from Clerk ID and verify test ownership
    const user = await User.findOne({ clerkId: userId });
    const test = await Test.findById(question.testId);
    
    if (!test || test.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true,
      question 
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { questionId } = await params;
    const data = await request.json();
    const { text, options, explanation, difficulty } = data;

    // Validate required fields
    if (!text || !options || !Array.isArray(options) || !difficulty) {
      return NextResponse.json({ error: 'Invalid question data' }, { status: 400 });
    }

    // Validate options
    if (options.length < 2 || options.length > 5 || !options.some(opt => opt.isCorrect)) {
      return NextResponse.json({ 
        error: 'Question must have between 2 and 5 options with one correct answer' 
      }, { status: 400 });
    }

    // Validate that only one option is marked as correct
    if (options.filter(opt => opt.isCorrect).length !== 1) {
      return NextResponse.json({ 
        error: 'Question must have exactly one correct answer' 
      }, { status: 400 });
    }

    // Find question
    const question = await Question.findById(questionId).populate('testId');
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Get MongoDB user from Clerk ID and verify test ownership
    const user = await User.findOne({ clerkId: userId });
    const test = await Test.findById(question.testId);
    
    if (!test || test.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { text, options, explanation, difficulty },
      { new: true }
    );

    return NextResponse.json({ 
      success: true,
      question: updatedQuestion 
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 