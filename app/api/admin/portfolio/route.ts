import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isPortfolioAdmin } from "../../../admin/access";
import { getDb } from "../../../../db";
import { portfolioItems } from "../../../../db/schema";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function payload(body: unknown) {
  const source = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const slug = text(source.slug);
  const title = text(source.title);
  const heroImage = text(source.heroImage);
  const galleryImages = Array.isArray(source.galleryImages) ? source.galleryImages.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  if (!title || !slug || !heroImage || !validSlug(slug)) return null;
  return { slug, title, heroImage, type: text(source.type, "Film"), year: text(source.year, "—"), videoId: text(source.videoId), galleryImages: JSON.stringify(galleryImages), description: text(source.description), credits: text(source.credits), sortOrder: Number.isFinite(Number(source.sortOrder)) ? Math.trunc(Number(source.sortOrder)) : 0, updatedAt: new Date().toISOString() };
}

export async function GET() {
  if (!(await isPortfolioAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const items = await getDb().select().from(portfolioItems).orderBy(desc(portfolioItems.sortOrder), desc(portfolioItems.id));
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isPortfolioAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const values = payload(await request.json().catch(() => null));
  if (!values) return NextResponse.json({ error: "Provide a title, a lowercase hyphenated slug, and a hero image URL." }, { status: 400 });
  try {
    const [item] = await getDb().insert(portfolioItems).values(values).returning();
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "The slug must be unique." }, { status: 409 });
  }
}
