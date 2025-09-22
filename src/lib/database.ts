/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { Project, UserProfile, Milestone } from "./types";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export class DatabaseService {
  static get supabase() {
    return supabase;
  }

  static async createUserProfile(
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          skill_level: profile.skillLevel,
          primary_stack: profile.primaryStack,
          goals: profile.goals,
          interests: profile.interests,
          additional_skills: profile.additionalSkills,
          target_industry: profile.targetIndustry,
        })
        .select()
        .single();

      if (error) {
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("User profile created successfully:", data);
      return this.transformUserProfile(data);
    } catch (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return this.transformUserProfile(data);
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          skill_level: updates.skillLevel,
          primary_stack: updates.primaryStack,
          goals: updates.goals,
          interests: updates.interests,
          additional_skills: updates.additionalSkills,
          target_industry: updates.targetIndustry,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return this.transformUserProfile(data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }

  static async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project | null> {
    try {
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", project.userId)
        .single();

      if (userError || !userProfile) {
        console.error("User profile not found or access denied:", userError);
        throw new Error("User profile not found or access denied");
      }

      // Log the exact data being sent to Supabase
      const insertData = {
        user_id: project.userId,
        title: project.title,
        summary: project.summary,
        description: project.description || "",
        difficulty: project.difficulty,
        tech_stack: project.techStack,
        requirements: project.requirements,
        status: project.status,
        notes: project.notes,
        challenges: project.challenges,
        resources: project.resources,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating project:", error);
        throw error;
      }

      // Create milestones for the project using service role with user validation
      if (project.milestones.length > 0) {
        const createdMilestones = await this.createMilestonesWithValidation(
          data.id,
          project.milestones,
          project.userId
        );
        console.log("Milestones created:", createdMilestones.length);
      } else {
        console.log("No milestones to create");
      }

      const transformedProject = this.transformProject(data);
      console.log("Transformed project:", transformedProject.createdAt);

      return transformedProject;
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  }

  private static async getUserJWT(): Promise<string> {
    return process.env.SUPABASE_SERVICE_KEY!;
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (userError || !userProfile) {
        console.error("User profile not found or access denied:", userError);
        return [];
      }

      console.log("User profile verified:", userProfile.id);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching projects:", error);
        throw error;
      }

      const projectsWithMilestones = await Promise.all(
        data.map(async (projectData) => {
          const project = this.transformProject(projectData);

          const milestones = await this.getProjectMilestones(
            project.id,
            userId
          );
          project.milestones = milestones;

          return project;
        })
      );

      return projectsWithMilestones;
    } catch (error) {
      console.error("Error fetching user projects:", error);
      return [];
    }
  }

  private static async getProjectMilestones(
    projectId: string,
    userId: string
  ): Promise<Milestone[]> {
    try {
      const { data: projectCheck, error: projectError } = await supabase
        .from("projects")
        .select("id, user_id")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (projectError || !projectCheck) {
        console.error(
          "Project ownership verification failed for milestone fetch:",
          projectError
        );
        return [];
      }

      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase error fetching milestones:", error);
        return [];
      }

      return data.map((milestoneData) =>
        this.transformMilestone(milestoneData)
      );
    } catch (error) {
      console.error("Error fetching project milestones:", error);
      return [];
    }
  }

  static async getProject(
    projectId: string,
    userId: string
  ): Promise<Project | null> {
    try {
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (userError || !userProfile) {
        console.error("User profile not found or access denied:", userError);
        return null;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Supabase error fetching project:", error);
        return null;
      }

      if (!data) {
        console.error("Project not found or access denied");
        return null;
      }

      const project = this.transformProject(data);

      const milestones = await this.getProjectMilestones(projectId, userId);
      project.milestones = milestones;

      return project;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  }

  static async updateProject(
    projectId: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: updates.title,
          summary: updates.summary,
          description: updates.description,
          difficulty: updates.difficulty,
          tech_stack: updates.techStack,
          requirements: updates.requirements,
          status: updates.status,
          notes: updates.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return this.transformProject(data);
    } catch (error) {
      console.error("Error updating project:", error);
      return null;
    }
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }

  static async createMilestones(
    projectId: string,
    milestones: Omit<Milestone, "id">[]
  ): Promise<Milestone[]> {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .insert(
          milestones.map((milestone) => ({
            project_id: projectId,
            title: milestone.title,
            description: milestone.description,
            estimated_hours: milestone.estimatedHours,
            detection_hint: milestone.detectionHint,
            completed: milestone.completed,
            completed_at: milestone.completedAt,
          }))
        )
        .select();

      if (error) {
        console.error("Supabase error creating milestones:", error);
        throw error;
      }

      return data.map((milestoneData) =>
        this.transformMilestone(milestoneData)
      );
    } catch (error) {
      console.error("Error creating milestones:", error);
      return [];
    }
  }

  private static async createMilestonesWithValidation(
    projectId: string,
    milestones: Omit<Milestone, "id">[],
    userId: string
  ): Promise<Milestone[]> {
    try {
      const { data: projectCheck, error: projectError } = await supabase
        .from("projects")
        .select("id, user_id")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (projectError || !projectCheck) {
        console.error("Project ownership verification failed:", projectError);
        throw new Error("Project ownership verification failed");
      }

      const { data, error } = await supabase
        .from("milestones")
        .insert(
          milestones.map((milestone) => ({
            project_id: projectId,
            title: milestone.title,
            description: milestone.description,
            estimated_hours: milestone.estimatedHours,
            detection_hint: milestone.detectionHint,
            completed: milestone.completed,
            completed_at: milestone.completedAt,
          }))
        )
        .select();

      if (error) {
        console.error("Supabase error creating milestones:", error);
        throw error;
      }

      return data.map((milestoneData) =>
        this.transformMilestone(milestoneData)
      );
    } catch (error) {
      console.error("Error creating milestones:", error);
      return [];
    }
  }

  static async updateMilestone(
    milestoneId: string,
    updates: Partial<Milestone>
  ): Promise<Milestone | null> {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .update({
          title: updates.title,
          description: updates.description,
          estimated_hours: updates.estimatedHours,
          detection_hint: updates.detectionHint,
          completed: updates.completed,
          completed_at: updates.completedAt,
        })
        .eq("id", milestoneId)
        .select()
        .single();

      if (error) throw error;
      return this.transformMilestone(data);
    } catch (error) {
      console.error("Error updating milestone:", error);
      return null;
    }
  }

  private static transformUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      userId: data.user_id,
      skillLevel: data.skill_level,
      primaryStack: data.primary_stack,
      goals: data.goals || [],
      interests: data.interests || [],
      additionalSkills: data.additional_skills || "",
      targetIndustry: data.target_industry,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private static transformProject(data: any): Project {
    const transformed = {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      summary: data.summary,
      description: data.description || "",
      difficulty: data.difficulty,
      techStack: data.tech_stack || [],
      requirements: data.requirements || [],
      milestones: (data.milestones || []).map((milestoneData: any) =>
        this.transformMilestone(milestoneData)
      ),
      status: data.status,
      githubUrl: data.github_url,
      notes: data.notes,
      challenges: data.challenges || [],
      resources: data.resources || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    return transformed;
  }

  private static transformMilestone(data: any): Milestone {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      estimatedHours: data.estimated_hours,
      detectionHint: data.detection_hint,
      completed: data.completed || false,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };
  }
}
