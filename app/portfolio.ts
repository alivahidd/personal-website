import { asc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { portfolioItems } from "../db/schema";

export type PortfolioItem = typeof portfolioItems.$inferSelect;

export function parseGalleryImages(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

export async function getPortfolioItems() {
  return getDb()
    .select()
    .from(portfolioItems)
    .orderBy(asc(portfolioItems.sortOrder), asc(portfolioItems.id));
}

export async function getPortfolioItem(slug: string) {
  const [item] = await getDb()
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.slug, slug))
    .limit(1);
  return item ?? null;
}
