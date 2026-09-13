"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { INGREDIENTS, scaleIngredient, formatCost, BASE_LAMB_KG } from "@/lib/recipe";
import { cn } from "@/lib/utils";
import IngredientItem from "./IngredientItem";

export interface CustomIngredient {
  id: string;
  label: string;
  baseAmount: number;
  unit: string;
  costPerKg: number;
}

interface IngredientListProps {
  lambKg: number;
  baseAmounts: Record<string, number>;
  costs: Record<string, number>;
  calculateCosts: boolean;
  customIngredients: CustomIngredient[];
  onAddCustomIngredient: (ing: CustomIngredient) => void;
  deletedDefaults: string[];
}

export default function IngredientList({
  lambKg,
  baseAmounts,
  costs,
  calculateCosts,
  customIngredients,
  onAddCustomIngredient,
  deletedDefaults,
}: IngredientListProps) {
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftCost, setDraftCost] = useState("");

  const visibleDefaults = INGREDIENTS.filter((ing) => !deletedDefaults.includes(ing.key));

  const predefinedItems = visibleDefaults.map((ing) => {
    const amount = scaleIngredient(ing, lambKg, baseAmounts[ing.key] ?? ing.baseAmount);
    const cost = calculateCosts
      ? (amount / 1000) * (costs[ing.key] ?? ing.defaultCostPerKg)
      : undefined;
    return { key: ing.key, label: ing.label, amount, unit: ing.unit, cost, isLamb: ing.key === "lamb" };
  });

  const customItems = customIngredients.map((custom) => {
    const amount = custom.baseAmount * (lambKg / BASE_LAMB_KG);
    const cost = calculateCosts ? (amount / 1000) * custom.costPerKg : undefined;
    return { id: custom.id, label: custom.label, amount, unit: custom.unit, cost };
  });

  const totalCost = calculateCosts
    ? [...predefinedItems, ...customItems].reduce((sum, item) => sum + (item.cost ?? 0), 0)
    : 0;

  function handleAdd() {
    const name = draftName.trim();
    const amount = parseFloat(draftAmount);
    if (!name || isNaN(amount) || amount < 0) return;

    const newIng: CustomIngredient = {
      id: `custom-${Date.now()}`,
      label: name,
      baseAmount: amount,
      unit: "g",
      costPerKg: calculateCosts ? (parseFloat(draftCost) || 0) : 0,
    };

    onAddCustomIngredient(newIng);
    setDraftName("");
    setDraftAmount("");
    setDraftCost("");
  }

  const inputClass = cn(
    "rounded-lg border px-2 py-1.5 text-sm outline-none transition-colors",
    "bg-stone-50 border-stone-300 text-stone-800",
    "focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
    "dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100",
    "dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
  );

  return (
    <section aria-label="Scaled ingredients" className="space-y-2">
      {predefinedItems.map((item, idx) => (
        <IngredientItem
          key={item.key}
          label={item.label}
          amountGrams={item.amount}
          unit={item.unit}
          isLamb={item.isLamb}
          cost={item.cost}
          index={idx}
        />
      ))}

      {customItems.map((item, idx) => (
        <IngredientItem
          key={item.id}
          label={item.label}
          amountGrams={item.amount}
          unit={item.unit}
          cost={item.cost}
          index={predefinedItems.length + idx}
        />
      ))}

      {/* Add custom ingredient row */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-xl border border-dashed px-4 py-3",
          "border-stone-300 bg-stone-50/50",
          "dark:border-stone-700 dark:bg-stone-800/30"
        )}
      >
        <input
          type="text"
          placeholder="Ingredient name"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className={cn(inputClass, "flex-1 min-w-[120px]")}
        />
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Amount"
          value={draftAmount}
          onChange={(e) => setDraftAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className={cn(inputClass, "w-24 text-right")}
        />
        <span className="text-sm text-stone-500 dark:text-stone-400 w-6 text-center">g</span>
        {calculateCosts && (
          <div className="flex items-center gap-1">
            <span className="text-sm text-stone-500 dark:text-stone-400">$</span>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Cost/kg"
              value={draftCost}
              onChange={(e) => setDraftCost(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={cn(inputClass, "w-24 text-right")}
            />
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={!draftName.trim() || draftAmount === "" || parseFloat(draftAmount) < 0}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors",
            "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed",
            "dark:bg-amber-600 dark:hover:bg-amber-500"
          )}
          aria-label="Add custom ingredient"
          type="button"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {calculateCosts && (
        <div className="flex items-center justify-between rounded-xl px-4 py-3 border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
          <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
            Total Cost
          </span>
          <span className="rounded-lg px-3 py-1 text-sm font-bold tabular-nums bg-emerald-100 text-emerald-900 dark:bg-emerald-800/40 dark:text-emerald-300">
            {formatCost(totalCost)}
          </span>
        </div>
      )}
    </section>
  );
}

