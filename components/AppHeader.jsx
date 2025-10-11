"use client";

import { Sun, Moon, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserAvatar } from "@/lib/quiz-data";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const { user, signOut, profile, refetchProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleAvatarChange = async (avatarUrl) => {
    try {
      await updateUserAvatar(avatarUrl);
      await refetchProfile();
      setShowAvatarSelector(false);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
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
            <div className="relative hidden md:block">
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
                  className="h-10 sm:h-8 md:h-12 lg:h-16 py-1 hover:opacity-80 transition-opacity duration-300"
                />
                <p className="text-xs sm:text-sm text-primary flex items-center justify-center gap-2">
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
                    <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-sm hover:shadow-md transition-all hover:scale-105">
                      <img
                        src={profile?.avatar_url || "/cicada.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>用户信息</DialogTitle>
                      <DialogDescription>
                        查看和管理您的账户信息
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-center">
                      <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={profile?.avatar_url || "/cicada.png"}
                            alt="Avatar"
                            className="w-18 h-18 rounded-full border-2 border-border"
                          />
                          <Button
                            onClick={() => setShowAvatarSelector(true)}
                            variant="outline"
                            size="sm"
                          >
                            更换头像
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">用户名</label>
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
              {/* Avatar Selector Dialog */}
              <Dialog
                open={showAvatarSelector}
                onOpenChange={setShowAvatarSelector}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>选择头像</DialogTitle>
                    <DialogDescription>选择一个新的头像图标</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-4 gap-4 py-4">
                    {Array.from({ length: 16 }, (_, i) => {
                      const iconNumber = i + 1;
                      const iconUrl = `${
                        process.env.NEXT_PUBLIC_SUPABASE_URL
                      }/storage/v1/object/public/avatars/icon${iconNumber
                        .toString()
                        .padStart(2, "0")}.png`;
                      return (
                        <button
                          key={iconNumber}
                          onClick={() => handleAvatarChange(iconUrl)}
                          className="w-16 h-16 rounded-full border-2 border-border hover:border-primary transition-colors overflow-hidden"
                        >
                          <img
                            src={iconUrl}
                            alt={`Avatar ${iconNumber}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
              {/* Auth Buttons */}
              {user ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant={pathname === "/dashboard" ? "default" : "outline"}
                  className="px-2 sm:px-4"
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
              {/* Mobile: Icon Button Only */}
              <button
                onClick={toggleTheme}
                className="md:hidden w-8 h-8 rounded-full flex items-center justify-center border-2 border-border shadow-sm hover:shadow-md transition-all hover:scale-105"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
              {/* Desktop: Full Toggle Switch */}
              <button
                onClick={toggleTheme}
                className="hidden md:block relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring bg-gradient-to-r border-2 border-border shadow-sm hover:shadow-md transform hover:scale-105"
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
