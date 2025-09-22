import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

interface Project {
  id: string;
  userId: string;
  title: string;
  summary: string;
  description: string;
  difficulty: string;
  techStack: string[];
  requirements: string[];
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    detectionHint: string;
    completed: boolean;
  }>;
  status: "not-started" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectData {
  userId: string;
  title: string;
  summary: string;
  description: string;
  difficulty: string;
  techStack: string[];
  requirements: string[];
  milestones: Array<{
    title: string;
    description: string;
    estimatedHours: number;
    detectionHint: string;
  }>;
  challenges?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  notes?: string[];
}

export function useProjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async (): Promise<Project[]> => {
      if (!user?.id) return [];

      const response = await fetch("/api/projects", {
        headers: {
          "user-id": user.id,
        },
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return [];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create project");
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
      toast.success("Project created successfully!");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: Partial<Project> }) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update project");
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });
} 

export function useProject(projectId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["project", projectId, user?.id],
    queryFn: async (): Promise<Project | null> => {
      if (!user?.id || !projectId) return null;

      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          "user-id": user.id,
        },
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    },
    enabled: !!user?.id && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 