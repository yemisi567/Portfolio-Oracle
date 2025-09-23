"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    skillLevel: "intermediate" as "beginner" | "intermediate" | "advanced",
    primaryStack: "frontend-development" as
      | "frontend-development"
      | "backend-development"
      | "full-stack-development"
      | "mobile-development"
      | "devops-cloud"
      | "data-science-ai"
      | "ui-ux-design"
      | "product-management"
      | "project-management"
      | "digital-marketing"
      | "cybersecurity"
      | "game-development"
      | "blockchain-development"
      | "quality-assurance"
      | "technical-writing"
      | "sales-engineering"
      | "customer-success"
      | "business-analytics",
    goals: ["portfolio"] as string[],
    interests: ["web-development"] as string[],
    additionalSkills: "",
    targetIndustry: "general",
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const totalSteps = 5;

  const skills = [
    // Smaller, curated list to reduce scrolling
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "Go",
    "React",
    "Next.js",
    "Angular",
    "Node.js",
    "Express.js",
    "Django",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Google Cloud",
    "React Native",
    "Flutter",
    "TensorFlow",
    "PyTorch",
    "Figma",
    "Git",
    "GraphQL",
  ];

  const experienceLevels = [
    {
      value: "beginner",
      label: "Beginner (0-1 years)",
      description: "Just starting my tech journey",
    },
    {
      value: "intermediate",
      label: "Intermediate (1-3 years)",
      description: "Some experience in the field",
    },
    {
      value: "advanced",
      label: "Advanced (3+ years)",
      description: "Experienced professional looking to level up",
    },
  ];

  const techStack = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "Data Science & AI",
    "DevOps & Cloud",
    "UI/UX Design",
    "Product Management",
  ];

  const interests = [
    // Career-oriented interests (max 10)
    "Software Engineering",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "DevOps",
    "Product Management",
    "UI/UX Design",
    "Mobile Development",
    "Cloud Engineering",
    "Data Engineering",
  ];

  const goals = [
    "Build Portfolio",
    "Land Job Offer",
    "Career Transition",
    "Start Freelancing",
    "Launch Startup",
  ];

  const handleSkillToggle = (skill: string) => {
    const currentSkills = formData.additionalSkills
      .split(", ")
      .filter((s) => s.trim());
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    setFormData({
      ...formData,
      additionalSkills: newSkills.join(", "),
    });
  };

  const handleTechStackToggle = (tech: string) => {
    // Map display names to database values
    const techMapping: Record<string, string> = {
      "frontend-development": "frontend-development",
      "backend-development": "backend-development",
      "full-stack-development": "full-stack-development",
      "mobile-development": "mobile-development",
      "devops-cloud": "devops-cloud",
      "data-science-ai": "data-science-ai",
      "ui-ux-design": "ui-ux-design",
      "product-management": "product-management",
      "project-management": "project-management",
      "digital-marketing": "digital-marketing",
      cybersecurity: "cybersecurity",
      "game-development": "game-development",
      "blockchain-development": "blockchain-development",
      "quality-assurance": "quality-assurance",
      "technical-writing": "technical-writing",
      "sales-engineering": "sales-engineering",
      "customer-success": "customer-success",
      "business-analytics": "business-analytics",
    };

    const dbValue = techMapping[tech] || "frontend-development";

    setFormData({
      ...formData,
      primaryStack: dbValue as
        | "frontend-development"
        | "backend-development"
        | "full-stack-development"
        | "mobile-development"
        | "devops-cloud"
        | "data-science-ai"
        | "ui-ux-design"
        | "product-management"
        | "project-management"
        | "digital-marketing"
        | "cybersecurity"
        | "game-development"
        | "blockchain-development"
        | "quality-assurance"
        | "technical-writing"
        | "sales-engineering"
        | "customer-success"
        | "business-analytics",
    });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    setFormData({
      ...formData,
      interests: newInterests,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleGoalToggle = (goal: string) => {
    const newGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];
    setFormData({
      ...formData,
      goals: newGoals,
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        userId: user.id,
        skillLevel: formData.skillLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
        primaryStack: formData.primaryStack,
        goals: formData.goals,
        interests: formData.interests,
        additionalSkills: formData.additionalSkills,
        targetIndustry: formData.targetIndustry,
      };

      const response = await fetch("/api/user-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          "Profile saved successfully! Redirecting to dashboard..."
        );
        router.push("/dashboard");
      } else {
        console.error("Failed to save profile:", result.error);
        toast.error(
          `Failed to save your preferences: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What are your skills?
              </h2>
              <p className="text-gray-300">
                Select the technologies you&apos;re familiar with
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.additionalSkills.split(", ").includes(skill)
                      ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What&apos;s your experience level?
              </h2>
              <p className="text-gray-300">
                This helps us tailor project recommendations
              </p>
            </div>
            <div className="space-y-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleInputChange("skillLevel", level.value)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    formData.skillLevel === level.value
                      ? "bg-green-500/20 border-green-500"
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
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What&apos;s your primary tech stack?
              </h2>
              <p className="text-gray-300">
                Choose the area you want to focus on
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {techStack.map((tech) => (
                <button
                  key={tech}
                  onClick={() =>
                    handleTechStackToggle(
                      tech.toLowerCase().replace(" ", "-") as
                        | "frontend"
                        | "backend"
                        | "fullstack"
                        | "mobile"
                        | "devops"
                        | "data"
                    )
                  }
                  className={`p-3 rounded-lg border transition-all ${
                    formData.primaryStack ===
                    tech.toLowerCase().replace(" ", "-")
                      ? "bg-purple-500/20 border-purple-500 text-purple-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What are your career goals?
              </h2>
              <p className="text-gray-300">Select what you want to achieve</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.goals.includes(goal)
                      ? "bg-orange-500/20 border-orange-500 text-orange-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What interests you?
              </h2>
              <p className="text-gray-300">
                Select multiple areas that excite you
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-pink-500/20 border-pink-500 text-pink-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500 via-yellow-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500 blur-sm"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20"></div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 pt-8 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Portfolio Oracle
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
