import { notFound } from "next/navigation";
import { AdminPeopleHub } from "@/components/portal/admin-phase-two-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/admin/people`;
  const [dictionary] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.USERS_READ, path)]);
  return <AdminPeopleHub locale={locale} dictionary={dictionary} />;
}
