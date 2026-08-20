import { notFound } from "next/navigation";

import { ParentDashboard } from "@/components/portal/role-dashboards";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getParentPortalSnapshot } from "@/server/repositories/portal-repository";

export default async function ParentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}/parent`;
  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    requirePermission(localeValue, PERMISSIONS.PORTAL_PARENT_VIEW, requestedPath),
  ]);
  const snapshot = await getParentPortalSnapshot(access);

  return <ParentDashboard locale={localeValue} access={access} snapshot={snapshot} dictionary={dictionary} />;
}
