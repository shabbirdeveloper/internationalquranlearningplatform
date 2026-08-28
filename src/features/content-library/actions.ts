"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS } from "@/config/permissions";
import { blogPostSchema, contentCommandSchema, galleryItemSchema } from "@/features/content-library/schemas";
import { locales } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserAccess } from "@/server/authorization/access";
import { hasPermission } from "@/server/authorization/permissions";

export type ContentLibraryActionState = { success?: boolean; error?: string; savedId?: string };

async function getAuthorizedClient() {
  const access = await getCurrentUserAccess();
  if (!access || !hasPermission(access, PERMISSIONS.CONTENT_MANAGE)) return null;
  return createServerSupabaseClient();
}

function readPayload(formData: FormData): unknown {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function refreshContent(): void {
  for (const locale of locales) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/gallery`);
    revalidatePath(`/${locale}/admin/blog`);
    revalidatePath(`/${locale}/admin/gallery`);
  }
}

export async function saveBlogPostAction(_state: ContentLibraryActionState, formData: FormData): Promise<ContentLibraryActionState> {
  const parsed = blogPostSchema.safeParse(readPayload(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the blog post and try again." };
  const supabase = await getAuthorizedClient();
  if (!supabase) return { error: "You are not authorized to manage blog content." };
  const { id, portalLocale, ...record } = parsed.data;
  void portalLocale;
  const payload = { ...record, published_at: record.is_published ? new Date().toISOString() : null, deleted_at: null };
  const result = id
    ? await supabase.from("blog_posts").update(payload).eq("id", id).select("id").single()
    : await supabase.from("blog_posts").insert(payload).select("id").single();
  if (result.error) return { error: result.error.message };
  refreshContent();
  return { success: true, savedId: result.data.id as string };
}

export async function saveGalleryItemAction(_state: ContentLibraryActionState, formData: FormData): Promise<ContentLibraryActionState> {
  const parsed = galleryItemSchema.safeParse(readPayload(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the gallery item and try again." };
  const supabase = await getAuthorizedClient();
  if (!supabase) return { error: "You are not authorized to manage gallery content." };
  const { id, portalLocale, ...record } = parsed.data;
  void portalLocale;
  const payload = { ...record, published_at: record.is_published ? new Date().toISOString() : null, deleted_at: null };
  const result = id
    ? await supabase.from("gallery_items").update(payload).eq("id", id).select("id").single()
    : await supabase.from("gallery_items").insert(payload).select("id").single();
  if (result.error) return { error: result.error.message };
  refreshContent();
  return { success: true, savedId: result.data.id as string };
}

async function runCommand(formData: FormData, table: "blog_posts" | "gallery_items", command: "toggle" | "archive") {
  const parsed = contentCommandSchema.safeParse({ portalLocale: formData.get("portalLocale"), id: formData.get("id") });
  if (!parsed.success) return;
  const supabase = await getAuthorizedClient();
  if (!supabase) return;
  if (command === "archive") {
    await supabase.from(table).update({ is_published: false, deleted_at: new Date().toISOString() }).eq("id", parsed.data.id);
  } else {
    const { data } = await supabase.from(table).select("is_published").eq("id", parsed.data.id).single();
    if (!data) return;
    await supabase.from(table).update({ is_published: !data.is_published, published_at: !data.is_published ? new Date().toISOString() : null, deleted_at: null }).eq("id", parsed.data.id);
  }
  refreshContent();
}

export async function toggleBlogPostAction(formData: FormData) { await runCommand(formData, "blog_posts", "toggle"); }
export async function archiveBlogPostAction(formData: FormData) { await runCommand(formData, "blog_posts", "archive"); }
export async function toggleGalleryItemAction(formData: FormData) { await runCommand(formData, "gallery_items", "toggle"); }
export async function archiveGalleryItemAction(formData: FormData) { await runCommand(formData, "gallery_items", "archive"); }
