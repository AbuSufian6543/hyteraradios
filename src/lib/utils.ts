import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Derive a URL slug from form input, falling back to the entity name when blank. */
export function resolveEntitySlug(
  rawSlugInput: FormDataEntryValue | null | undefined,
  name: string,
): string {
  const rawSlug = String(rawSlugInput ?? "").trim();
  return slugify(rawSlug || name);
}

export function formatPrice(cents: number, currency: "CAD" | "USD"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(currency === "CAD" ? "en-CA" : "en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RR-${timestamp}-${random}`;
}
