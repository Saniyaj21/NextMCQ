import { User } from '@/models';
import { connectDB } from '@/lib/db';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    console.log('Creating user with data:', data);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: data.email },
        { clerkId: data.clerkId }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Check referral code if provided
    let referredBy = null;
    if (data.inviteCode) {
      const referrer = await User.findOne({ referralCode: data.inviteCode });
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
      referredBy = referrer._id;

      // Create new user first so we have their ID
      let newUser = await User.create({
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        role: data.role,
        coins: 700, // Extra 200 coins for being referred
        xpPoints: 0,
        level: 1,
        referredBy,
        
      });

      // Update referrer after new user is created
      await User.findByIdAndUpdate(referrer._id, {
        $inc: { 
          referralCount: 1,
          coins: 300
        },
        $push: {
          referralHistory: {
            user: newUser._id,
            joinedAt: new Date()
          }
        }
      });

      return NextResponse.json({ 
        success: true,
        user: newUser
      });

    } else {
      // Create new user without referral
      const newUser = await User.create({
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        role: data.role,
        coins: 500,
        xpPoints: 0,
        level: 1
      });

      return NextResponse.json({ 
        success: true,
        user: newUser
      });
    }

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
} 