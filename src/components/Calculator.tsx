"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDefaultBaseAmounts, getDefaultCosts } from "@/lib/recipe";
import IngredientList, { type CustomIngredient } from "./IngredientList";
import SettingsPanel from "./SettingsPanel";

const BASE_AMOUNTS_STORAGE_KEY = "bukhari-base-amounts-v1";
const COSTS_STORAGE_KEY = "bukhari-costs-v1";
const CALCULATE_COSTS_STORAGE_KEY = "bukhari-calculate-costs-v1";
const CUSTOM_INGREDIENTS_STORAGE_KEY = "bukhari-custom-ingredients-v1";
const LAMB_STORAGE_KEY = "bukhari-lamb-kg-v1";
const DELETED_DEFAULTS_STORAGE_KEY = "bukhari-deleted-defaults-v1";

interface CalculatorProps {
  settingsOpen: boolean;
  onCloseSettings: () => void;
}

export default function Calculator({ settingsOpen, onCloseSettings }: CalculatorProps) {
  const [lambKg, setLambKg] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LAMB_STORAGE_KEY) ?? "";
    }
    return "";
  });
  const [baseAmounts, setBaseAmounts] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(BASE_AMOUNTS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return getDefaultBaseAmounts();
  });
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COSTS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return getDefaultCosts();
  });
  const [calculateCosts, setCalculateCosts] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CALCULATE_COSTS_STORAGE_KEY);
      return saved === "true";
    }
    return false;
  });
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CUSTOM_INGREDIENTS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [deletedDefaults, setDeletedDefaults] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(DELETED_DEFAULTS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(BASE_AMOUNTS_STORAGE_KEY, JSON.stringify(baseAmounts));
    } catch {}
  }, [baseAmounts]);

  useEffect(() => {
    try {
      localStorage.setItem(COSTS_STORAGE_KEY, JSON.stringify(costs));
    } catch {}
  }, [costs]);

  useEffect(() => {
    try {
      localStorage.setItem(CALCULATE_COSTS_STORAGE_KEY, String(calculateCosts));
    } catch {}
  }, [calculateCosts]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_INGREDIENTS_STORAGE_KEY, JSON.stringify(customIngredients));
    } catch {}
  }, [customIngredients]);

  useEffect(() => {
    try {
      localStorage.setItem(DELETED_DEFAULTS_STORAGE_KEY, JSON.stringify(deletedDefaults));
    } catch {}
  }, [deletedDefaults]);

  useEffect(() => {
    try {
      localStorage.setItem(LAMB_STORAGE_KEY, lambKg);
    } catch {}
  }, [lambKg]);

  const parsedLamb = parseFloat(lambKg);
  const isValid = !isNaN(parsedLamb) && parsedLamb > 0 && isFinite(parsedLamb);

  const handleChangeBaseAmount = useCallback((key: string, value: number) => {
    setBaseAmounts((prev) => ({ ...prev, [key]: isNaN(value) || value < 0 ? 0 : value }));
  }, []);

  const handleChangeCost = useCallback((key: string, value: number) => {
    setCosts((prev) => ({ ...prev, [key]: isNaN(value) || value < 0 ? 0 : value }));
  }, []);

  const handleAddCustom = useCallback((ing: CustomIngredient) => {
    setCustomIngredients((prev) => [...prev, ing]);
  }, []);

  const handleChangeCustomBaseAmount = useCallback((id: string, value: number) => {
    setCustomIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, baseAmount: isNaN(value) || value < 0 ? 0 : value } : ing))
    );
  }, []);

  const handleChangeCustomCost = useCallback((id: string, value: number) => {
    setCustomIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, costPerKg: isNaN(value) || value < 0 ? 0 : value } : ing))
    );
  }, []);

  const handleDeleteCustom = useCallback((id: string) => {
    setCustomIngredients((prev) => prev.filter((ing) => ing.id !== id));
  }, []);

  const handleDeleteDefault = useCallback((key: string) => {
    setDeletedDefaults((prev) => [...prev, key]);
  }, []);

  const handleReset = useCallback(() => {
    setBaseAmounts(getDefaultBaseAmounts());
    setCosts(getDefaultCosts());
    setCustomIngredients([]);
    setDeletedDefaults([]);
  }, []);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className={cn("rounded-3xl border p-6 shadow-xl sm:p-8", "bg-white/90 border-stone-200", "dark:bg-stone-900/90 dark:border-stone-800")}>
        <div className="mb-6 flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", "bg-amber-100 text-amber-700", "dark:bg-amber-900/40 dark:text-amber-400")}>
            <CalcIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
              Bukhari Spice Calculator
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Scale the classic rice bukhari recipe by lamb weight.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="lamb-input" className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-200">
            Lamb weight (kg)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="lamb-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="3"
              value={lambKg}
              onChange={(e) => setLambKg(e.target.value)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-lg font-semibold outline-none transition-colors",
                "bg-stone-50 border-stone-300 text-stone-800 placeholder:text-stone-400",
                "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10",
                "dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500",
                "dark:focus:border-amber-500 dark:focus:ring-amber-500/10"
              )}
              aria-describedby="lamb-hint"
            />
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">kg</span>
          </div>
          <p id="lamb-hint" className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            Base recipe is calibrated for 3 kg of lamb.
          </p>
        </div>

        {isValid ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
              <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-500" aria-hidden="true" />
              Scaled ingredients for {parsedLamb} kg lamb
            </div>
            <IngredientList
              lambKg={parsedLamb}
              baseAmounts={baseAmounts}
              costs={costs}
              calculateCosts={calculateCosts}
              customIngredients={customIngredients}
              onAddCustomIngredient={handleAddCustom}
              deletedDefaults={deletedDefaults}
            />
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center dark:border-stone-700 dark:bg-stone-800/50">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Enter a positive lamb weight above to see scaled ingredients.
            </p>
          </div>
        )}
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={onCloseSettings}
        baseAmounts={baseAmounts}
        onChangeBaseAmount={handleChangeBaseAmount}
        costs={costs}
        onChangeCost={handleChangeCost}
        calculateCosts={calculateCosts}
        onToggleCalculateCosts={() => setCalculateCosts((v) => !v)}
        onReset={handleReset}
        customIngredients={customIngredients}
        onChangeCustomBaseAmount={handleChangeCustomBaseAmount}
        onChangeCustomCost={handleChangeCustomCost}
        onDeleteCustomIngredient={handleDeleteCustom}
        deletedDefaults={deletedDefaults}
        onDeleteDefaultIngredient={handleDeleteDefault}
      />
    </section>
  );
}
