import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LanguagesIcon,
  MonitorPlayIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

import { CourseShareButton } from "@/components/public-site/course-share-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Course, PublicCopy } from "@/content/public-pages";
import type { Locale } from "@/i18n/config";

const sectionLinks = [
  ["overview", "Overview"],
  ["experience", "Learning experience"],
  ["benefits", "Benefits"],
  ["curriculum", "Curriculum"],
] as const;

export function CourseDetail({ course, locale, copy }: { course: Course; locale: Locale; copy: PublicCopy }) {
  const facts = [
    { icon: UsersIcon, label: course.ageGroup },
    { icon: MonitorPlayIcon, label: course.classType },
    { icon: Clock3Icon, label: course.duration },
    { icon: LanguagesIcon, label: course.languages.join(" · ") },
  ];

  return (
    <>
      <section className="public-page-hero-pattern relative overflow-hidden border-b border-sidebar-border text-sidebar-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.86fr)] lg:px-8 lg:py-20">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-sidebar-foreground/65">
              <Link href={`/${locale}`}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/${locale}/courses`}>Courses</Link>
              <span aria-hidden="true">/</span>
              <span className="text-sidebar-foreground">{course.title}</span>
            </nav>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline" className="border-sidebar-border text-sidebar-foreground">{course.level}</Badge>
            </div>
            <h1 className="max-w-3xl font-heading text-4xl leading-[1.05] font-semibold tracking-[-0.045em] sm:text-6xl">{course.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-sidebar-foreground/75 sm:text-lg sm:leading-8">{course.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href={`/${locale}/free-trial?course=${course.slug}`}>
                  {copy.labels.bookCourseTrial}
                  <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" asChild>
                <Link href={`/${locale}/courses`}>
                  <ArrowLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
                  {copy.labels.backCourses}
                </Link>
              </Button>
            </div>
          </div>
          <div data-premium-hover="media" className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-sidebar-border bg-sidebar-accent shadow-2xl shadow-black/25">
            <Image src={course.coverImage} alt={`${course.title} live online course`} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className={course.coverImage.includes("quran-trial-art") ? "object-contain p-8" : "object-cover"} />
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-primary to-gold" />
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {sectionLinks.map(([href, label]) => (
            <Button key={href} variant="ghost" size="sm" asChild>
              <a href={`#${href}`}>{label}</a>
            </Button>
          ))}
          <div className="ms-auto shrink-0"><CourseShareButton title={course.title} label="Share course" /></div>
        </div>
      </div>

      <section id="overview" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-16 text-center sm:px-6 lg:py-24">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><BookOpenCheckIcon aria-hidden="true" /></div>
        <h2 className="mx-auto mt-6 max-w-3xl font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{course.overviewHeading}</h2>
        <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">{course.description}</p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, label }) => (
            <div key={label} data-premium-hover="row" className="flex items-center gap-3 bg-background px-5 py-5 text-start">
              <span data-hover-icon className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary"><Icon aria-hidden="true" /></span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="scroll-mt-28 bg-warm-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div data-premium-hover="media" className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl shadow-foreground/10">
            <Image src={course.detailImage} alt={`Teacher guiding a learner in ${course.title}`} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-7">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{course.guidanceHeading}</h2>
              <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{course.guidanceBody}</p>
            </div>
            <div className="border-s-2 border-gold ps-6">
              <h3 className="font-heading text-2xl font-semibold">{course.audienceHeading}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{course.audienceBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{course.benefitsHeading}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Practical support that makes learning consistent, personal, and spiritually meaningful.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {course.benefits.map((benefit, index) => (
            <Card key={benefit} data-premium-interactive="true" className="h-full">
              <CardHeader>
                <div data-hover-number className="flex size-10 items-center justify-center rounded-full bg-gold font-semibold text-sidebar">{String(index + 1).padStart(2, "0")}</div>
                <CardTitle className="mt-5 text-lg leading-7">{benefit}</CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-warm-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-8 lg:py-24">
          <div className="lg:order-2" data-premium-hover="media">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] shadow-xl shadow-foreground/10">
              <Image src={course.methodImage} alt={`Structured study and review for ${course.title}`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:order-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><SparklesIcon aria-hidden="true" /></div>
            <h2 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{course.methodHeading}</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{course.methodBody}</p>
          </div>
        </div>
      </section>

      <section id="curriculum" className="mx-auto grid max-w-7xl scroll-mt-28 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{copy.labels.outcomes}</CardTitle>
            <CardDescription>Clear capabilities the learner will build through guided lessons and revision.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {course.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/45 p-4">
                <CheckCircle2Icon className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span className="leading-7">{outcome}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{copy.labels.syllabus}</CardTitle>
            <CardDescription>Open each stage to see how the learning journey is structured.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="stage-0" className="gap-3">
              {course.syllabus.map((stage, index) => (
                <AccordionItem key={stage} value={`stage-${index}`} className="overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-accent/65 px-4 text-sidebar-foreground">
                  <AccordionTrigger className="text-sidebar-foreground hover:no-underline"><span className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full border border-sidebar-border text-sm text-gold">{index + 1}</span>{stage}</span></AccordionTrigger>
                  <AccordionContent className="ps-11 text-sidebar-foreground/70">Your teacher adapts this stage to the learner&apos;s level, pace, and progress before moving to the next milestone.</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <section className="public-page-hero-pattern border-y border-sidebar-border text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-16">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Ready to begin {course.title}?</h2>
            <p className="mt-3 max-w-2xl text-sidebar-foreground/70">Meet a suitable teacher, discuss your goals, and experience a live lesson before choosing your learning plan.</p>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/${locale}/free-trial?course=${course.slug}`}>{copy.labels.bookCourseTrial}<ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
