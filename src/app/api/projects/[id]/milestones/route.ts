import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { milestoneId, completed } = await request.json();
    const { id: projectId } = await params;

    if (!milestoneId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: milestoneId and completed" },
        { status: 400 }
      );
    }

    // Update milestone completion status
    const { data, error } = await supabaseServer
      .from("milestones")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", milestoneId)
      .eq("project_id", projectId)
      .select()
      .single();

    if (error) {
      console.error("Error updating milestone:", error);
      return NextResponse.json(
        { error: "Failed to update milestone" },
        { status: 500 }
      );
    }

    // Check if all milestones are completed to update project status
    const { data: allMilestones, error: milestonesError } = await supabaseServer
      .from("milestones")
      .select("completed")
      .eq("project_id", projectId);

    if (milestonesError) {
      console.error("Error fetching milestones:", milestonesError);
    } else {
      const allCompleted = allMilestones.every((m) => m.completed);
      
      if (allCompleted) {
        // Update project status to completed
        await supabaseServer
          .from("projects")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", projectId);
      } else {
        // Update project status to in-progress if any milestone is completed
        const anyCompleted = allMilestones.some((m) => m.completed);
        if (anyCompleted) {
          await supabaseServer
            .from("projects")
            .update({
              status: "in-progress",
              updated_at: new Date().toISOString(),
            })
            .eq("id", projectId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
