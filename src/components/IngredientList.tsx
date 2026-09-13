"use client";

import { INGREDIENTS, scaleIngredient, formatCost } from "@/lib/recipe";
import IngredientItem from "./IngredientItem";

interface IngredientListProps {
  lambKg: number;
  baseAmounts: Record<string, number>;
  costs: Record<string, number>;
  calculateCosts: boolean;
}

export default function IngredientList({ lambKg, baseAmounts, costs, calculateCosts }: IngredientListProps) {
  const items = INGREDIENTS.map((ing) => {
    const amount = scaleIngredient(ing, lambKg, baseAmounts[ing.key] ?? ing.baseAmount);
    const cost = calculateCosts
      ? (amount / 1000) * (costs[ing.key] ?? ing.defaultCostPerKg)
      : undefined;
    return { ing, amount, cost };
  });

  const totalCost = calculateCosts
    ? items.reduce((sum, item) => sum + (item.cost ?? 0), 0)
    : 0;

  return (
    <section aria-label="Scaled ingredients" className="space-y-2">
      {items.map(({ ing, amount, cost }, idx) => (
        <IngredientItem
          key={ing.key}
          label={ing.label}
          amountGrams={amount}
          unit={ing.unit}
          isLamb={ing.key === "lamb"}
          cost={cost}
          index={idx}
        />
      ))}

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
