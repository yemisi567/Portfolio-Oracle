"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionTimeout: number;
  timeUntilTimeout: number;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  resetSessionTimer: () => void;
  updateSessionTimeout: (minutes: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default session timeout: 60 minutes
const DEFAULT_SESSION_TIMEOUT = 60;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(DEFAULT_SESSION_TIMEOUT);
  const [timeUntilTimeout, setTimeUntilTimeout] = useState(sessionTimeout * 60);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Reset session timer on user activity
  const resetSessionTimer = useCallback(() => {
    setLastActivity(Date.now());
    setTimeUntilTimeout(sessionTimeout * 60);
  }, [sessionTimeout]);

  // Update session timeout duration
  const updateSessionTimeout = useCallback((minutes: number) => {
    setSessionTimeout(minutes);
    setTimeUntilTimeout(minutes * 60);
    localStorage.setItem("sessionTimeout", minutes.toString());
  }, []);

  // Handle session timeout
  const handleSessionTimeout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login?timeout=true");
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("sessionTimeout");
    } catch (error) {
      console.error("Error during timeout logout:", error);
    }
  }, [router]);

  // Set up session timeout timer
  useEffect(() => {
    if (!user) {
      if (timeoutId) {
        clearInterval(timeoutId);
        setTimeoutId(null);
      }
      return;
    }

    const savedTimeout = localStorage.getItem("sessionTimeout");
    if (savedTimeout) {
      const timeout = parseInt(savedTimeout);
      if (timeout > 0) {
        setSessionTimeout(timeout);
        setTimeUntilTimeout(timeout * 60);
      }
    }

    const savedLastActivity = localStorage.getItem("lastActivity");
    if (savedLastActivity) {
      const lastActivityTime = parseInt(savedLastActivity);
      const now = Date.now();
      const timeSinceLastActivity = Math.floor((now - lastActivityTime) / 1000);
      const remainingTime = Math.max(
        0,
        sessionTimeout * 60 - timeSinceLastActivity
      );

      if (remainingTime <= 0) {
        handleSessionTimeout();
        return;
      }

      setTimeUntilTimeout(remainingTime);
      setLastActivity(lastActivityTime);
    }

    const intervalId = setInterval(() => {
      setTimeUntilTimeout((prev) => {
        if (prev <= 1) {
          handleSessionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeoutId(intervalId);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sessionTimeout, handleSessionTimeout]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("lastActivity", lastActivity.toString());
    }
  }, [lastActivity, user]);

  useEffect(() => {
    if (!user) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "focus",
    ];

    const handleActivity = () => {
      resetSessionTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [user, resetSessionTimer]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name:
              session.user.user_metadata?.full_name ||
              `${session.user.user_metadata?.first_name || ""} ${session.user.user_metadata?.last_name || ""}`.trim(),
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        console.log("Setting user state:", session.user.email);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata?.full_name ||
            `${session.user.user_metadata?.first_name || ""} ${session.user.user_metadata?.last_name || ""}`.trim(),
        });

        resetSessionTimer();

        if (pendingRedirect) {
          // Show onboarding immediately for better perceived performance
          setPendingRedirect(false);
          router.replace("/onboarding");

          // Background check: if profile already exists, send user to dashboard
          (async () => {
            try {
              const response = await fetch("/api/user-profiles", {
                headers: {
                  "user-id": session.user.id,
                },
              });
              const result = await response.json();
              if (result.success && result.data) {
                router.replace("/dashboard");
              }
            } catch (error) {
              console.error("Error checking onboarding status:", error);
            }
          })();
        }
      } else {
        setUser(null);
        if (timeoutId) {
          clearInterval(timeoutId);
          setTimeoutId(null);
        }
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("sessionTimeout");
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pendingRedirect, router, resetSessionTimer, timeoutId]);

  const login = async (email: string, password: string) => {
    try {
      // Use client-side Supabase auth directly
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        throw new Error(error.message);
      }

      setPendingRedirect(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Clear timeout timer
      if (timeoutId) {
        clearInterval(timeoutId);
        setTimeoutId(null);
      }
      // Clear stored session data
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("sessionTimeout");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sessionTimeout,
    timeUntilTimeout,
    login,
    signup,
    logout,
    resetSessionTimer,
    updateSessionTimeout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
