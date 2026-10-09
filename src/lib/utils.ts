/**
 * Class Name Utilities
 * Merges Tailwind classes with clsx and tailwind-merge
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combines class names, resolving Tailwind conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
