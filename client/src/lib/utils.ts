import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a title into main text and a highlighted (gradient) word.
 * mode "last" highlights the last word, "rest" highlights everything after the first word.
 * Works correctly for both LTR and RTL languages.
 */
export function splitTitle(text: string, mode: "last" | "rest" = "last"): { main: string; highlight: string } {
  const words = text.split(" ").filter(Boolean);
  if (words.length <= 1) return { main: "", highlight: text };
  if (mode === "last") {
    return { main: words.slice(0, -1).join(" "), highlight: words[words.length - 1] };
  }
  return { main: words[0], highlight: words.slice(1).join(" ") };
}
