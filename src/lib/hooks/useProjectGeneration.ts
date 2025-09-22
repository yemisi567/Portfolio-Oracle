import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UserPreferences {
  skillLevel: string;
  primaryStack: string;
  goals: string[];
  interests: string[];
  additionalSkills: string;
  targetIndustry: string;
  projectContext?: string;
  experienceLevel: string;
  techStack: string[];
  specificSkills: string[];
  careerGoals: string[];
  industryInterests: string[];
  learningGoals: string[];
  targetRoles: string[];
  preferredCompanySize: string;
  remotePreference: string;
  salaryRange: string;
  locationPreference: string;
}

interface GeneratedProject {
  title: string;
  summary: string;
  difficulty: string;
  techStack: string[];
  requirements: string[];
  milestones: Array<{
    title: string;
    description: string;
    estimatedHours: number;
    detectionHint: string;
  }>;
}

export function useProjectGeneration() {
  return useMutation({
    mutationFn: async (userPreferences: UserPreferences): Promise<GeneratedProject> => {
      const response = await fetch("/api/projects/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPreferences }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to generate project");
      }
      
      return result.project;
    },
    onError: (error) => {
      console.error("Error generating project:", error);
      toast.error("Failed to generate project. Please try again.");
    },
  });
} 