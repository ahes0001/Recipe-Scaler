"use client";

import { INGREDIENTS, scaleIngredient } from "@/lib/recipe";
import IngredientItem from "./IngredientItem";

interface IngredientListProps {
  lambKg: number;
  ratios: Record<string, number>;
}

export default function IngredientList({ lambKg, ratios }: IngredientListProps) {
  return (
    <section aria-label="Scaled ingredients" className="space-y-2">
      {INGREDIENTS.map((ing, idx) => {
        const amount = scaleIngredient(ing, lambKg, ratios[ing.key] ?? 1);
        return (
          <IngredientItem
            key={ing.key}
            label={ing.label}
            amountGrams={amount}
            unit={ing.unit}
            isLamb={ing.key === "lamb"}
            index={idx}
          />
        );
      })}
    </section>
  );
}
