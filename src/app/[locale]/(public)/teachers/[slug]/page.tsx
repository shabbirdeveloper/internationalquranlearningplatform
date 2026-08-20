import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";

import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";
import { getPublicTeacher } from "@/server/repositories/public-site-repository";

export default async function TeacherDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const teacher = await getPublicTeacher(slug); if (!teacher) notFound(); const copy = getPublicCopy(locale); return <main id="main-content"><PublicPageHero eyebrow={copy.hero.teachers[0]} title={teacher.display_name} description={teacher.headline} actions={<Button variant="secondary" asChild><Link href={`/${locale}/free-trial`}>{copy.labels.choosePlan}</Link></Button>}/><section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:px-8"><Card><CardHeader><CardTitle>{copy.labels.biography}</CardTitle></CardHeader><CardContent className="leading-8 text-muted-foreground">{teacher.biography}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2Icon className="size-5 text-primary"/>Verified public profile</CardTitle></CardHeader><CardContent className="space-y-5"><div className="flex flex-wrap gap-2">{[...teacher.subjects,...teacher.languages,...teacher.age_groups].map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div>{teacher.years_experience !== null ? <p>{teacher.years_experience} years of teaching experience</p> : null}{teacher.availability_summary ? <p>{teacher.availability_summary}</p> : null}</CardContent></Card></section></main>; }
