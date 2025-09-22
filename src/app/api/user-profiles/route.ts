import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../lib/database';
import { UserProfile } from '../../../lib/types';

// Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userId, skillLevel, primaryStack, goals, interests, additionalSkills, targetIndustry } = body;

    if (!userId || !skillLevel || !primaryStack || !goals || !interests || !targetIndustry) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingProfile = await DatabaseService.getUserProfile(userId);

    let profile: UserProfile | null;

    if (existingProfile) {
      profile = await DatabaseService.updateUserProfile(userId, {
        skillLevel,
        primaryStack,
        goals,
        interests,
        additionalSkills,
        targetIndustry,
      });
    } else {
      profile = await DatabaseService.createUserProfile(userId, {
        skillLevel,
        primaryStack,
        goals,
        interests,
        additionalSkills,
        targetIndustry,
      });
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Failed to save user profile - Database tables may not exist. Please run the database schema in Supabase.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('User profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 401 }
      );
    }

    const profile = await DatabaseService.getUserProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
} 