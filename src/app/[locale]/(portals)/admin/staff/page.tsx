import { notFound } from "next/navigation";
import { StaffDirectoryPage } from "@/components/portal/admin-phase-two-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getStaffDirectory } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/admin/staff`;
  const [dictionary] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.STAFF_MANAGE, path)]);
  return <StaffDirectoryPage locale={locale} directory={await getStaffDirectory()} dictionary={dictionary} />;
}
