import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SORT_ORDER = [
  '15 (3ph) HA',
  '15 (3ph) GK',
  '20 (3ph)',
  '25 (3ph)',
  '30 (3ph)',
  '35 (3ph)',
  '40 (3ph)',
  '45',
  '58.5',
  '82.5',
  '125',
  '160',
  '200',
  '250-SB',
  '250',
  '320',
  '400',
  '500',
  '625',
  '750',
  '15 (1ph) HA',
  '15 (1ph) GK',
  '20 (1ph)',
  '25 (1ph)',
  '30 (1ph)',
  '35 (1ph)',
  '40 (1ph)',
  '45 (1ph)',
  '58.5 (1ph)'
];

export function sortRatings<T extends { kva: string }>(list: T[]): T[] {
  const orderMap = new Map(SORT_ORDER.map((kva, idx) => [kva, idx]));
  return [...list].sort((a, b) => {
    const indexA = orderMap.has(a.kva) ? orderMap.get(a.kva)! : 9999;
    const indexB = orderMap.has(b.kva) ? orderMap.get(b.kva)! : 9999;
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    return a.kva.localeCompare(b.kva);
  });
}
