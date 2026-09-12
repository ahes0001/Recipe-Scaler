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
}

export const BASE_LAMB_KG = 3;

export const INGREDIENTS: Ingredient[] = [
  { key: "lamb", label: "Lamb", baseAmount: 3000, unit: "g" },
  { key: "carrot", label: "Carrot", baseAmount: 500, unit: "g" },
  { key: "tomatoes", label: "Tomatoes", baseAmount: 750, unit: "g" },
  { key: "tomato_paste", label: "Tomato Paste", baseAmount: 50, unit: "g" },
  { key: "chick_peas", label: "Chick Peas", baseAmount: 400, unit: "g" },
  { key: "black_raisins", label: "Black Raisins", baseAmount: 400, unit: "g" },
  { key: "slivered_onions", label: "Slivered Onions", baseAmount: 400, unit: "g" },
  { key: "ground_cumin", label: "Ground Cumin", baseAmount: 18, unit: "g" },
  { key: "big_onions", label: "Big Onions (total)", baseAmount: 500, unit: "g" },
  { key: "large_chilies", label: "Large Chilies (total)", baseAmount: 150, unit: "g" },
];

/** Build a map of the original base amounts (in grams) for every ingredient. */
export function getDefaultBaseAmounts(): Record<string, number> {
  const amounts: Record<string, number> = {};
  for (const ing of INGREDIENTS) {
    amounts[ing.key] = ing.baseAmount;
  }
  return amounts;
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
  // Remove trailing .0 for whole numbers
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
