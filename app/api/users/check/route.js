import { User } from '@/models';
import { connectDB } from '@/lib/db';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const clerkId = req.nextUrl.searchParams.get('clerkId');
    
    if (!clerkId) {
      return NextResponse.json({ message: 'clerkId is required' }, { status: 400 });
    }

    console.log('Checking user with clerkId:', clerkId);
    const user = await User.findOne({ clerkId });
    console.log('User found:', !!user);
    return NextResponse.json(!!user);
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(false);
  }
} 