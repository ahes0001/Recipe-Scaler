"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/recipe";

interface IngredientItemProps {
  label: string;
  amountGrams: number;
  unit: string;
  isLamb?: boolean;
  index: number;
}

export default function IngredientItem({
  label,
  amountGrams,
  unit,
  isLamb = false,
  index,
}: IngredientItemProps) {
  const displayValue = formatAmount(amountGrams);
  const displayUnit = isLamb ? `${unit} / ${formatAmount(amountGrams / 1000)} kg` : unit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 transition-colors",
        "bg-white border border-stone-100 shadow-sm",
        "dark:bg-stone-900 dark:border-stone-800"
      )}
    >
      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
        {label}
      </span>
      <span
        className={cn(
          "rounded-lg px-3 py-1 text-sm font-semibold tabular-nums",
          "bg-amber-50 text-amber-800",
          "dark:bg-amber-900/30 dark:text-amber-300"
        )}
        aria-label={`${label} amount`}
      >
        {displayValue} {displayUnit}
      </span>
    </motion.div>
  );
}
