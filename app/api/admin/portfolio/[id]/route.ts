import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isPortfolioAdmin } from "../../../../admin/access";
import { getDb } from "../../../../../db";
import { portfolioItems } from "../../../../../db/schema";

function text(value: unknown, fallback = "") { return typeof value === "string" ? value.trim() : fallback; }
function validSlug(value: string) { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value); }
function payload(body: unknown) {
  const source = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const slug = text(source.slug), title = text(source.title), heroImage = text(source.heroImage);
  const galleryImages = Array.isArray(source.galleryImages) ? source.galleryImages.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  if (!title || !slug || !heroImage || !validSlug(slug)) return null;
  return { slug, title, heroImage, type: text(source.type, "Film"), year: text(source.year, "—"), videoId: text(source.videoId), galleryImages: JSON.stringify(galleryImages), description: text(source.description), credits: text(source.credits), sortOrder: Number.isFinite(Number(source.sortOrder)) ? Math.trunc(Number(source.sortOrder)) : 0, updatedAt: new Date().toISOString() };
}
function idFrom(params: { id: string }) { const id = Number(params.id); return Number.isInteger(id) && id > 0 ? id : null; }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isPortfolioAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = idFrom(await params), values = payload(await request.json().catch(() => null));
  if (!id || !values) return NextResponse.json({ error: "Invalid portfolio item." }, { status: 400 });
  try {
    const [item] = await getDb().update(portfolioItems).set(values).where(eq(portfolioItems.id, id)).returning();
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch { return NextResponse.json({ error: "The slug must be unique." }, { status: 409 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isPortfolioAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = idFrom(await params);
  if (!id) return NextResponse.json({ error: "Invalid portfolio item." }, { status: 400 });
  const [item] = await getDb().delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
  return item ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
