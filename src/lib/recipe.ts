/**
 * Recipe data and scaling logic for the Bukhari Spice Calculator.
 *
 * Base recipe is defined for 3 kg of lamb. All ingredient weights are in grams.
 * scaled_amount = base_amount * (lamb_kg / 3) * ratio
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

/** Build a default ratios map where every ingredient starts at 1.0 */
export function getDefaultRatios(): Record<string, number> {
  const ratios: Record<string, number> = {};
  for (const ing of INGREDIENTS) {
    ratios[ing.key] = 1.0;
  }
  return ratios;
}

/** Scale a single ingredient amount based on lamb kg and its custom ratio. */
export function scaleIngredient(
  ingredient: Ingredient,
  lambKg: number,
  ratio: number
): number {
  if (lambKg <= 0 || !isFinite(lambKg)) return 0;
  return ingredient.baseAmount * (lambKg / BASE_LAMB_KG) * ratio;
}

/** Format a number to a sensible precision for cooking (max 1 decimal). */
export function formatAmount(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
