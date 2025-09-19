"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle = ({ className }) => {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={cn(
        "w-14 h-8 bg-gray-200 rounded-full flex items-center justify-center animate-pulse",
        className
      )}>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "bg-gradient-to-r shadow-lg transform hover:scale-105",
        isDark 
          ? "from-slate-700 to-slate-900 shadow-slate-900/20" 
          : "from-amber-200 to-orange-300 shadow-orange-300/30",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Toggle background track */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-all duration-300",
        isDark 
          ? "bg-gradient-to-r from-indigo-600 to-purple-600" 
          : "bg-gradient-to-r from-yellow-300 to-orange-400"
      )} />
      
      {/* Toggle slider */}
      <div className={cn(
        "relative w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center",
        isDark ? "translate-x-6" : "translate-x-1"
      )}>
        {/* Icons */}
        <Sun className={cn(
          "w-4 h-4 text-amber-500 absolute transition-all duration-300",
          isDark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
        )} />
        <Moon className={cn(
          "w-4 h-4 text-slate-700 absolute transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
        )} />
      </div>
      
      {/* Glowing effect */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-opacity duration-300",
        isDark 
          ? "bg-blue-400/20 opacity-100" 
          : "bg-yellow-400/30 opacity-100"
      )} />
    </button>
  );
};