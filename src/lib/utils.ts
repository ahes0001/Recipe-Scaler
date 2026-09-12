import { type ClassValue, clsx } from "clsx";

/**
 * Conditionally join class names together.
 * A lightweight helper similar to cn() from shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
