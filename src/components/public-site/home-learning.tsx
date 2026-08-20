import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookMarkedIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartNoAxesColumnIncreasingIcon,
  HeartHandshakeIcon,
  LibraryBigIcon,
  MessageCircleMoreIcon,
  UserRoundIcon,
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

const benefitIcons = [UserRoundIcon, HeartHandshakeIcon, CalendarDaysIcon, ChartNoAxesColumnIncreasingIcon];
const courseIcons = [BookOpenIcon, LibraryBigIcon, MessageCircleMoreIcon, BookMarkedIcon, BookOpenIcon, HeartHandshakeIcon];

export function HomeLearning({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const featuredCourses = dictionary.home.courses.slice(0, 2);
  const additionalCourses = dictionary.home.courses.slice(2);

  return (
    <>
      <section className="border-b border-border/70 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {dictionary.home.safetyTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {dictionary.home.safetyDescription}
            </p>
          </div>

          <div className="border-t border-border/80">
            {dictionary.home.safetyItems.map((item, index) => {
              const Icon = benefitIcons[index] ?? UserRoundIcon;
              return (
                <article
                  key={item.title}
                  className="group grid grid-cols-[auto_1fr] gap-4 border-b border-border/80 py-6 transition-transform duration-300 hover:-translate-y-0.5 sm:grid-cols-[auto_0.55fr_1fr] sm:items-center sm:gap-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-warm-surface text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3 className="font-heading font-semibold tracking-tight">{item.title}</h3>
                  <p className="col-start-2 text-sm leading-6 text-muted-foreground sm:col-start-3">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="courses" className="border-b border-border/70 bg-warm-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                {dictionary.home.popularCoursesTitle}
              </h2>
            </div>
            <Button variant="outline" size="lg" className="w-fit bg-background" asChild>
              <Link href={`/${locale}/free-trial`}>
                {dictionary.home.viewAllCourses}
                <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {featuredCourses.map((course, index) => {
              const Icon = courseIcons[index] ?? BookOpenIcon;
              return (
                <Card
                  key={course.title}
                  data-premium-interactive="true"
                  className="group gap-7 bg-background py-7 ring-primary/10 hover:ring-primary/25"
                >
                  <CardHeader className="gap-5 px-7 sm:px-8">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-sm leading-6">
                        {course.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-7 sm:px-8">
                    <Separator />
                  </CardContent>
                  <CardFooter className="px-7 sm:px-8">
                    <Button variant="ghost" className="px-0 text-primary" asChild>
                      <Link href={`/${locale}/free-trial`}>
                        {dictionary.common.bookTrial}
                        <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 grid border-t border-border/80 md:grid-cols-2 md:gap-x-10">
            {additionalCourses.map((course, index) => {
              const Icon = courseIcons[index + 2] ?? BookOpenIcon;
              return (
                <Link
                  key={course.title}
                  href={`/${locale}/free-trial`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border/80 py-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-background text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-heading font-semibold tracking-tight">{course.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{course.description}</span>
                  </span>
                  <ArrowRightIcon className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid min-h-80 max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_0.55fr] lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {dictionary.home.trialTitle}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-primary-foreground/75">
              {dictionary.home.trialDescription}
            </p>
            <Button size="xl" variant="gold" className="mt-7" asChild>
              <Link href={`/${locale}/free-trial`}>
                {dictionary.common.bookTrial}
                <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
            <Image
              src="/images/quran-trial-art.png"
              alt=""
              fill
              sizes="384px"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
}
