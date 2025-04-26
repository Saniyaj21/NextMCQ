import { NextResponse } from "next/server";
import {connectDB} from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');
    
    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    const user = await User.findOne({ clerkId })
      .populate('referredBy', 'name email referralCode');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Update streak and level
      await user.updateStreak();
      await user.calculateLevel();
    } catch (error) {
      console.error('Error updating user stats:', error);
      // Continue with the request even if stats update fails
    }

    // Calculate user's rank using aggregation pipeline
    const userRankData = await User.aggregate([
      { $sort: { xpPoints: -1 } },
      {
        $group: {
          _id: null,
          rankings: {
            $push: {
              userId: '$_id',
              xpPoints: '$xpPoints'
            }
          }
        }
      },
      {
        $project: {
          rank: {
            $add: [
              { $indexOfArray: ['$rankings.userId', user._id] },
              1
            ]
          }
        }
      }
    ]);

    const rank = userRankData[0]?.rank || 1;

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        xpPoints: user.xpPoints,
        level: user.level,
        rank, // Add the calculated rank
        streak: {
          current: user.streak.current,
          longest: user.streak.longest,
          lastActive: user.streak.lastActive
        },
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referredBy: user.referredBy ? {
          name: user.referredBy.name,
          email: user.referredBy.email,
          referralCode: user.referredBy.referralCode
        } : null,
        achievements: user.achievements,
        isPremium: user.isPremium,
        lastActive: user.lastActive,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user profile',
      details: error.message 
    }, { status: 500 });
  }
}