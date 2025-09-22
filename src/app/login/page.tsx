"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, X, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [, setRemainingTime] = useState<number>(0);
  const { login, isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check for existing lockout on component mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem("loginAttempts");
    const storedLockoutTime = localStorage.getItem("lockoutTime");

    if (storedAttempts) {
      const attempts = parseInt(storedAttempts);
      setLoginAttempts(attempts);

      if (storedLockoutTime) {
        const lockoutTimestamp = parseInt(storedLockoutTime);
        const now = Date.now();
        const lockoutDuration = 15 * 60 * 1000;

        if (now - lockoutTimestamp < lockoutDuration) {
          setIsLocked(true);
          setLockoutTime(lockoutTimestamp);
        } else {
          localStorage.removeItem("loginAttempts");
          localStorage.removeItem("lockoutTime");
          setLoginAttempts(0);
          setIsLocked(false);
          setLockoutTime(null);
        }
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.success(message);
    }

    const timeout = searchParams.get("timeout");
    if (timeout === "true") {
      toast.error("Your session has expired. Please log in again.", {
        duration: 6000,
        icon: "⏰",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil(
          (lockoutTime + 15 * 60 * 1000 - now) / 1000
        );

        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTime(null);
          setRemainingTime(0);
          setLoginAttempts(0);
          localStorage.removeItem("loginAttempts");
          localStorage.removeItem("lockoutTime");
          clearInterval(timer);
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated || isLoading) {
      return;
    }

    if (isLocked) {
      const remainingTime = Math.ceil(
        (lockoutTime! + 15 * 60 * 1000 - Date.now()) / 1000 / 60
      );
      toast.error(
        `Account is locked. Please wait ${remainingTime} minutes before trying again.`
      );
      return;
    }

    if (loginAttempts >= 5) {
      const lockoutTimestamp = Date.now();
      setIsLocked(true);
      setLockoutTime(lockoutTimestamp);
      localStorage.setItem("lockoutTime", lockoutTimestamp.toString());
      toast.error("Too many login attempts. Account locked for 15 minutes.");
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      } else if (formData.email.trim().length > 254) {
        newErrors.email = "Email address is too long";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 1) {
      newErrors.password = "Password cannot be empty";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      toast.success("Login successful! Welcome back.");
      setLoginAttempts(0);
      setIsLocked(false);
      setLockoutTime(null);
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockoutTime");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());

      if (newAttempts >= 5) {
        const lockoutTimestamp = Date.now();
        setIsLocked(true);
        setLockoutTime(lockoutTimestamp);
        localStorage.setItem("lockoutTime", lockoutTimestamp.toString());
        toast.error("Too many failed attempts. Account locked for 15 minutes.");
      } else {
        if (newAttempts >= 3) {
          toast.error(
            "Multiple failed attempts. Please check your credentials or reset your password."
          );
        } else {
          toast.error(errorMessage);
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-pink-500 to-transparent animate-pulse"></div>
      <div className="absolute top-0 left-3/4 w-1 h-48 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse delay-1000"></div>
      <div className="absolute top-0 left-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse delay-500"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-2">
                <Link
                  href="/signup"
                  className="px-4 py-2 text-white/70 hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
                  Sign in
                </button>
              </div>
              <Link
                href="/"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </Link>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-400 mr-2" />
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              </div>
              <p className="text-gray-400">
                Sign in to your Portfolio Oracle account
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white placeholder-gray-400 ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 pr-12 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white placeholder-gray-400 ${
                      errors.password ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoading ||
                  isAuthenticated ||
                  loginAttempts >= 5
                }
                className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  loginAttempts >= 3
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {isSubmitting
                  ? "Signing In..."
                  : isLoading
                    ? "Loading..."
                    : loginAttempts >= 5
                      ? "Too Many Attempts"
                      : "Sign In"}
              </button>

              {loginAttempts > 0 && (
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm ${
                      loginAttempts >= 3 ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {loginAttempts >= 5
                      ? "Account temporarily locked. Please wait before trying again."
                      : loginAttempts >= 3
                        ? `Failed attempts: ${loginAttempts}/5`
                        : `Failed attempts: ${loginAttempts}/5`}
                  </p>
                </div>
              )}
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <div className="mt-6 space-y-2 text-center">
              <Link
                href="/forgot-password"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Forgot your password?
              </Link>
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
