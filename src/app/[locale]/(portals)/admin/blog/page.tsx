import { notFound } from "next/navigation";

import { BlogAdmin } from "@/components/portal/content-library-admin";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { requirePermission } from "@/server/authorization/access";
import { getAdminBlogPosts } from "@/server/repositories/content-library-repository";

export default async function AdminBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requirePermission(locale, PERMISSIONS.CONTENT_MANAGE, `/${locale}/admin/blog`);
  const posts = await getAdminBlogPosts();
  return <BlogAdmin locale={locale} posts={posts} />;
}

