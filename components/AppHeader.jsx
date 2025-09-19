"use client";

import { Sparkles, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppHeader() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cicada-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('cicada-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="/cicada1.png"
                alt="Logo"
                className="w-12 h-12 hover:scale-110 transition-all duration-300 drop-shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                知了英语 Cicada English
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                AI驱动的英语学习平台
              </p>
            </div>
          </div>
          
          {/* Simple Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r shadow-lg transform hover:scale-105"
              style={{
                background: isDark 
                  ? 'linear-gradient(to right, rgb(71, 85, 105), rgb(15, 23, 42))' 
                  : 'linear-gradient(to right, rgb(251, 191, 36), rgb(251, 146, 60))'
              }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div className={`relative w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}>
                <Sun className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} />
                <Moon className={`w-4 h-4 text-slate-700 absolute transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                }`} />
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
