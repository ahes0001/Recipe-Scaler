/**
 * Recipe data and scaling logic for the Bukhari Spice Calculator.
 *
 * Base recipe is defined for 3 kg of lamb. All ingredient weights are in grams.
 * scaled_amount = custom_base_amount * (lamb_kg / 3)
 */

export interface Ingredient {
  key: string;
  label: string;
  baseAmount: number; // in grams
  unit: string;
  defaultCostPerKg: number; // currency per kg
}

export const BASE_LAMB_KG = 3;

export const INGREDIENTS: Ingredient[] = [
  { key: "lamb", label: "Lamb", baseAmount: 3000, unit: "g", defaultCostPerKg: 15 },
  { key: "carrot", label: "Carrot", baseAmount: 600, unit: "g", defaultCostPerKg: 2 },
  { key: "tomatoes", label: "Tomatoes", baseAmount: 750, unit: "g", defaultCostPerKg: 3 },
  { key: "tomato_paste", label: "Tomato Paste", baseAmount: 50, unit: "g", defaultCostPerKg: 4 },
  { key: "dried_chick_peas", label: "Dried Chick Peas", baseAmount: 250, unit: "g", defaultCostPerKg: 5 },
  { key: "black_raisins", label: "Black Raisins", baseAmount: 400, unit: "g", defaultCostPerKg: 8 },
  { key: "slivered_onions", label: "Slivered Onions", baseAmount: 400, unit: "g", defaultCostPerKg: 3 },
  { key: "ground_cumin", label: "Ground Cumin", baseAmount: 18, unit: "g", defaultCostPerKg: 20 },
  { key: "big_onions", label: "Big Onions (total)", baseAmount: 500, unit: "g", defaultCostPerKg: 2 },
  { key: "large_chilies", label: "Large Chilies (total)", baseAmount: 150, unit: "g", defaultCostPerKg: 6 },
  { key: "lamb_tallow", label: "Lamb Tallow", baseAmount: 0.6, unit: "g", defaultCostPerKg: 0 },
];

/** Build a map of the original base amounts for every ingredient. */
export function getDefaultBaseAmounts(): Record<string, number> {
  const amounts: Record<string, number> = {};
  for (const ing of INGREDIENTS) {
    amounts[ing.key] = ing.baseAmount;
  }
  return amounts;
}

/** Build a map of the default cost-per-kg for every ingredient. */
export function getDefaultCosts(): Record<string, number> {
  const costs: Record<string, number> = {};
  for (const ing of INGREDIENTS) {
    costs[ing.key] = ing.defaultCostPerKg;
  }
  return costs;
}

/** Scale a single ingredient amount based on lamb kg and its custom base amount. */
export function scaleIngredient(
  ingredient: Ingredient,
  lambKg: number,
  customBaseAmount: number
): number {
  if (lambKg <= 0 || !isFinite(lambKg)) return 0;
  return customBaseAmount * (lambKg / BASE_LAMB_KG);
}

/** Format a number to a sensible precision for cooking (max 1 decimal). */
export function formatAmount(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Format a cost value to 2 decimal places with a currency symbol. */
export function formatCost(value: number): string {
  return "$" + value.toFixed(2);
}
