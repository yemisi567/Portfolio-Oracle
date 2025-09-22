import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate inputs
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const hashedToken = createHash("sha256").update(token).digest("hex");

    // Check if token exists and is valid
    const { data: tokenData, error: tokenError } = await supabaseServer
      .from("password_reset_tokens")
      .select("*")
      .eq("token", hashedToken)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);

    if (now > expiresAt) {
      await supabaseServer
        .from("password_reset_tokens")
        .update({ used: true })
        .eq("id", tokenData.id);

      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }
    const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
      tokenData.user_id,
      { password: password }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    const { error: markUsedError } = await supabaseServer
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    if (markUsedError) {
      console.error("Error marking token as used:", markUsedError);
    }
    const { error: signOutError } = await supabaseServer.auth.admin.signOut(tokenData.user_id);

    if (signOutError) {
      console.error("Error signing out user sessions:", signOutError);
    }

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
