import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    // Find the user by email
    const { data: users, error: findError } = await supabaseServer.auth.admin.listUsers();
    
    if (findError) {
      console.error('Error finding user:', findError);
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the verification token matches
    const storedToken = user.user_metadata?.verification_token;
    const verificationSentAt = user.user_metadata?.verification_sent_at;

    if (!storedToken || storedToken !== token) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired (24 hours)
    if (verificationSentAt) {
      const sentAt = new Date(verificationSentAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        return NextResponse.json(
          { error: 'Verification link has expired' },
          { status: 400 }
        );
      }
    }

    // Update user to confirmed
    const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          verification_token: null, // Clear the token
        }
      }
    );

    if (updateError) {
      console.error('Error confirming user:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm email' },
        { status: 500 }
      );
    }

    // Redirect to login page with success message
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login?message=Email verified successfully! You can now sign in.`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Confirm email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 