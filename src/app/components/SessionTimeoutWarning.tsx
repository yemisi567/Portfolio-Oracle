"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface SessionTimeoutWarningProps {
  warningThreshold?: number;
}

export default function SessionTimeoutWarning({
  warningThreshold = 5,
}: SessionTimeoutWarningProps) {
  const { timeUntilTimeout, resetSessionTimer, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const minutesRemaining = Math.ceil(timeUntilTimeout / 60);
    setShowWarning(
      minutesRemaining <= warningThreshold && minutesRemaining > 0
    );

    if (timeUntilTimeout <= 60 && timeUntilTimeout > 0) {
      setShowModal(true);
    }
  }, [timeUntilTimeout, warningThreshold]);

  const handleExtendSession = () => {
    resetSessionTimer();
    setShowModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowModal(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getWarningColor = () => {
    const minutesRemaining = Math.ceil(timeUntilTimeout / 60);
    if (minutesRemaining <= 2) return "text-red-500";
    if (minutesRemaining <= 5) return "text-yellow-500";
    return "text-blue-500";
  };

  if (!showWarning && !showModal) return null;

  return (
    <>
      {/* Banner warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-sm font-medium ${getWarningColor()} bg-gray-900 border-b border-gray-700`}
          >
            ⏰ Session expires in {formatTime(timeUntilTimeout)}.
            <button
              onClick={resetSessionTimer}
              className="ml-2 underline hover:no-underline"
            >
              Extend session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for critical timeout */}
      <AnimatePresence>
        {showModal && (
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
              <div className="text-center">
                <div className="text-red-400 text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Session Expiring Soon
                </h3>
                <p className="text-gray-300 mb-6">
                  Your session will expire in {formatTime(timeUntilTimeout)}.
                  Would you like to extend it or log out?
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={handleExtendSession}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Extend Session
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
