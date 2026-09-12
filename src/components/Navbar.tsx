"use client";

import { Settings, Moon, Sun, ChefHat } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenSettings: () => void;
}

export default function Navbar({ onOpenSettings }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur",
        "bg-white/80 border-stone-200",
        "dark:bg-stone-900/80 dark:border-stone-800"
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2">
          <ChefHat
            className="h-7 w-7 text-amber-600 dark:text-amber-500"
            aria-hidden="true"
          />
          <span className="text-lg font-bold tracking-tight text-stone-800 dark:text-stone-100">
            Bukhari Spice
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={cn(
              "inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              "text-stone-600 hover:bg-stone-100",
              "dark:text-stone-300 dark:hover:bg-stone-800"
            )}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            type="button"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className={cn(
              "inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              "text-stone-600 hover:bg-stone-100",
              "dark:text-stone-300 dark:hover:bg-stone-800"
            )}
            aria-label="Open settings"
            title="Settings"
            type="button"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
