import { notFound } from "next/navigation";

import { CourseDetail } from "@/components/public-site/course-detail";
import { courses, getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";
import { getPublicCourse } from "@/server/repositories/public-site-repository";

export function generateStaticParams() {
  return courses.map(({ slug }) => ({ slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const course = await getPublicCourse(slug);
  if (!course) notFound();
  return <main id="main-content"><CourseDetail course={course} locale={locale} copy={getPublicCopy(locale)} /></main>;
}
