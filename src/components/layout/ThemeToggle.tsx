"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7 bg-white/20 rounded-full animate-pulse"></div>;
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    // Add transition class to HTML root
    document.documentElement.classList.add("theme-transitioning");
    
    // Switch theme
    setTheme(isDark ? "light" : "dark");
    
    // Remove transition class after animation completes (2.5s = 2500ms)
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 2500);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-14 h-7 rounded-full transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 focus:ring-offset-teal-700
        ${isDark ? "bg-gray-700 border-gray-600" : "bg-teal-800 border-teal-900"}
        border shadow-inner flex-shrink-0
      `}
      aria-label="Toggle Dark Mode"
    >
      {/* Track Background Elements */}
      <div className="absolute inset-0 flex justify-between items-center px-1.5 w-full">
        <Moon className={`w-3.5 h-3.5 text-amber-200/70 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-0"}`} />
        <Sun className={`w-3.5 h-3.5 text-amber-300/80 transition-opacity duration-500 ${isDark ? "opacity-0" : "opacity-100"}`} />
      </div>

      {/* Sliding Knob */}
      <div 
        className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-500
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-amber-600" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </div>
    </button>
  );
}
