import { notFound } from "next/navigation";

import { TeacherDashboard } from "@/components/portal/role-dashboards";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getTeacherPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function TeacherPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}/teacher`;
  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    requirePermission(localeValue, PERMISSIONS.PORTAL_TEACHER_VIEW, requestedPath),
  ]);
  const snapshot = await getTeacherPortalSnapshot(access);

  return <TeacherDashboard locale={localeValue} access={access} snapshot={snapshot} dictionary={dictionary} />;
}
