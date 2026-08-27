import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CheckIcon,
  ClipboardCheckIcon,
  HeartHandshakeIcon,
  MessageCircleMoreIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const teacherStandardIcons = [
  BookOpenCheckIcon,
  UserRoundCheckIcon,
  MessageCircleMoreIcon,
  HeartHandshakeIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
];

export function HomeTrust({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <>
      <section id="teachers" className="border-b border-border/70 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
          <div data-premium-hover="media" className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-muted shadow-2xl shadow-foreground/10 sm:min-h-[30rem]">
            <Image
              src="/images/shia-taleem-female-teacher.png"
              alt={dictionary.home.teachersTitle}
              fill
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {dictionary.home.teachersTitle}
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              {dictionary.home.teachersDescription}
            </p>

            <h3 className="mt-10 font-heading text-lg font-semibold tracking-tight">
              {dictionary.home.learnerTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {dictionary.home.learnerDescription}
            </p>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border/80 bg-border/80 sm:grid-cols-2">
              {dictionary.home.learnerPoints.map((point, index) => {
                const Icon = teacherStandardIcons[index] ?? ShieldCheckIcon;
                return (
                  <div key={point} data-premium-hover="row" className="flex min-h-24 items-center gap-4 bg-background p-5">
                    <span data-hover-icon className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warm-surface text-primary">
                      <Icon aria-hidden="true" />
                    </span>
                    <p className="font-heading text-sm font-semibold tracking-tight">{point}</p>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" size="lg" className="mt-8" asChild>
              <Link href={`/${locale}/free-trial`}>
                {dictionary.home.viewAllTeachers}
                <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-sidebar py-20 text-sidebar-foreground sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-8">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {dictionary.home.pricingTitle}
            </h2>
            <p className="mt-5 leading-7 text-sidebar-foreground/65">
              {dictionary.home.planDescription}
            </p>
          </div>

          <Card className="gap-7 bg-background py-8 text-foreground ring-white/10 shadow-2xl shadow-black/20">
            <CardHeader className="gap-3 px-7 sm:px-9">
              <CardTitle className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                {dictionary.home.planTitle}
              </CardTitle>
              <CardDescription className="leading-7">
                {dictionary.home.planDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-7 sm:px-9">
              <Separator />
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {dictionary.home.planFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon aria-hidden="true" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-7 sm:px-9">
              <Button size="xl" className="w-full sm:w-auto" asChild>
                <Link href={`/${locale}/free-trial`}>
                  {dictionary.home.viewPricing}
                  <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
