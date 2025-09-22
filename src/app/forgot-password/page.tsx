"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, X, Sparkles, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address";
      } else if (email.trim().length > 254) {
        newErrors.email = "Email address is too long";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(
          result.error || "Failed to send reset email. Please try again."
        );
        setErrors({ general: result.error || "Failed to send reset email" });
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
      setErrors({ general: "Failed to send reset email" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
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
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-green-400 mr-2" />
                  <h1 className="text-2xl font-bold text-white">
                    Check Your Email
                  </h1>
                </div>
                <p className="text-gray-400">
                  We&apos;ve sent a password reset link to{" "}
                  <strong className="text-white">{email}</strong>
                </p>
              </div>

              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  If an account with this email exists, you&apos;ll receive a
                  password reset link shortly.
                </p>
              </div>

              <div className="mb-6 space-y-3 text-sm text-gray-300">
                <p>Please check your email and:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Click the reset link in the email</li>
                  <li>Create a new password</li>
                  <li>Sign in with your new password</li>
                </ul>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                    setErrors({});
                  }}
                  className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Send Another Email
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

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
                  href="/login"
                  className="px-4 py-2 text-white/70 hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
                  Reset Password
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
                <h1 className="text-2xl font-bold text-white">
                  Reset Password
                </h1>
              </div>
              <p className="text-gray-400">
                Enter your email address and we&apos;ll send you a link to reset
                your password
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
                    value={email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white placeholder-gray-400 ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
