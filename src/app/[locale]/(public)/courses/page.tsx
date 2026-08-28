import { notFound } from "next/navigation";

import { CourseMarketplace } from "@/components/public-site/course-marketplace";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";
import { getPublicCourses } from "@/server/repositories/public-site-repository";

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [catalog] = await Promise.all([getPublicCourses()]);
  const copy = getPublicCopy(locale);
  return <main id="main-content"><PublicPageHero eyebrow={copy.hero.courses[0]} title={copy.hero.courses[1]} description={copy.hero.courses[2]}/><CourseMarketplace locale={locale} courses={catalog} copy={copy}/></main>;
}
