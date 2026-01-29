"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/quiz-data";

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
  const previousUserIdRef = useRef(null);

  // Get queryClient from context (may be null during initial render)
  let queryClient = null;
  try {
    queryClient = useQueryClient();
  } catch (e) {
    // QueryClientProvider not yet mounted
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      previousUserIdRef.current = currentUser?.id ?? null;
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      const previousUserId = previousUserIdRef.current;
      const currentUserId = currentUser?.id ?? null;

      // Clear cache when user changes (logout or switch account)
      if (previousUserId !== currentUserId && queryClient) {
        // Clear all queries to prevent data leakage between users
        queryClient.clear();
      }

      setUser(currentUser);
      previousUserIdRef.current = currentUserId;
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Query for user profile
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: getUserProfile,
    enabled: !!user,
  });

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
    // Clear all cached queries before signing out
    if (queryClient) {
      queryClient.clear();
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    userProfile,
    loading,
    profile,
    profileLoading,
    refetchProfile,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

