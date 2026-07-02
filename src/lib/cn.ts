import { type ClassValue, clsx } from "clsx";

// ponytail: clsx is enough for now. Add tailwind-merge here (wrap the return)
// only if consumer `className` overrides start conflicting with base utilities.
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
