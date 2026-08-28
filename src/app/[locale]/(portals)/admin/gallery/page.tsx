import { notFound } from "next/navigation";

import { GalleryAdmin } from "@/components/portal/content-library-admin";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { requirePermission } from "@/server/authorization/access";
import { getAdminGalleryItems } from "@/server/repositories/content-library-repository";

export default async function AdminGalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requirePermission(locale, PERMISSIONS.CONTENT_MANAGE, `/${locale}/admin/gallery`);
  const items = await getAdminGalleryItems();
  return <GalleryAdmin locale={locale} items={items} />;
}
