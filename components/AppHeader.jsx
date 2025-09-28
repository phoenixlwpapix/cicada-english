"use client";

import { Sun, Moon, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("cicada-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(prefersDark);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("cicada-theme", isDark ? "dark" : "light");
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <header className="top-0 z-50 backdrop-blur-lg  border-b border-border shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="/cicada.png"
                alt="Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 hover:scale-110 transition-all duration-300 drop-shadow-lg"
              />
            </div>
            <Link href="/">
              <div className="cursor-pointer">
                <img
                  src="/banner-new.png"
                  alt="知了英语"
                  className="h-8 md:h-12 lg:h-16 py-1 hover:opacity-80 transition-opacity duration-300"
                />
                <p className="text-sm text-primary flex items-center justify-center gap-2">
                  AI阅读训练
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation and Theme Toggle */}
          {mounted && (
            <div className="flex items-center gap-4">
              {user && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors border-2 border-border shadow-sm hover:shadow-md">
                      {user.email.slice(0, 2).toUpperCase()}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>用户信息</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">用户名</label>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">邮箱</label>
                        <p>{user.email}</p>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        登出
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Auth Buttons */}
              {user ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant={pathname === "/dashboard" ? "default" : "outline"}
                >
                  我的成绩
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  size="sm"
                  className="text-primary"
                >
                  登录
                </Button>
              )}

              <button
                onClick={toggleTheme}
                className="relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring bg-gradient-to-r border-2 border-border shadow-sm hover:shadow-md transform hover:scale-105"
                style={{
                  background: isDark
                    ? "hsl(var(--muted))"
                    : "hsl(var(--secondary))",
                }}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <div
                  className={`relative w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center ${
                    isDark ? "translate-x-6" : "translate-x-1"
                  }`}
                >
                  <Sun
                    className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 ${
                      isDark
                        ? "opacity-0 rotate-180 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <Moon
                    className={`w-4 h-4 text-slate-700 absolute transition-all duration-300 ${
                      isDark
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-180 scale-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
