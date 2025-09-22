"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "@/lib/hooks/useProjects";
import { useUpdateProjectStatus } from "@/lib/hooks/useProjectActions";
import CustomInput from "../components/CustomInput";
import CustomSelect from "../components/CustomSelect";
import SessionSettings from "../components/SessionSettings";
import {
  ExternalLink,
  CheckCircle,
  Clock,
  Code,
  Settings,
  LogOut,
  TrendingUp,
  AlertCircle,
  Timer,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { user, logout } = useAuth();
  const { data: projects } = useProjects();
  const updateProjectStatus = useUpdateProjectStatus();
  const [showSessionSettings, setShowSessionSettings] = useState(false);
  const [timeUntilTimeout, setTimeUntilTimeout] = useState(1800);

  // Helper function for project status updates
  const handleProjectStatusChange = (
    projectId: string,
    status: "planned" | "in-progress" | "completed"
  ) => {
    updateProjectStatus.mutate({
      projectId,
      status,
    });
  };

  // Add session timeout tracking
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        setTimeUntilTimeout((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalProjects = projects?.length || 0;
  const inProgressProjects =
    projects?.filter((p) => p.status === "in-progress").length || 0;
  const completedProjects =
    projects?.filter((p) => p.status === "completed").length || 0;

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "planned":
        return "Planned";
      default:
        return status;
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

        <div className="relative z-10 px-4 py-8 mx-auto max-w-[90rem]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-8"
          >
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || "Developer"}!
              </h1>
              <p className="text-gray-300 text-sm lg:text-base">
                Here&apos;s what&apos;s happening with your projects
              </p>

              <div className="mt-3 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/50">
                  <Timer className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-300">
                    Session: {Math.ceil(timeUntilTimeout / 60)}m{" "}
                    {timeUntilTimeout % 60}s
                  </span>
                </div>
                <button
                  onClick={() => setShowSessionSettings(true)}
                  className="flex items-center space-x-1 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-gray-600/50 transition-colors"
                  title="Session Settings"
                >
                  <Settings className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Settings</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-2 lg:gap-4">
              <Link
                href="/generate-project"
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all flex items-center space-x-2 text-sm lg:text-base"
              >
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New Project</span>
              </Link>
              <Link
                href="/market-insights"
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm lg:text-base"
              >
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Market Insights</span>
                <span className="sm:hidden">Insights</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm lg:text-base"
              >
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Logout</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {totalProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {inProgressProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {completedProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <CustomInput
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                icon="search"
                className="w-full"
              />
            </div>
            <CustomSelect
              options={[
                { value: "all", label: "All Status" },
                { value: "planned", label: "Planned" },
                { value: "in-progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ]}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              placeholder="Filter by status"
              className="w-full md:w-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex-1 mr-4">
                    {project.title}
                  </h3>
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    <span className="whitespace-nowrap">
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.summary}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {project.status === "completed"
                        ? 100
                        : project.status === "in-progress"
                          ? Math.round(
                              (project.milestones.filter((m) => m.completed)
                                .length /
                                project.milestones.length) *
                                100
                            )
                          : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          project.status === "completed"
                            ? 100
                            : project.status === "in-progress"
                              ? Math.round(
                                  (project.milestones.filter((m) => m.completed)
                                    .length /
                                    project.milestones.length) *
                                    100
                                )
                              : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md border border-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Quick Actions</span>
                    <div className="flex space-x-2">
                      {project.status !== "in-progress" && (
                        <button
                          onClick={() =>
                            handleProjectStatusChange(project.id, "in-progress")
                          }
                          disabled={updateProjectStatus.isPending}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                        >
                          Start
                        </button>
                      )}
                      {project.status !== "completed" && (
                        <button
                          onClick={() =>
                            handleProjectStatusChange(project.id, "completed")
                          }
                          disabled={updateProjectStatus.isPending}
                          className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-md hover:bg-green-500/30 transition-colors disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                      {project.status !== "not-started" && (
                        <button
                          onClick={() =>
                            handleProjectStatusChange(project.id, "planned")
                          }
                          disabled={updateProjectStatus.isPending}
                          className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-md hover:bg-gray-500/30 transition-colors disabled:opacity-50"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <SessionSettings
          isOpen={showSessionSettings}
          onClose={() => setShowSessionSettings(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
