import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      milestoneId,
      completed,
    }: {
      projectId: string;
      milestoneId: string;
      completed: boolean;
    }) => {
      const response = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          milestoneId,
          completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update milestone");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch project data
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success(
        data.data.completed
          ? "Milestone marked as completed!"
          : "Milestone marked as incomplete"
      );
    },
    onError: (error) => {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    },
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      status,
    }: {
      projectId: string;
      status: "planned" | "in-progress" | "completed";
    }) => {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch project data
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      const statusText = {
        planned: "Planned",
        "in-progress": "In Progress",
        completed: "Completed",
      }[variables.status];

      toast.success(`Project status updated to ${statusText}`);
    },
    onError: (error) => {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    },
  });
}
