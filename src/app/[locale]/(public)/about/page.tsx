import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CalendarClockIcon,
  CheckIcon,
  CircleUserRoundIcon,
  ClipboardCheckIcon,
  Globe2Icon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  LineChartIcon,
  MonitorPlayIcon,
  RouteIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { aboutPageCopy as copy } from "@/content/about-page";
import { isLocale } from "@/i18n/config";

const reasonIcons = [
  GraduationCapIcon,
  CircleUserRoundIcon,
  CalendarClockIcon,
  RouteIcon,
  ClipboardCheckIcon,
  UsersRoundIcon,
] as const;

const differenceIcons = [
  SparklesIcon,
  LineChartIcon,
  HeartHandshakeIcon,
  Globe2Icon,
] as const;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SHIA TALEEM's mission, teaching approach, one-to-one online Quran classes, and Islamic education for families worldwide.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <main id="main-content" dir="ltr">
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <Image
          src="/images/shia-taleem-hero-learning.png"
          alt="A student learning the Quran in a live online lesson"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/30" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {copy.hero.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/80 sm:text-lg">
              {copy.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-8">
          <div className="relative min-h-[25rem] overflow-hidden rounded-[2rem] bg-muted sm:min-h-[34rem]">
            <Image
              src="/images/hero-online-class.png"
              alt="An online Quran lesson connecting a student and teacher"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="space-y-5 text-base leading-8 text-muted-foreground">
              {copy.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="my-10 h-px bg-border" />
            <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {copy.modernApproach.title}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground">
              {copy.modernApproach.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-warm-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {copy.reasons.title}
            </h2>
          </div>
          <div className="mt-12 grid border-t border-primary/15 md:grid-cols-2 lg:grid-cols-3">
            {copy.reasons.items.map((item, index) => {
              const Icon = reasonIcons[index];
              return (
                <article
                  key={item.title}
                  className="border-b border-primary/15 py-9 md:px-8 md:odd:border-r lg:border-r lg:px-9 lg:[&:nth-child(3n)]:border-r-0"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sidebar py-20 text-sidebar-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {copy.differences.title}
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-sidebar-border md:grid-cols-2 lg:grid-cols-4">
            {copy.differences.items.map((item, index) => {
              const Icon = differenceIcons[index];
              return (
                <article key={item.title} className="bg-sidebar p-7 sm:p-9">
                  <Icon className="size-7 text-gold" aria-hidden="true" />
                  <h3 className="mt-7 font-heading text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-sidebar-foreground/65">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          {[copy.mission, copy.vision].map((section, index) => (
            <article key={section.title} className="relative border-t-2 border-primary pt-8">
              {index === 0 ? (
                <ShieldCheckIcon className="size-8 text-primary" aria-hidden="true" />
              ) : (
                <MonitorPlayIcon className="size-8 text-primary" aria-hidden="true" />
              )}
              <h2 className="mt-7 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {section.title}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-warm-surface py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:px-8">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {copy.digital.title}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground">
              {copy.digital.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 border-s-2 border-gold ps-6">
              <h3 className="font-heading text-2xl font-semibold">
                {copy.digital.actionTitle}
              </h3>
              <p className="mt-2 max-w-xl leading-7 text-muted-foreground">
                {copy.digital.actionDescription}
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href={`/${locale}/free-trial`}>
                  {copy.digital.action}
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[27rem] overflow-hidden rounded-[2rem] bg-muted sm:min-h-[36rem]">
            <Image
              src="/images/shia-taleem-female-teacher.png"
              alt="A qualified Quran teacher leading an online class"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-8">
          <div>
            <BookOpenCheckIcon className="size-10 text-primary" aria-hidden="true" />
            <h2 className="mt-7 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              {copy.foundations.title}
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {copy.foundations.description}
            </p>
            <p className="mt-4 text-base font-medium leading-8">
              {copy.foundations.lead}
            </p>
          </div>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {copy.foundations.steps.map((step) => (
                <li
                  key={step}
                  className="flex min-h-16 items-center gap-3 rounded-xl border bg-warm-surface px-5 py-4 text-sm font-medium"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-4" aria-hidden="true" />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
            <p className="mt-7 rounded-2xl bg-primary px-6 py-5 text-sm leading-7 text-primary-foreground sm:text-base">
              {copy.foundations.conclusion}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t bg-warm-surface py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {copy.faq.title}
          </h2>
          <Accordion type="single" collapsible className="mt-10 border-t border-border/80">
            {copy.faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={`about-faq-${index}`}>
                <AccordionTrigger className="min-h-20 py-5 text-start text-base hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-20">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {copy.digital.actionTitle}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-primary-foreground/75">
              {copy.digital.actionDescription}
            </p>
          </div>
          <Button size="xl" variant="gold" asChild>
            <Link href={`/${locale}/free-trial`}>
              {copy.digital.action}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
