"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { INGREDIENTS } from "@/lib/recipe";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  baseAmounts: Record<string, number>;
  onChangeBaseAmount: (key: string, value: number) => void;
  onReset: () => void;
}

export default function SettingsPanel({ isOpen, onClose, baseAmounts, onChangeBaseAmount, onReset }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    panel.addEventListener("keydown", trap);
    first?.focus();
    return () => panel.removeEventListener("keydown", trap);
  }, [isOpen]);

  const inputClass = cn(
    "w-28 rounded-lg border px-3 py-2 text-sm font-medium text-right tabular-nums outline-none transition-colors",
    "bg-stone-50 border-stone-300 text-stone-800",
    "focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
    "dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100",
    "dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl",
              "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 id="settings-title" className="text-xl font-bold text-stone-800 dark:text-stone-100">Base Recipe Amounts</h2>
              <button
                onClick={onClose}
                className={cn("rounded-lg p-2 transition-colors text-stone-500 hover:bg-stone-100", "dark:text-stone-400 dark:hover:bg-stone-800")}
                aria-label="Close settings"
                type="button"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
              Adjust the base recipe amounts (for 3 kg of lamb). The calculator will scale these values proportionally based on the lamb weight you enter.
            </p>
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
              {INGREDIENTS.map((ing) => (
                <div key={ing.key} className="flex items-center justify-between gap-4">
                  <label htmlFor={`amount-${ing.key}`} className="text-sm font-medium text-stone-700 dark:text-stone-200">{ing.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`amount-${ing.key}`}
                      type="number"
                      step="1"
                      min="0"
                      value={baseAmounts[ing.key] ?? ing.baseAmount}
                      onChange={(e) => onChangeBaseAmount(ing.key, parseFloat(e.target.value))}
                      className={inputClass}
                      aria-label={`${ing.label} base amount in grams`}
                    />
                    <span className="text-sm text-stone-500 dark:text-stone-400 w-6">{ing.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={onReset}
                className={cn("inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors", "text-stone-600 bg-stone-100 hover:bg-stone-200", "dark:text-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700")}
                type="button"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset to Default
              </button>
              <button
                onClick={onClose}
                className={cn("inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors", "bg-amber-600 text-white hover:bg-amber-700", "dark:bg-amber-600 dark:hover:bg-amber-500")}
                type="button"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
