import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import { User } from '@/models';

// Get leaderboard data with sorting options
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sortBy') || 'xp'; // Default sort by XP
    const limit = parseInt(searchParams.get('limit') || '100'); // Default limit 100 users
    const category = searchParams.get('category'); // 'student' or 'teacher'
    
    // Define sort criteria based on parameter
    let sortCriteria = {};
    switch (sortBy) {
      case 'coins':
        sortCriteria = { coins: -1 };
        break;
      case 'level':
        sortCriteria = { level: -1, xpPoints: -1 };
        break;
      case 'xp':
      default:
        sortCriteria = { xpPoints: -1 };
        break;
    }

    // Build query with optional category filter
    const query = category ? { role: category } : {};

    // Get users sorted by criteria
    const users = await User.find(
      query,
      'name xpPoints coins level profileImage role' // Added role to selected fields
    )
    .sort(sortCriteria)
    .limit(limit);

    // Transform data and add ranks
    const leaderboardData = users.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      name: user.name,
      xpPoints: user.xpPoints,
      coins: user.coins,
      level: user.level,
      role: user.role,
      profileImage: user.profileImage?.url
    }));

    return NextResponse.json({
      success: true,
      data: leaderboardData
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}