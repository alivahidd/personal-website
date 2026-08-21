import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Public work records managed from the protected /admin workspace. */
export const portfolioItems = sqliteTable(
  "portfolio_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    type: text("type").notNull().default("Film"),
    year: text("year").notNull().default("—"),
    heroImage: text("hero_image").notNull(),
    videoId: text("video_id").notNull().default(""),
    galleryImages: text("gallery_images").notNull().default("[]"),
    description: text("description").notNull().default(""),
    credits: text("credits").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_portfolio_items_sort_order").on(table.sortOrder)],
);
