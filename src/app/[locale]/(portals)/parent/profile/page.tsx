import { notFound } from "next/navigation";
import { ParentProfilePage } from "@/components/portal/profile-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getParentPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/parent/profile`;
  const [dictionary, access] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.PROFILE_UPDATE_OWN, path)]);
  return <ParentProfilePage locale={locale} snapshot={await getParentPortalSnapshot(access)} dictionary={dictionary} />;
}
