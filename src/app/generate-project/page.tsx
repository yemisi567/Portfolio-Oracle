/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { projectToRepoName } from "../../lib/utils";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Sparkles,
  Brain,
  CheckCircle,
  Save,
  RefreshCw,
  Github,
  ChevronRight,
} from "lucide-react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useProjectGeneration } from "@/lib/hooks/useProjectGeneration";
import { useCreateProject } from "@/lib/hooks/useProjects";

export default function GenerateProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedProject, setGeneratedProject] = useState<any>(null);
  const { user } = useAuth();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const projectGeneration = useProjectGeneration();
  const createProject = useCreateProject();
  const router = useRouter();

  const [userPreferences, setUserPreferences] = useState({
    skillLevel: "intermediate",
    primaryStack: "frontend-development",
    goals: ["portfolio"],
    interests: ["web-development"],
    additionalSkills: "",
    targetIndustry: "general",
    projectContext: "",
  });

  useEffect(() => {
    if (userProfile) {
      // Transform database data to match our form structure
      const transformedPreferences = {
        skillLevel: userProfile.skillLevel || "intermediate",
        primaryStack: userProfile.primaryStack || "frontend-development",
        goals: Array.isArray(userProfile.goals)
          ? userProfile.goals
          : userProfile.goals
            ? [userProfile.goals]
            : ["Build Portfolio"],
        interests: Array.isArray(userProfile.interests)
          ? userProfile.interests
          : userProfile.interests
            ? [userProfile.interests]
            : ["Web Development"],
        additionalSkills: userProfile.additionalSkills || "",
        targetIndustry: userProfile.targetIndustry || "general",
        projectContext: userProfile.projectContext || "",
      };

      setUserPreferences(transformedPreferences);
    }
  }, [userProfile]);

  const skillLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "0-1 years experience",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "1-3 years experience",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "3+ years experience",
    },
  ];

  const primaryStacks = [
    {
      value: "frontend-development",
      label: "Frontend Development",
      description: "React, Vue, Angular, etc.",
    },
    {
      value: "backend-development",
      label: "Backend Development",
      description: "Node.js, Python, Java, etc.",
    },
    {
      value: "full-stack-development",
      label: "Full Stack Development",
      description: "Both frontend and backend",
    },
    {
      value: "mobile-development",
      label: "Mobile Development",
      description: "React Native, Flutter, etc.",
    },
    {
      value: "ui-ux-design",
      label: "UI/UX Design",
      description: "User interface and experience design",
    },
    {
      value: "product-management",
      label: "Product Management",
      description: "Product strategy and roadmap",
    },
    {
      value: "data-science-ai",
      label: "Data Science & AI",
      description: "Python, ML, Analytics, etc.",
    },
    {
      value: "devops-cloud",
      label: "DevOps & Cloud",
      description: "Docker, Kubernetes, AWS, etc.",
    },
    {
      value: "digital-marketing",
      label: "Digital Marketing",
      description: "Growth, SEO, content marketing",
    },
    {
      value: "cybersecurity",
      label: "Cybersecurity",
      description: "Security, penetration testing",
    },
    {
      value: "game-development",
      label: "Game Development",
      description: "Unity, Unreal, game design",
    },
    {
      value: "blockchain-development",
      label: "Blockchain Development",
      description: "Web3, smart contracts, DeFi",
    },
  ];

  const goals = [
    {
      value: "Build Portfolio",
      label: "Build Portfolio",
      description: "Showcase my skills",
    },
    {
      value: "Land Job Offer",
      label: "Land Job Offer",
      description: "Target specific roles",
    },
    {
      value: "Career Transition",
      label: "Career Transition",
      description: "Switch to tech field",
    },
    {
      value: "Learn New Skills",
      label: "Learn New Skills",
      description: "Explore new technologies",
    },
    {
      value: "Start Freelancing",
      label: "Start Freelancing",
      description: "Client projects",
    },
    {
      value: "Launch Startup",
      label: "Launch Startup",
      description: "Business opportunity",
    },
    {
      value: "Contribute to Open Source",
      label: "Contribute to Open Source",
      description: "Give back to community",
    },
    {
      value: "Become Tech Leader",
      label: "Become Tech Leader",
      description: "Leadership role",
    },
    {
      value: "Speak at Conferences",
      label: "Speak at Conferences",
      description: "Share knowledge",
    },
    {
      value: "Write Technical Content",
      label: "Write Technical Content",
      description: "Blog, tutorials, docs",
    },
    {
      value: "Mentor Others",
      label: "Mentor Others",
      description: "Help others grow",
    },
    {
      value: "Network in Tech",
      label: "Network in Tech",
      description: "Build connections",
    },
    {
      value: "Earn Certifications",
      label: "Earn Certifications",
      description: "Professional credentials",
    },
    {
      value: "Build Personal Brand",
      label: "Build Personal Brand",
      description: "Online presence",
    },
    {
      value: "Create Side Project",
      label: "Create Side Project",
      description: "Personal projects",
    },
    {
      value: "Join Remote Team",
      label: "Join Remote Team",
      description: "Remote work",
    },
    {
      value: "Work at Big Tech",
      label: "Work at Big Tech",
      description: "FAANG companies",
    },
    {
      value: "Found Tech Company",
      label: "Found Tech Company",
      description: "Start my own company",
    },
  ];

  const interests = [
    // Development & Engineering
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile Apps", label: "Mobile Apps" },
    { value: "AI/ML", label: "AI/ML" },
    { value: "Data Science", label: "Data Science" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Cloud Computing", label: "Cloud Computing" },
    { value: "DevOps", label: "DevOps" },
    // Design & Creative
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Product Design", label: "Product Design" },
    { value: "Brand Design", label: "Brand Design" },
    { value: "Illustration", label: "Illustration" },
    { value: "Animation", label: "Animation" },
    { value: "3D Design", label: "3D Design" },
    // Business & Strategy
    { value: "Product Management", label: "Product Management" },
    { value: "Project Management", label: "Project Management" },
    { value: "Business Strategy", label: "Business Strategy" },
    { value: "Market Research", label: "Market Research" },
    { value: "Competitive Analysis", label: "Competitive Analysis" },
    // Marketing & Growth
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Growth Hacking", label: "Growth Hacking" },
    { value: "Content Marketing", label: "Content Marketing" },
    { value: "Social Media Marketing", label: "Social Media Marketing" },
    { value: "Email Marketing", label: "Email Marketing" },
    // Data & Analytics
    { value: "Business Intelligence", label: "Business Intelligence" },
    { value: "Data Analytics", label: "Data Analytics" },
    { value: "Market Analytics", label: "Market Analytics" },
    { value: "User Research", label: "User Research" },
    { value: "A/B Testing", label: "A/B Testing" },
    // Innovation & Emerging Tech
    { value: "Blockchain", label: "Blockchain" },
    { value: "Web3", label: "Web3" },
    { value: "AR/VR", label: "AR/VR" },
    { value: "IoT", label: "IoT" },
    { value: "Edge Computing", label: "Edge Computing" },
    { value: "Quantum Computing", label: "Quantum Computing" },
    // Industry Focus
    { value: "Fintech", label: "Fintech" },
    { value: "Healthtech", label: "Healthtech" },
    { value: "Edtech", label: "Edtech" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "SaaS", label: "SaaS" },
    { value: "Enterprise Software", label: "Enterprise Software" },
    // Community & Open Source
    { value: "Open Source", label: "Open Source" },
    { value: "Developer Advocacy", label: "Developer Advocacy" },
    { value: "Technical Writing", label: "Technical Writing" },
    { value: "Community Building", label: "Community Building" },
    { value: "Mentoring", label: "Mentoring" },
    // Startup & Entrepreneurship
    { value: "Startups", label: "Startups" },
    { value: "Venture Capital", label: "Venture Capital" },
    { value: "Angel Investing", label: "Angel Investing" },
    { value: "Entrepreneurship", label: "Entrepreneurship" },
    { value: "Innovation", label: "Innovation" },
    // Leadership & Management
    { value: "Team Leadership", label: "Team Leadership" },
    { value: "Technical Leadership", label: "Technical Leadership" },
    { value: "Agile Coaching", label: "Agile Coaching" },
    { value: "Change Management", label: "Change Management" },
    { value: "Strategic Planning", label: "Strategic Planning" },
  ];

  const handlePreferenceChange = (field: string, value: string | string[]) => {
    setUserPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = userPreferences.goals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter((g) => g !== goal)
      : [...currentGoals, goal];
    handlePreferenceChange("goals", newGoals);
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = userPreferences.interests;
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    handlePreferenceChange("interests", newInterests);
  };

  const generateProject = async () => {
    if (!user?.id) {
      toast.error("Please log in to generate projects");
      return;
    }

    try {
      const payload = {
        skillLevel: userPreferences.skillLevel,
        primaryStack: userPreferences.primaryStack,
        goals: userPreferences.goals,
        interests: userPreferences.interests,
        additionalSkills: userPreferences.additionalSkills,
        targetIndustry: userPreferences.targetIndustry,
        projectContext: userPreferences.projectContext,
        experienceLevel: userPreferences.skillLevel,
        techStack: [userPreferences.primaryStack],
        specificSkills: userPreferences.additionalSkills
          ? userPreferences.additionalSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        careerGoals: userPreferences.goals,
        industryInterests: userPreferences.interests,
        learningGoals: [],
        targetRoles: [],
        preferredCompanySize: "any",
        remotePreference: "flexible",
        salaryRange: "any",
        locationPreference: "any",
      };

      const project = await projectGeneration.mutateAsync(payload as any);
      setGeneratedProject(project);
      setCurrentStep(3);
      toast.success("Project generated successfully!");
    } catch (error) {
      console.error("Project generation error:", error);
    }
  };

  const addToProjects = async () => {
    if (!generatedProject || !user?.id) return;

    try {

      await createProject.mutateAsync({
        userId: user.id,
        title: generatedProject.title,
        summary: generatedProject.summary,
        description: generatedProject.summary,
        difficulty: generatedProject.difficulty,
        techStack: generatedProject.techStack,
        requirements: generatedProject.requirements,
        milestones: generatedProject.milestones.map(
          (milestone: {
            title: string;
            description: string;
            estimatedHours: number;
            detectionHint: string;
          }) => ({
            title: milestone.title,
            description: milestone.description,
            estimatedHours: milestone.estimatedHours,
            detectionHint: milestone.detectionHint,
            completed: false,
          })
        ),
        challenges: generatedProject.challenges || [],
        resources: generatedProject.resources || [],
        notes: generatedProject.notes || [],
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const regenerateProject = () => {
    setCurrentStep(2);
    setGeneratedProject(null);
    generateProject();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Project Preferences
              </h2>
              <p className="text-gray-300">
                Help us understand your goals to generate the perfect project
                idea
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                What&apos;s your skill level?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() =>
                      handlePreferenceChange("skillLevel", level.value)
                    }
                    className={`p-4 rounded-lg border transition-all text-left ${
                      userPreferences.skillLevel === level.value
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">
                      {level.label}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                What&apos;s your primary tech stack?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {primaryStacks.map((stack) => (
                  <button
                    key={stack.value}
                    onClick={() =>
                      handlePreferenceChange("primaryStack", stack.value)
                    }
                    className={`p-4 rounded-lg border transition-all text-left ${
                      userPreferences.primaryStack === stack.value
                        ? "bg-green-500/20 border-green-500"
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">
                      {stack.label}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {stack.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                What&apos;s your main goal?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => handleGoalToggle(goal.value)}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      userPreferences.goals.includes(goal.value)
                        ? "bg-purple-500/20 border-purple-500"
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">
                      {goal.label}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {goal.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                What interests you? (Select multiple)
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.value}
                    onClick={() => handleInterestToggle(interest.value)}
                    className={`p-3 rounded-lg border transition-all ${
                      userPreferences.interests.includes(interest.value)
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Additional Skills (Optional)
              </h3>
              <textarea
                value={userPreferences.additionalSkills}
                onChange={(e) =>
                  handlePreferenceChange("additionalSkills", e.target.value)
                }
                placeholder="e.g., React, TypeScript, Node.js, Python, AWS..."
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                rows={3}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Project Context (Optional)
              </h3>
              <textarea
                value={userPreferences.projectContext || ""}
                onChange={(e) =>
                  handlePreferenceChange("projectContext", e.target.value)
                }
                placeholder="e.g., I want to build something for my portfolio that shows I can work with real APIs... or I'm applying to startups and need something that demonstrates rapid prototyping..."
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Generating Your Project Idea
            </h2>
            <p className="text-gray-300 mb-8">
              Our AI is analyzing your preferences and current market trends...
            </p>

            {(projectGeneration as unknown as { status?: string }).status ===
              "pending" && (
              <div className="space-y-4">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-blue-400">
                  Creating the perfect project for you...
                </p>
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {generatedProject && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Your Project Idea
                  </h2>
                  <p className="text-gray-300">
                    Here&apos;s a personalized project idea based on your
                    preferences
                  </p>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 lg:p-8 border border-gray-800/50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 break-words">
                        {generatedProject.title}
                      </h3>
                      <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                        {generatedProject.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm">
                        <span className="text-blue-400 capitalize">
                          {generatedProject.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium text-sm">
                        Suggested Repository Name:
                      </span>
                    </div>
                    <code className="text-blue-300 font-mono text-sm block mb-1">
                      {projectToRepoName(generatedProject.title)}
                    </code>
                    <p className="text-blue-300/70 text-xs">
                      Create a GitHub repository with this exact name for
                      auto-detection
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-base lg:text-lg font-semibold text-white mb-3">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedProject.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-800 text-gray-300 text-xs lg:text-sm rounded-md border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-base lg:text-lg font-semibold text-white mb-3">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {generatedProject.requirements.map(
                        (req: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3 text-gray-300 text-sm lg:text-base"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-base lg:text-lg font-semibold text-white mb-3">
                      Milestones
                    </h4>
                    <div className="space-y-3">
                      {generatedProject.milestones.map((milestone: any) => (
                        <div
                          key={milestone.id}
                          className="p-3 lg:p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-white text-sm lg:text-base">
                              {milestone.title}
                            </h5>
                            <span className="text-gray-400 text-xs lg:text-sm bg-gray-700/50 px-2 py-1 rounded-full">
                              {milestone.estimatedHours}h
                            </span>
                          </div>
                          <p className="text-gray-300 text-xs lg:text-sm mb-2 leading-relaxed">
                            {milestone.description}
                          </p>
                          <p className="text-blue-400 text-xs">
                            {milestone.detectionHint}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={addToProjects}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add to My Projects</span>
                    </button>
                    <button
                      onClick={regenerateProject}
                      className="flex-1 bg-gray-800 text-white py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Generate Another</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500 via-yellow-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500 blur-sm"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20"></div>
        </div>

        <div className="relative z-10 px-4 py-8 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>

          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Step {currentStep} of 3</span>
              <span className="text-white font-medium">
                {currentStep === 1
                  ? "Preferences"
                  : currentStep === 2
                    ? "Generating"
                    : "Complete"}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Loading Your Preferences
                  </h3>
                  <p className="text-gray-300">
                    Loading your onboarding preferences...
                  </p>
                </div>
              </div>
            ) : (
              renderStep()
            )}

            {currentStep === 1 && !isLoadingProfile && (
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() => {
                    setCurrentStep(2);
                    generateProject();
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
                >
                  <span>Generate Project</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
