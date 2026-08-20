import { notFound } from "next/navigation";

import { AdminDashboard } from "@/components/portal/admin-dashboard";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getAdminSummary } from "@/server/repositories/portal-repository";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeValue } = await params;
  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}/admin`;
  const [dictionary] = await Promise.all([
    getDictionary(localeValue),
    requirePermission(localeValue, PERMISSIONS.PORTAL_ADMIN_VIEW, requestedPath),
  ]);
  const summary = await getAdminSummary();

  return <AdminDashboard locale={localeValue} summary={summary} dictionary={dictionary} />;
}
