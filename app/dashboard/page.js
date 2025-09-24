"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasBeenLoggedIn = useRef(false);

  useEffect(() => {
    if (user) {
      hasBeenLoggedIn.current = true;
    }

    if (!loading && !user) {
      // If user was previously logged in (logout), go to home
      // If user was never logged in (direct access), go to login
      if (hasBeenLoggedIn.current) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Dashboard />;
}
