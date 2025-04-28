import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    // Return only public information
    return NextResponse.json({
      success: true,
      user: {
        id: user.clerkId,
        name: user.name,
        role: user.role,
        xpPoints: user.xpPoints,
        level: user.level,
        rank,
        achievements: user.achievements,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        referralCount: user.referralCount
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