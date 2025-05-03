import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Attempt, Question, Test, User } from '@/models';
import { auth } from '@clerk/nextjs/server';
import { model } from 'mongoose';

// Handles POST requests to create a new test attempt
export async function POST(request) {
    // Connect to the database
    await connectDB();

    // Parse request body for test attempt data
    const { testId, answers, timeSpent } = await request.json();

    // Get authenticated user ID from Clerk
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Find the test being attempted
    const test = await Test.findById(testId);
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    // Fetch all questions for the test
    const questions = await Question.find({ testId });
    if (!questions.length) return NextResponse.json({ error: 'No questions found for this test' }, { status: 400 });

    // Initialize score counter
    let score = 0;
    // Process each answer: check correctness and build processedAnswers array
    const processedAnswers = answers.map(ans => {
        // Find the corresponding question
        const q = questions.find(q => q._id.toString() === ans.questionId);
        if (!q) return { ...ans, isCorrect: false };
        // Find the index of the correct option
        const correctIndex = q.options.findIndex(opt => opt.isCorrect);
        // Check if user's selected option is correct
        const isCorrect = ans.selectedOption === correctIndex;
        if (isCorrect) score += 1;
        return { ...ans, isCorrect };
    });

    // Calculate max score and percentage
    const maxScore = questions.length;
    const scorePercentage = (score / maxScore) * 100;
    // Use test difficulty or default to 'medium'
    const difficulty = test.difficulty || 'medium';
    // Calculate XP and coins earned for this attempt
    let xpPoints = 0;
    let coins = 0;

    // Check if user has already attempted this test
    const existingAttempt = await Attempt.findOne({
        userId: user._id,
        testId
    });
    if (existingAttempt) {
        xpPoints = score * 1;
        coins = score * 1;
    } else {
        xpPoints = score * 5;
        coins = score * 5;
    }
    // add the coins and xpPoints to the user in user model
    await User.findByIdAndUpdate(user._id, {
        $inc: {
            xpPoints: xpPoints,
            coins: coins
        }
    });

    // Create a new Attempt document in the database
    const attempt = await Attempt.create({
        userId: user._id,
        testId,
        score,
        maxScore,
        answers: processedAnswers,
        timeSpent: timeSpent || 0,
        scorePercentage,
        difficulty,
        xpPoints,
        coins,
        totalQuestions: maxScore
    });

    // Return attempt summary to client
    return NextResponse.json({
        success: true,
        attemptId: attempt._id,
        score,
        maxScore,
        scorePercentage,
        xpPoints,
        coins
    });
} 