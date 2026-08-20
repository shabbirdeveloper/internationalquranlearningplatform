import { notFound } from "next/navigation";
import { StudentProfilePage } from "@/components/portal/profile-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getStudentPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/student/profile`;
  const [dictionary, access] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.PROFILE_UPDATE_OWN, path)]);
  return <StudentProfilePage locale={locale} snapshot={await getStudentPortalSnapshot(access)} dictionary={dictionary} />;
}
