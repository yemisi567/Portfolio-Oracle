import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id: projectId } = await params;

    if (!status || !["planned", "in-progress", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'planned', 'in-progress', or 'completed'" },
        { status: 400 }
      );
    }

    // Update project status
    const { data, error } = await supabaseServer
      .from("projects")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project status:", error);
      return NextResponse.json(
        { error: "Failed to update project status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
