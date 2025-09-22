"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";

interface SessionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMEOUT_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 480, label: "8 hours" },
];

export default function SessionSettings({
  isOpen,
  onClose,
}: SessionSettingsProps) {
  const { sessionTimeout, timeUntilTimeout, updateSessionTimeout } = useAuth();
  const [selectedTimeout, setSelectedTimeout] = useState(sessionTimeout);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      updateSessionTimeout(selectedTimeout);
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClose();
    } catch (error) {
      console.error("Error updating session timeout:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Session Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Current session info */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-300 mb-2">Current Session</div>
          <div className="text-white font-medium">
            Timeout: {sessionTimeout} minutes
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Expires in: {formatTimeRemaining(timeUntilTimeout)}
          </div>
        </div>

        {/* Timeout selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Session Timeout Duration
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIMEOUT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedTimeout(option.value)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedTimeout === option.value
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="mb-6 p-3 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg">
          <div className="text-yellow-400 text-sm">
            <strong>Security Note:</strong> Shorter timeouts provide better
            security by automatically logging out inactive users.
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating || selectedTimeout === sessionTimeout}
            className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
              isUpdating || selectedTimeout === sessionTimeout
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
