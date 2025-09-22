import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createHash, randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: users, error: userError } = await supabaseServer.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error finding user:", userError);
      return NextResponse.json(
        { message: "If an account with this email exists, you'll receive a password reset link." },
        { status: 200 }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { message: "If an account with this email exists, you'll receive a password reset link." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");
    
    // Set expiration time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store reset token in database
    const { error: tokenError } = await supabaseServer
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token: hashedToken,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (tokenError) {
      console.error("Error storing reset token:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate reset token" },
        { status: 500 }
      );
    }

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Reset Your Portfolio Oracle Password",
        type: "password-reset",
        data: {
          resetUrl,
          userName: user.user_metadata?.full_name || "User",
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send reset email:", emailResponse.status, errorText);
    } else {
      console.log("Reset email sent successfully");
    }

    return NextResponse.json(
      { message: "If an account with this email exists, you'll receive a password reset link." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
