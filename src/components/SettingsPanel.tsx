"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { INGREDIENTS } from "@/lib/recipe";
import { cn } from "@/lib/utils";
import type { CustomIngredient } from "./IngredientList";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  baseAmounts: Record<string, number>;
  onChangeBaseAmount: (key: string, value: number) => void;
  costs: Record<string, number>;
  onChangeCost: (key: string, value: number) => void;
  calculateCosts: boolean;
  onToggleCalculateCosts: () => void;
  onReset: () => void;
  customIngredients: CustomIngredient[];
  onChangeCustomBaseAmount: (id: string, value: number) => void;
  onChangeCustomCost: (id: string, value: number) => void;
  onDeleteCustomIngredient: (id: string) => void;
  deletedDefaults: string[];
  onDeleteDefaultIngredient: (key: string) => void;
  referenceKey: string;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  baseAmounts,
  onChangeBaseAmount,
  costs,
  onChangeCost,
  calculateCosts,
  onToggleCalculateCosts,
  onReset,
  customIngredients,
  onChangeCustomBaseAmount,
  onChangeCustomCost,
  onDeleteCustomIngredient,
  deletedDefaults,
  onDeleteDefaultIngredient,
  referenceKey,
}: SettingsPanelProps) {
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
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
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

  const toggleClass = (active: boolean) =>
    cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      active ? "bg-amber-600" : "bg-stone-300 dark:bg-stone-600"
    );

  const knobClass = (active: boolean) =>
    cn(
      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
      active ? "translate-x-6" : "translate-x-1"
    );

  const visibleDefaults = INGREDIENTS.filter((ing) => !deletedDefaults.includes(ing.key));

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
              "fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5 shadow-2xl sm:p-6",
              "bg-white border-stone-200",
              "dark:bg-stone-900 dark:border-stone-800"
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="settings-title" className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Recipe Settings
              </h2>
              <button
                onClick={onClose}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  "text-stone-500 hover:bg-stone-100",
                  "dark:text-stone-400 dark:hover:bg-stone-800"
                )}
                aria-label="Close settings"
                type="button"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3 dark:border-stone-800">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Calculate costs</span>
              <button
                onClick={onToggleCalculateCosts}
                className={toggleClass(calculateCosts)}
                aria-pressed={calculateCosts}
                aria-label="Toggle cost calculation"
                type="button"
              >
                <span className={knobClass(calculateCosts)} />
              </button>
            </div>

            <p className="mb-3 text-xs text-stone-500 dark:text-stone-400">
              Adjust base amounts for the 3 kg reference recipe. Values scale automatically for other lamb weights.
              {calculateCosts && " Cost-per-kg fields are shown below each ingredient."}
            </p>

            <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-4">
              {visibleDefaults.map((ing) => (
                <div key={ing.key} className="rounded-lg border border-stone-100 p-3 dark:border-stone-800">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={"amount-" + ing.key} className="text-sm font-medium text-stone-700 dark:text-stone-200">
                        {ing.label}
                      </label>
                      {referenceKey !== ing.key && (
                        <button
                          onClick={() => onDeleteDefaultIngredient(ing.key)}
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                            "text-stone-400 hover:bg-red-100 hover:text-red-600",
                            "dark:text-stone-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          )}
                          aria-label={"Delete " + ing.label}
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id={"amount-" + ing.key}
                        type="number"
                        step="1"
                        min="0"
                        value={baseAmounts[ing.key] ?? ing.baseAmount}
                        onChange={(e) => onChangeBaseAmount(ing.key, parseFloat(e.target.value))}
                        className={inputClass}
                        aria-label={ing.label + " base amount"}
                      />
                      <span className="text-sm text-stone-500 dark:text-stone-400 w-8">{ing.unit}</span>
                    </div>
                  </div>

                  {calculateCosts && (
                    <div className="flex items-center justify-between gap-4 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
                      <label htmlFor={"cost-" + ing.key} className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Cost per kg
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-500 dark:text-stone-400">$</span>
                        <input
                          id={"cost-" + ing.key}
                          type="number"
                          step="0.1"
                          min="0"
                          value={costs[ing.key] ?? ing.defaultCostPerKg}
                          onChange={(e) => onChangeCost(ing.key, parseFloat(e.target.value))}
                          className={cn(inputClass, "w-24")}
                          aria-label={ing.label + " cost per kilogram"}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {customIngredients.map((custom) => (
                <div key={custom.id} className="rounded-lg border border-stone-100 p-3 dark:border-stone-800">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                        {custom.label}
                      </span>
                      {referenceKey !== custom.id && (
                        <button
                          onClick={() => onDeleteCustomIngredient(custom.id)}
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                            "text-stone-400 hover:bg-red-100 hover:text-red-600",
                            "dark:text-stone-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          )}
                          aria-label={"Delete " + custom.label}
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={custom.baseAmount}
                        onChange={(e) => onChangeCustomBaseAmount(custom.id, parseFloat(e.target.value))}
                        className={inputClass}
                        aria-label={custom.label + " base amount"}
                      />
                      <span className="text-sm text-stone-500 dark:text-stone-400 w-8">{custom.unit}</span>
                    </div>
                  </div>

                  {calculateCosts && (
                    <div className="flex items-center justify-between gap-4 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
                      <label className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Cost per kg
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-500 dark:text-stone-400">$</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={custom.costPerKg}
                          onChange={(e) => onChangeCustomCost(custom.id, parseFloat(e.target.value))}
                          className={cn(inputClass, "w-24")}
                          aria-label={custom.label + " cost per kilogram"}
                        />
                      </div>
                    </div>
                  )}
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
