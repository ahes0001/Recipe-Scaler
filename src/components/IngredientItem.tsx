"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount, formatCost } from "@/lib/recipe";

interface IngredientItemProps {
  label: string;
  amountGrams: number;
  unit: string;
  isLamb?: boolean;
  cost?: number;
  index: number;
  isReference?: boolean;
  onClick?: () => void;
}

export default function IngredientItem({
  label,
  amountGrams,
  unit,
  isLamb = false,
  cost,
  index,
  isReference = false,
  onClick,
}: IngredientItemProps) {
  const displayValue = formatAmount(amountGrams);
  const displayUnit = isLamb ? unit + " / " + formatAmount(amountGrams / 1000) + " kg" : unit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 transition-colors cursor-pointer",
        "bg-white border",
        "dark:bg-stone-900",
        isReference
          ? "border-amber-300 shadow-sm ring-1 ring-amber-500/20 dark:border-amber-700/50"
          : "border-stone-100 shadow-sm hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/50"
      )}
    >
      <div className="flex items-center gap-2">
        {isReference && (
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
        )}
        <span className={cn(
          "text-sm font-medium",
          isReference ? "text-amber-800 dark:text-amber-300" : "text-stone-700 dark:text-stone-200"
        )}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {typeof cost === "number" && (
          <span
            className={cn(
              "rounded-lg px-2 py-1 text-xs font-semibold tabular-nums",
              "bg-emerald-50 text-emerald-700",
              "dark:bg-emerald-900/30 dark:text-emerald-300"
            )}
            aria-label={label + " cost"}
          >
            {formatCost(cost)}
          </span>
        )}
        <span
          className={cn(
            "rounded-lg px-3 py-1 text-sm font-semibold tabular-nums",
            isReference
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          )}
          aria-label={label + " amount"}
        >
          {displayValue} {displayUnit}
        </span>
      </div>
    </motion.div>
  );
}
