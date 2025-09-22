"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useProject } from "@/lib/hooks/useProjects";
import {
  useUpdateMilestone,
  useUpdateProjectStatus,
} from "@/lib/hooks/useProjectActions";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Code,
  TrendingUp,
  BookOpen,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set()
  );

  const projectId = params.id as string;
  const { data: project, isLoading, error } = useProject(projectId);
  const updateMilestone = useUpdateMilestone();
  const updateProjectStatus = useUpdateProjectStatus();

  // Helper functions
  const handleMilestoneToggle = (milestoneId: string, completed: boolean) => {
    updateMilestone.mutate({
      projectId,
      milestoneId,
      completed,
    });
  };

  const handleProjectStatusChange = (
    status: "planned" | "in-progress" | "completed"
  ) => {
    updateProjectStatus.mutate({
      projectId,
      status,
    });
  };

  const toggleMilestoneExpansion = (milestoneId: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneId)) {
      newExpanded.delete(milestoneId);
    } else {
      newExpanded.add(milestoneId);
    }
    setExpandedMilestones(newExpanded);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black relative overflow-hidden">
          <div className="relative z-10 px-6 py-8 mx-auto max-w-[90rem]">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Loading</h2>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black relative overflow-hidden">
          <div className="relative z-10 px-6 py-8 mx-auto max-w-[90rem]">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Project Not Found
                </h2>
                <p className="text-gray-400 text-lg mb-6">
                  The project you&apos;re looking for doesn&apos;t exist or you
                  don&apos;t have access to it.
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all font-medium"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const completedMilestones = project.milestones.filter(
    (m) => m.completed
  ).length;
  const totalMilestones = project.milestones.length;
  const progress =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  const createdAt = new Date(project.createdAt).toLocaleDateString();
  const lastUpdated = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString()
    : "Never";

  // Use actual project data with fallbacks only if empty
  const projectWithExtras = project as typeof project & {
    challenges?: string[];
    resources?: Array<{ title: string; url: string; type: string }>;
    notes?: string[];
    liveUrl?: string;
  };

  const challenges =
    projectWithExtras.challenges && projectWithExtras.challenges.length > 0
      ? projectWithExtras.challenges
      : [
          "Technical complexity and learning curve",
          "Time management and project planning",
          "Integration with external services",
          "Performance optimization and scalability",
        ];

  const resources =
    projectWithExtras.resources && projectWithExtras.resources.length > 0
      ? projectWithExtras.resources
      : [
          {
            title: "Documentation",
            url: "#",
            type: "documentation",
          },
          {
            title: "Tutorial",
            url: "#",
            type: "tutorial",
          },
        ];

  const notes =
    projectWithExtras.notes && projectWithExtras.notes.length > 0
      ? projectWithExtras.notes
      : [
          "Focus on clean code and best practices",
          "Document your learning process",
          "Consider future scalability",
          "Test thoroughly before deployment",
        ];

  const liveUrl = projectWithExtras.liveUrl || "#";

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in-progress":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "planned":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "planned":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProjectStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "planned":
        return "Planned";
      default:
        return "Unknown";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "milestones", label: "Milestones", icon: TrendingUp },
    { id: "resources", label: "Resources", icon: ExternalLink },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500 via-yellow-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500 blur-sm"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20"></div>
        </div>

        <div className="relative z-10 px-4 py-8 mx-auto max-w-[90rem]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {liveUrl !== "#" && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full min-w-[150px] border text-sm font-medium ${getProjectStatusColor(
                    project.status
                  )}`}
                >
                  {getProjectStatusIcon(project.status)}
                  <span>{getProjectStatusText(project.status)}</span>
                </div>

                <div className="relative">
                  <select
                    value={project.status}
                    onChange={(e) =>
                      handleProjectStatusChange(
                        e.target.value as
                          | "planned"
                          | "in-progress"
                          | "completed"
                      )
                    }
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                    disabled={updateProjectStatus.isPending}
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Progress</p>
                  <p className="text-white font-semibold">{progress}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Difficulty</p>
                  <p className="text-white font-semibold capitalize">
                    {project.difficulty}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Started</p>
                  <p className="text-white font-semibold">{createdAt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Updated</p>
                  <p className="text-white font-semibold">{lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-white font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md border border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/50"
          >
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Challenges
                    </h3>
                    <ul className="space-y-2">
                      {challenges.map((challenge, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Notes
                    </h3>
                    <ul className="space-y-2">
                      {notes.map((note, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3 text-gray-300"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "milestones" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Project Milestones ({completedMilestones}/
                      {totalMilestones} completed)
                    </h3>
                    <div className="text-sm text-gray-400">
                      Click on milestones to mark as complete/incomplete
                    </div>
                  </div>

                  {project.milestones.map((milestone, index) => {
                    const isExpanded = expandedMilestones.has(milestone.id);
                    const isCompleted = milestone.completed;

                    return (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`p-4 bg-gray-800/50 rounded-lg border transition-all duration-200 ${
                          isCompleted
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Milestone Status Toggle */}
                          <button
                            onClick={() =>
                              handleMilestoneToggle(milestone.id, !isCompleted)
                            }
                            disabled={updateMilestone.isPending}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isCompleted
                                ? "bg-green-500/20 hover:bg-green-500/30"
                                : "bg-gray-500/20 hover:bg-gray-500/30"
                            } ${updateMilestone.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-medium mb-1 transition-colors ${
                                  isCompleted
                                    ? "text-green-400 line-through"
                                    : "text-white"
                                }`}
                              >
                                {milestone.title}
                              </h4>
                              <button
                                onClick={() =>
                                  toggleMilestoneExpansion(milestone.id)
                                }
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 space-y-3"
                              >
                                <p className="text-gray-300 text-sm">
                                  {milestone.description}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-gray-400">
                                      Estimated: {milestone.estimatedHours}h
                                    </span>
                                    {milestone.detectionHint && (
                                      <span className="text-blue-400">
                                        Hint: {milestone.detectionHint}
                                      </span>
                                    )}
                                  </div>

                                  {isCompleted &&
                                    (
                                      milestone as typeof milestone & {
                                        completedAt?: string;
                                      }
                                    ).completedAt && (
                                      <span className="text-green-400">
                                        Completed:{" "}
                                        {new Date(
                                          (
                                            milestone as typeof milestone & {
                                              completedAt?: string;
                                            }
                                          ).completedAt!
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === "resources" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </h4>
                        <p className="text-gray-400 text-sm capitalize">
                          {resource.type}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
