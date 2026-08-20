import { notFound } from "next/navigation";
import { TeacherReviewPage } from "@/components/portal/admin-phase-two-pages";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requirePermission } from "@/server/authorization/access";
import { getTeacherReviewQueue } from "@/server/repositories/portal-repository";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const path = `/${locale}/admin/teachers`;
  const [dictionary] = await Promise.all([getDictionary(locale), requirePermission(locale, PERMISSIONS.TEACHER_APPLICATIONS_REVIEW, path)]);
  return <TeacherReviewPage locale={locale} applications={await getTeacherReviewQueue()} dictionary={dictionary} />;
}
