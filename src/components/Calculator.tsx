"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDefaultBaseAmounts, getDefaultCosts, INGREDIENTS } from "@/lib/recipe";
import IngredientList, { type CustomIngredient } from "./IngredientList";
import SettingsPanel from "./SettingsPanel";

const BASE_AMOUNTS_STORAGE_KEY = "bukhari-base-amounts-v1";
const COSTS_STORAGE_KEY = "bukhari-costs-v1";
const CALCULATE_COSTS_STORAGE_KEY = "bukhari-calculate-costs-v1";
const CUSTOM_INGREDIENTS_STORAGE_KEY = "bukhari-custom-ingredients-v1";
const DELETED_DEFAULTS_STORAGE_KEY = "bukhari-deleted-defaults-v1";
const REFERENCE_KEY_STORAGE_KEY = "bukhari-reference-key-v1";
const REFERENCE_INPUT_STORAGE_KEY = "bukhari-reference-input-v1";
const LAMB_STORAGE_KEY = "bukhari-lamb-kg-v1";

interface CalculatorProps {
  settingsOpen: boolean;
  onCloseSettings: () => void;
}

export default function Calculator({ settingsOpen, onCloseSettings }: CalculatorProps) {
  const [referenceKey, setReferenceKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFERENCE_KEY_STORAGE_KEY) ?? "lamb";
    }
    return "lamb";
  });
  const [referenceInput, setReferenceInput] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(REFERENCE_INPUT_STORAGE_KEY);
      if (saved) return saved;
      const legacy = localStorage.getItem(LAMB_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(REFERENCE_INPUT_STORAGE_KEY, legacy);
        localStorage.removeItem(LAMB_STORAGE_KEY);
        return legacy;
      }
    }
    return "3";
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
    try { localStorage.setItem(REFERENCE_KEY_STORAGE_KEY, referenceKey); } catch {}
  }, [referenceKey]);

  useEffect(() => {
    try { localStorage.setItem(REFERENCE_INPUT_STORAGE_KEY, referenceInput); } catch {}
  }, [referenceInput]);

  useEffect(() => {
    try { localStorage.setItem(BASE_AMOUNTS_STORAGE_KEY, JSON.stringify(baseAmounts)); } catch {}
  }, [baseAmounts]);

  useEffect(() => {
    try { localStorage.setItem(COSTS_STORAGE_KEY, JSON.stringify(costs)); } catch {}
  }, [costs]);

  useEffect(() => {
    try { localStorage.setItem(CALCULATE_COSTS_STORAGE_KEY, String(calculateCosts)); } catch {}
  }, [calculateCosts]);

  useEffect(() => {
    try { localStorage.setItem(CUSTOM_INGREDIENTS_STORAGE_KEY, JSON.stringify(customIngredients)); } catch {}
  }, [customIngredients]);

  useEffect(() => {
    try { localStorage.setItem(DELETED_DEFAULTS_STORAGE_KEY, JSON.stringify(deletedDefaults)); } catch {}
  }, [deletedDefaults]);

  useEffect(() => {
    if (referenceKey === "lamb") return;
    const customExists = customIngredients.some((c) => c.id === referenceKey);
    const defaultExists = INGREDIENTS.some((i) => i.key === referenceKey && !deletedDefaults.includes(i.key));
    if (!customExists && !defaultExists) {
      setReferenceKey("lamb");
      setReferenceInput("3");
    }
  }, [referenceKey, customIngredients, deletedDefaults]);

  const getBaseAmount = useCallback((key: string) => {
    return baseAmounts[key]
      ?? INGREDIENTS.find((i) => i.key === key)?.baseAmount
      ?? customIngredients.find((c) => c.id === key)?.baseAmount
      ?? 0;
  }, [baseAmounts, customIngredients]);

  const refBase = getBaseAmount(referenceKey);
  const refDisplay = parseFloat(referenceInput);
  const refGrams = referenceKey === "lamb" ? refDisplay * 1000 : refDisplay;
  const scaleFactor = !isNaN(refGrams) && refGrams > 0 && refBase > 0 ? refGrams / refBase : 0;
  const isValid = scaleFactor > 0;

  const referenceDef = INGREDIENTS.find((i) => i.key === referenceKey);
  const referenceCustom = customIngredients.find((c) => c.id === referenceKey);
  const referenceLabel = referenceDef?.label ?? referenceCustom?.label ?? "Reference";
  const isLambReference = referenceKey === "lamb";

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

  const handleSetReference = useCallback((key: string) => {
    if (key === referenceKey) return;
    const currentRefBase = getBaseAmount(referenceKey);
    const currentRefDisplay = parseFloat(referenceInput);
    const currentRefGrams = referenceKey === "lamb" ? currentRefDisplay * 1000 : currentRefDisplay;
    const currentScale = !isNaN(currentRefGrams) && currentRefGrams > 0 && currentRefBase > 0
      ? currentRefGrams / currentRefBase
      : 1;
    const newRefBase = getBaseAmount(key);
    const newRefGrams = newRefBase * currentScale;
    const newInput = key === "lamb"
      ? String(Math.round((newRefGrams / 1000) * 10) / 10)
      : String(Math.round(newRefGrams * 10) / 10);
    setReferenceKey(key);
    setReferenceInput(newInput);
  }, [referenceKey, referenceInput, getBaseAmount]);

  const handleReset = useCallback(() => {
    setBaseAmounts(getDefaultBaseAmounts());
    setCosts(getDefaultCosts());
    setCustomIngredients([]);
    setDeletedDefaults([]);
    setReferenceKey("lamb");
    setReferenceInput("3");
  }, []);

  const displayValue = referenceInput;
  const displayUnit = isLambReference ? "kg" : "g";
  const displayLabel = isLambReference ? "Lamb weight" : referenceLabel + " amount";
  const displayHint = isLambReference
    ? "Base recipe is calibrated for 3 kg of lamb."
    : "Recipe is balanced around " + referenceLabel + ". Click any ingredient below to change.";


  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className={cn("rounded-3xl border p-6 shadow-xl sm:p-8", "bg-white/90 border-stone-200", "dark:bg-stone-900/90 dark:border-stone-800")}>
        <div className="mb-6 flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", "bg-amber-100 text-amber-700", "dark:bg-amber-900/40 dark:text-amber-400")}>
            <CalcIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-100">
              Receipe Calculator
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Scale ANY recipe you find by your preferred ingredient.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="ref-input" className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-200">
            {displayLabel}
          </label>
          <div className="flex items-center gap-3">
            <input
              id="ref-input"
              type="number"
              min="0"
              step={isLambReference ? "0.1" : "1"}
              placeholder={isLambReference ? "3" : String(Math.round(getBaseAmount(referenceKey)))}
              value={displayValue}
              onChange={(e) => setReferenceInput(e.target.value)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-lg font-semibold outline-none transition-colors",
                "bg-stone-50 border-stone-300 text-stone-800 placeholder:text-stone-400",
                "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10",
                "dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500",
                "dark:focus:border-amber-500 dark:focus:ring-amber-500/10"
              )}
              aria-describedby="ref-hint"
            />
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{displayUnit}</span>
          </div>
          <p id="ref-hint" className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            {displayHint}
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
              Scaled ingredients
            </div>
            <IngredientList
              scaleFactor={scaleFactor}
              baseAmounts={baseAmounts}
              costs={costs}
              calculateCosts={calculateCosts}
              customIngredients={customIngredients}
              onAddCustomIngredient={handleAddCustom}
              deletedDefaults={deletedDefaults}
              referenceKey={referenceKey}
              onSetReference={handleSetReference}
            />
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center dark:border-stone-700 dark:bg-stone-800/50">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Enter a positive {displayLabel.toLowerCase()} above to see scaled ingredients.
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
        referenceKey={referenceKey}
      />
    </section>
  );
}

