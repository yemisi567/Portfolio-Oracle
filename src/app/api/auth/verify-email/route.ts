import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a verification token
    const verificationToken = crypto.randomUUID();
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/confirm-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const { data: users, error: findError } = await supabaseServer.auth.admin.listUsers();
    
    if (findError) {
      console.error('Error finding user:', findError);
      return NextResponse.json(
        { error: 'Failed to find user' },
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

    const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          verification_token: verificationToken,
          verification_sent_at: new Date().toISOString(),
        }
      }
    );

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return NextResponse.json(
        { error: 'Failed to generate verification token' },
        { status: 500 }
      );
    }
    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Verify Your Email - Portfolio Oracle",
        type: "email-verification",
        data: {
          verificationUrl,
          firstName: firstName || 'there',
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send verification email:", emailResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    } else {
      console.log("Verification email sent successfully");
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Verify email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 