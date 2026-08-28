import { z } from "zod";

const localeSchema = z.enum(["en", "ur", "ar", "fa"]);
const imagePathSchema = z.string().trim().min(1, "Add an image path or URL.").max(500);
const slugSchema = z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

export const blogPostSchema = z.object({
  portalLocale: localeSchema,
  id: z.string().uuid().nullable(),
  locale: localeSchema,
  slug: slugSchema,
  title: z.string().trim().min(3).max(180),
  excerpt: z.string().trim().min(10).max(500),
  body: z.string().trim().min(30).max(30000),
  category: z.string().trim().min(2).max(80),
  cover_image_url: imagePathSchema,
  cover_image_alt: z.string().trim().min(5).max(200),
  author_name: z.string().trim().min(2).max(120),
  reading_time_minutes: z.number().int().min(1).max(120),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  display_order: z.number().int().min(0).max(100000),
});

export const galleryItemSchema = z.object({
  portalLocale: localeSchema,
  id: z.string().uuid().nullable(),
  locale: localeSchema,
  title: z.string().trim().min(3).max(180),
  caption: z.string().trim().min(5).max(600),
  category: z.string().trim().min(2).max(80),
  image_url: imagePathSchema,
  image_alt: z.string().trim().min(5).max(200),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  display_order: z.number().int().min(0).max(100000),
});

export const contentCommandSchema = z.object({
  portalLocale: localeSchema,
  id: z.string().uuid(),
});
