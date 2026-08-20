import { notFound } from "next/navigation";
import { ParentLinkReviewPage } from "@/components/portal/admin-phase-two-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getPendingParentLinks } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/admin/parent-links`;
  const [dictionary] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.PARENT_LINKS_REVIEW, path)]);
  return <ParentLinkReviewPage locale={locale} links={await getPendingParentLinks()} dictionary={dictionary} />;
}
