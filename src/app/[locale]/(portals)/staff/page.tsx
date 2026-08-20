import { notFound } from "next/navigation";

import { StaffDashboard } from "@/components/portal/role-dashboards";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getStaffPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function StaffPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}/staff`;
  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    requirePermission(localeValue, PERMISSIONS.PORTAL_STAFF_VIEW, requestedPath),
  ]);
  const snapshot = await getStaffPortalSnapshot(access);

  return <StaffDashboard locale={localeValue} access={access} snapshot={snapshot} dictionary={dictionary} />;
}
