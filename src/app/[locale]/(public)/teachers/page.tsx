import Link from "next/link";
import { UserRoundSearchIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";
import { getPublicTeachers } from "@/server/repositories/public-site-repository";

export default async function TeachersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = getPublicCopy(locale); const teachers = await getPublicTeachers();
  return <main id="main-content"><PublicPageHero eyebrow={copy.hero.teachers[0]} title={copy.hero.teachers[1]} description={copy.hero.teachers[2]} actions={<Button variant="secondary" size="lg" asChild><Link href={`/${locale}/become-a-tutor`}>{copy.labels.apply}</Link></Button>}/><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">{teachers.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{teachers.map((teacher) => <Card key={teacher.teacher_user_id}><CardHeader><Avatar size="lg"><AvatarFallback>{teacher.display_name.split(/\s+/).map((part) => part[0]).join("").slice(0,2)}</AvatarFallback></Avatar><CardTitle className="mt-4 text-2xl">{teacher.display_name}</CardTitle><CardDescription>{teacher.headline}</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{[...teacher.subjects, ...teacher.languages].map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div></CardContent><CardFooter><Button asChild className="w-full"><Link href={`/${locale}/teachers/${teacher.slug}`}>{copy.labels.viewCourse}</Link></Button></CardFooter></Card>)}</div> : <Empty className="min-h-80 rounded-2xl border bg-card"><EmptyHeader><EmptyMedia variant="icon"><UserRoundSearchIcon/></EmptyMedia><EmptyTitle>{copy.labels.noTeachers}</EmptyTitle><EmptyDescription>{copy.labels.noTeachersDescription}</EmptyDescription></EmptyHeader><Button asChild><Link href={`/${locale}/become-a-tutor`}>{copy.labels.apply}</Link></Button></Empty>}</section></main>;
}
