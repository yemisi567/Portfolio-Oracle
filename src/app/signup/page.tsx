"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import CustomInput from "../components/CustomInput";
import router from "next/router";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) score++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "",
      "text-red-400",
      "text-orange-400",
      "text-yellow-400",
      "text-green-400",
      "text-green-300",
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName =
        "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName =
        "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

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
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (formData.password.length > 128) {
        newErrors.password = "Password must be less than 128 characters";
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
        newErrors.password =
          'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      toast.success("Account created successfully! You can now sign in.");
      router.push("/login");
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      toast.error(errorMessage);
      setErrors({
        general: errorMessage,
      });
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
                <button className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
                  Sign up
                </button>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white/70 hover:text-white rounded-full text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
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
                  Create Account
                </h1>
              </div>
              <p className="text-gray-400">
                Join Portfolio Oracle and start building amazing projects
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CustomInput
                    type="text"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    placeholder="John"
                    error={errors.firstName}
                    label="First Name"
                  />
                </div>
                <div>
                  <CustomInput
                    type="text"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    placeholder="Doe"
                    error={errors.lastName}
                    label="Last Name"
                  />
                </div>
              </div>

              <div>
                <CustomInput
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  placeholder="john@example.com"
                  error={errors.email}
                  label="Email Address"
                  icon="mail"
                />
              </div>

              <div>
                <CustomInput
                  type="password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  placeholder="••••••••"
                  error={errors.password}
                  label="Password"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}

                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={passwordStrength.color}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 1
                            ? "bg-red-500"
                            : passwordStrength.score === 2
                              ? "bg-orange-500"
                              : passwordStrength.score === 3
                                ? "bg-yellow-500"
                                : passwordStrength.score === 4
                                  ? "bg-green-500"
                                  : "bg-green-300"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div
                        className={`flex items-center ${formData.password.length >= 8 ? "text-green-400" : "text-gray-500"}`}
                      >
                        <span className="mr-2">✓</span> At least 8 characters
                      </div>
                      <div
                        className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                      >
                        <span className="mr-2">✓</span> One lowercase letter
                      </div>
                      <div
                        className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                      >
                        <span className="mr-2">✓</span> One uppercase letter
                      </div>
                      <div
                        className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                      >
                        <span className="mr-2">✓</span> One number
                      </div>
                      <div
                        className={`flex items-center ${/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                      >
                        <span className="mr-2">✓</span> One special character
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <CustomInput
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  label="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
