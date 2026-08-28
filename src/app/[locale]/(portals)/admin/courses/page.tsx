import { notFound } from "next/navigation";

import { CourseAdmin } from "@/components/portal/course-admin";
import { PERMISSIONS } from "@/config/permissions";
import { isLocale } from "@/i18n/config";
import { requirePermission } from "@/server/authorization/access";
import { getAdminCourses } from "@/server/repositories/portal-repository";

export default async function AdminCoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [, courses] = await Promise.all([
    requirePermission(locale, PERMISSIONS.COURSES_MANAGE, `/${locale}/admin/courses`),
    getAdminCourses(),
  ]);
  return <CourseAdmin locale={locale} courses={courses} />;
}
