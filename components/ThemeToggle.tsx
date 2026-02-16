"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-gray-700 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-neutral-600 dark:text-gray-300 animate-in spin-in-180 duration-300" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
