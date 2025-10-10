"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Helper function to decode JWT payload
const decodeJwtPayload = (token) => {
  try {
    // JWT is base64url encoded, convert to base64
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Fetch user profile if user exists
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      // Fetch user profile if user exists
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile including avatar
  const fetchUserProfile = async (userId) => {
    try {
      console.log("Fetching user profile for userId:", userId);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error("Session error in fetchUserProfile:", sessionError);
        setUserProfile({ avatarUrl: "/avatars/monkey.png" });
        return;
      }

      // Check if token is expired and refresh if needed
      const tokenPayload = decodeJwtPayload(session.access_token);
      if (tokenPayload) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp < currentTime) {
          console.log(
            "Token expired in fetchUserProfile, attempting refresh..."
          );
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshError || !refreshData.session) {
            console.error(
              "Token refresh failed in fetchUserProfile:",
              refreshError
            );
            setUserProfile({ avatarUrl: "/avatars/monkey.png" });
            return;
          }
          session = refreshData.session;
        }
      } else {
        console.error("Failed to decode token in fetchUserProfile");
        setUserProfile({ avatarUrl: "/avatars/monkey.png" });
        return;
      }

      const response = await fetch(`/api/avatar`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      console.log("Avatar API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Avatar data received:", data);
        setUserProfile({ avatarUrl: data.avatarUrl });
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to fetch avatar, status:",
          response.status,
          "response:",
          errorText
        );
        // Set default avatar on error
        setUserProfile({ avatarUrl: "/avatars/monkey.png" });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Set default avatar on error
      setUserProfile({ avatarUrl: "/avatars/monkey.png" });
    }
  };

  // Update user avatar
  const updateAvatar = async (avatarUrl) => {
    if (!user) return { error: "User not authenticated" };

    try {
      console.log("Updating avatar for user:", user.id, "to:", avatarUrl);

      // Ensure we have a fresh session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return { error: "Session expired. Please refresh the page." };
      }

      if (!session?.access_token) {
        console.error("No access token available");
        return { error: "Authentication expired. Please refresh the page." };
      }

      // Check if token is expired and refresh if needed
      const tokenPayload = decodeJwtPayload(session.access_token);
      if (tokenPayload) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp < currentTime) {
          console.log("Token expired, attempting refresh...");
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshError || !refreshData.session) {
            console.error("Token refresh failed:", refreshError);
            return { error: "Session expired. Please refresh the page." };
          }
          // Use the refreshed session
          session = refreshData.session;
        }
      } else {
        console.error("Failed to decode token payload");
        return { error: "Invalid session. Please refresh the page." };
      }

      console.log("Using valid session token");
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          avatarUrl,
        }),
      });

      console.log("Update avatar API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Avatar update successful:", data);
        setUserProfile({ avatarUrl });
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to update avatar, status:",
          response.status,
          "response:",
          errorText
        );

        // Try to parse as JSON, fallback to text
        try {
          const errorData = JSON.parse(errorText);
          return { error: errorData.error || "Failed to update avatar" };
        } catch {
          return { error: `Failed to update avatar: ${errorText}` };
        }
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      return { error: `Failed to update avatar: ${error.message}` };
    }
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
