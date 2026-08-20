import Link from "next/link";
import { ArrowRightIcon, GraduationCapIcon, UserRoundCheckIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";

function Journey({ title, steps, icon: Icon }: { title: string; steps: string[]; icon: typeof GraduationCapIcon }) { return <Card><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="size-5"/></span><CardTitle className="mt-4 text-2xl">{title}</CardTitle></CardHeader><CardContent><ol className="space-y-5">{steps.map((step,index) => <li key={step} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 font-semibold text-primary">{index + 1}</span><span className="pt-1 leading-6">{step}</span></li>)}</ol></CardContent></Card>; }
export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = getPublicCopy(locale); return <main id="main-content"><PublicPageHero eyebrow={copy.hero.how[0]} title={copy.hero.how[1]} description={copy.hero.how[2]}/><section className="mx-auto grid max-w-7xl gap-7 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"><Journey title={copy.labels.learnerJourney} steps={copy.howLearner} icon={GraduationCapIcon}/><Journey title={copy.labels.tutorJourney} steps={copy.howTutor} icon={UserRoundCheckIcon}/></section><section className="bg-primary px-4 py-16 text-center text-primary-foreground"><h2 className="font-heading text-3xl font-semibold">{copy.hero.trial[1]}</h2><Button className="mt-7" variant="secondary" size="lg" asChild><Link href={`/${locale}/free-trial`}>{copy.labels.choosePlan}<ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180"/></Link></Button></section></main>; }
