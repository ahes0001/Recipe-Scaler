import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        "w-full border-t py-6",
        "bg-stone-50 border-stone-200",
        "dark:bg-stone-950 dark:border-stone-800"
      )}
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          &copy; {new Date().getFullYear()} Bukhari Spice Calculator. All rights reserved.
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Crafted for cooks who love authentic Gulf flavors.
        </p>
      </div>
    </footer>
  );
}
