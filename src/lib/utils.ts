import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The function `getTextColor` calculates the appropriate text color (black or white) based on the
 * background color provided in hexadecimal format.
 * @param {string} backgroundColor - The `getTextColor` function takes a background color in
 * hexadecimal format as input and returns either black (`#000000`) or white (`#FFFFFF`) as the text
 * color based on the luminance of the background color.
 * @returns The function `getTextColor` returns either `#000000` (black) or `#FFFFFF` (white) based on
 * the luminance value calculated from the provided background color. If the luminance is greater than
 * 186, it returns black (`#000000`), otherwise it returns white (`#FFFFFF`).
 */
export function getTextColor(backgroundColor: string): string {
  const hex = backgroundColor.replace("#", "");

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? "#000000" : "#FFFFFF";
}