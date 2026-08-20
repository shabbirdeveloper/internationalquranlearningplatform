import { notFound } from "next/navigation";
import { TeacherProfilePage } from "@/components/portal/profile-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getTeacherPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/teacher/profile`;
  const [dictionary, access] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.PROFILE_UPDATE_OWN, path)]);
  return <TeacherProfilePage locale={locale} snapshot={await getTeacherPortalSnapshot(access)} dictionary={dictionary} />;
}
