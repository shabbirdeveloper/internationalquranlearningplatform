import { notFound } from "next/navigation";

import { CourseMarketplace } from "@/components/public-site/course-marketplace";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { courses, getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = getPublicCopy(locale);
  return <main id="main-content"><PublicPageHero eyebrow={copy.hero.courses[0]} title={copy.hero.courses[1]} description={copy.hero.courses[2]}/><CourseMarketplace locale={locale} courses={courses} copy={copy}/></main>;
}
