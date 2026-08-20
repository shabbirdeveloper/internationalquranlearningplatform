import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses, getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";

export function generateStaticParams() { return courses.map(({ slug }) => ({ slug })); }
export default async function CourseDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const course = courses.find((item) => item.slug === slug); if (!course) notFound(); const copy = getPublicCopy(locale);
  return <main id="main-content"><PublicPageHero eyebrow={course.category} title={course.title} description={course.summary} actions={<><Button variant="secondary" size="lg" asChild><Link href={`/${locale}/free-trial?course=${course.slug}`}>{copy.labels.bookCourseTrial}</Link></Button><Button variant="outline" size="lg" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild><Link href={`/${locale}/courses`}><ArrowLeftIcon data-icon="inline-start" className="rtl:rotate-180"/>{copy.labels.backCourses}</Link></Button></>}/><section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20"><div><div className="mb-8 flex flex-wrap gap-2">{[course.level, course.ageGroup, course.classType, course.duration, ...course.languages].map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div><Card><CardHeader><CardTitle>{copy.labels.outcomes}</CardTitle></CardHeader><CardContent><ul className="space-y-4">{course.outcomes.map((item) => <li key={item} className="flex gap-3"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><CheckIcon className="size-3.5"/></span><span>{item}</span></li>)}</ul></CardContent></Card></div><Card><CardHeader><CardTitle>{copy.labels.syllabus}</CardTitle></CardHeader><CardContent><ol className="space-y-5">{course.syllabus.map((item,index) => <li key={item} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 font-semibold text-primary">{index + 1}</span><span className="pt-1">{item}</span></li>)}</ol></CardContent></Card></section></main>;
}
