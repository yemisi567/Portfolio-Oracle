"use client";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  TrendingUp,
  Target,
  Sparkles,
  Github,
  Zap,
  Mail,
  Flag,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import StructuredData from "./components/StructuredData";

export default function Home() {
  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
  });

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactForm.email,
          message: contactForm.message,
          type: "contact",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setContactForm({ email: "", message: "" });
        toast.success("Message sent successfully! We'll get back to you soon.");
      } else {
        toast.error(`Error: ${result.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500 via-yellow-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

          <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500 blur-sm"></div>

          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20"></div>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-6 py-4 mx-auto max-w-[90rem]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Portfolio Oracle
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.nav>

        <section className="relative px-6 py-20 mx-auto max-w-[90rem]">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-blue-300 rounded-full text-sm font-medium mb-8 border border-gray-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Project Discovery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              One Platform,
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                {" "}
                Endless Possibilities
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Everything you need to create, innovate, and scale your portfolio
              with free AI-powered project ideas tailored to your skills and
              career goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 flex items-center group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#features"
                className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
              >
                Explore Features
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 mx-auto max-w-[90rem]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              One Platform, Endless Possibilities
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, innovate, and scale with AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                color: "blue",
                title: "AI-Powered Ideas",
                description:
                  "GPT-4, Claude, and more. Get personalized project suggestions based on your skills and career goals.",
              },
              {
                icon: TrendingUp,
                color: "green",
                title: "Market Trends",
                description:
                  "Stay ahead with real-time insights into in-demand skills and trending technologies.",
              },
              {
                icon: Target,
                color: "orange",
                title: "Goal Tracking",
                description:
                  "Track your progress and connect with GitHub to showcase your work automatically.",
              },
              {
                icon: Code,
                color: "purple",
                title: "Tech Stack Guidance",
                description:
                  "Get recommendations for the best technologies to use for each project.",
              },
              {
                icon: Github,
                color: "red",
                title: "GitHub Integration",
                description:
                  "Seamlessly sync your projects and showcase your repositories.",
              },
              {
                icon: Flag,
                color: "gray",
                title: "Project Milestones",
                description:
                  "Break down projects into manageable milestones with progress tracking and completion detection.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gray-900/80 backdrop-blur-xl p-8 rounded-xl border border-gray-800/50 hover:border-${feature.color}-500/50 transition-all duration-300 hover:scale-105 group`}
              >
                <div
                  className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/30 transition-colors`}
                >
                  <feature.icon
                    className={`w-6 h-6 text-${feature.color}-400`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-6 py-20 mx-auto max-w-[90rem]"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are building amazing portfolios
              and advancing their careers with our free AI-powered platform.
            </p>
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center cursor-pointer relative z-10"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
          </div>
        </motion.section>

        <footer className="px-6 py-12 border-t border-gray-800 relative z-10">
          <div className="max-w-[90rem] mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Portfolio Oracle
                  </span>
                </div>
                <p className="text-gray-400">
                  AI-powered portfolio project ideas for developers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <button
                      onClick={() => {
                        const element = document.getElementById("features");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="hover:text-white transition-colors cursor-pointer block text-left"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/market-insights"
                      className="hover:text-white transition-colors cursor-pointer block"
                    >
                      Market Insights
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="hover:text-white transition-colors cursor-pointer block"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Support</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Portfolio Oracle. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
