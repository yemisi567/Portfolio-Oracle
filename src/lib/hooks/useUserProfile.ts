import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthContext";

interface UserProfile {
  id: string;
  userId: string;
  skillLevel: string;
  primaryStack: string;
  goals: string[];
  interests: string[];
  additionalSkills: string;
  targetIndustry: string;
  projectContext?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const response = await fetch("/api/user-profiles", {
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
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
} 