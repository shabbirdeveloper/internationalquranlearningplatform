import { notFound } from "next/navigation";

import { PricingAdmin } from "@/components/portal/pricing-admin";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { requirePermission } from "@/server/authorization/access";
import { getAdminPricingData } from "@/server/repositories/pricing-repository";

export default async function AdminPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requirePermission(locale, PERMISSIONS.CONTENT_MANAGE, `/${locale}/admin/pricing`);
  const data = await getAdminPricingData();
  return <PricingAdmin locale={locale} data={data} />;
}
