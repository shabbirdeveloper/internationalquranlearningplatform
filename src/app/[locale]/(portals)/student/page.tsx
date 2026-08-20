import { notFound } from "next/navigation";

import { StudentDashboard } from "@/components/portal/role-dashboards";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getStudentPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function StudentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}/student`;
  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    requirePermission(localeValue, PERMISSIONS.PORTAL_STUDENT_VIEW, requestedPath),
  ]);
  const snapshot = await getStudentPortalSnapshot(access);

  return <StudentDashboard locale={localeValue} access={access} snapshot={snapshot} dictionary={dictionary} />;
}
