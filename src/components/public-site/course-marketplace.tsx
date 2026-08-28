"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  Clock3Icon,
  LanguagesIcon,
  MonitorPlayIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course, PublicCopy } from "@/content/public-pages";
import type { Locale } from "@/i18n/config";

const photoCoverClass =
  "object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.035]";
const illustrationCoverClass =
  "object-contain p-7 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.045] sm:p-8";

function values(courses: Course[], key: "category" | "level" | "ageGroup" | "classType") {
  return [...new Set(courses.map((course) => course[key]))];
}

function CourseCard({
  locale,
  course,
  viewCourseLabel,
}: {
  locale: Locale;
  course: Course;
  viewCourseLabel: string;
}) {
  const illustration = course.coverImage.includes("quran-trial-art");
  const metadata = [
    { label: course.ageGroup, icon: UsersIcon },
    { label: course.classType, icon: MonitorPlayIcon },
    { label: course.duration, icon: Clock3Icon },
    { label: course.languages.join(" · "), icon: LanguagesIcon },
  ];

  return (
    <Card
      data-premium-interactive="true"
      data-course-card={course.slug}
      className="group h-full overflow-hidden py-0 ring-border/90 hover:ring-primary/30"
    >
      <div
        data-course-cover
        className={`relative aspect-[16/9] overflow-hidden ${illustration ? "bg-warm-surface" : "bg-muted"}`}
      >
        <Image
          src={course.coverImage}
          alt={`${course.title} course`}
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
          className={illustration ? illustrationCoverClass : `${photoCoverClass} object-center`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-primary to-gold"
        />
      </div>

      <CardHeader className="gap-3 px-6 pt-6">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-[-0.025em]">{course.title}</CardTitle>
        <CardDescription className="min-h-12 leading-6">{course.summary}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 border-t border-border/70 px-6 pt-5 text-sm text-muted-foreground sm:grid-cols-2">
        {metadata.map(({ label, icon: Icon }) => (
          <span key={label} className="flex min-w-0 items-start gap-2">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 leading-5">{label}</span>
          </span>
        ))}
      </CardContent>

      <CardFooter className="mt-auto border-0 bg-transparent px-6 pt-2 pb-6">
        <Button className="w-full" size="lg" asChild>
          <Link href={`/${locale}/courses/${course.slug}`}>
            {viewCourseLabel}
            <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CourseMarketplace({
  locale,
  courses,
  copy,
}: {
  locale: Locale;
  courses: Course[];
  copy: PublicCopy;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [age, setAge] = useState("all");
  const [classType, setClassType] = useState("all");
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return courses.filter((course) => {
      const matchesQuery = `${course.title} ${course.summary} ${course.category}`
        .toLowerCase()
        .includes(normalizedQuery);
      return (
        matchesQuery &&
        (category === "all" || course.category === category) &&
        (level === "all" || course.level === level) &&
        (age === "all" || course.ageGroup === age) &&
        (classType === "all" || course.classType === classType)
      );
    });
  }, [age, category, classType, courses, level, query]);
  const filters = [
    [copy.labels.category, category, setCategory, values(courses, "category")],
    [copy.labels.level, level, setLevel, values(courses, "level")],
    [copy.labels.age, age, setAge, values(courses, "ageGroup")],
    [copy.labels.classType, classType, setClassType, values(courses, "classType")],
  ] as const;

  function clear() {
    setQuery("");
    setCategory("all");
    setLevel("all");
    setAge("all");
    setClassType("all");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Card className="mb-12 border-primary/10 bg-warm-surface/70 shadow-sm">
        <CardContent className="p-5 sm:p-7">
          <FieldGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field>
              <FieldLabel htmlFor="course-search">{copy.labels.search}</FieldLabel>
              <div className="relative">
                <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="course-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="ps-9"
                />
              </div>
            </Field>
            {filters.map(([label, value, setValue, options]) => (
              <Field key={label}>
                <FieldLabel>{label}</FieldLabel>
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">{copy.labels.all}</SelectItem>
                      {options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            ))}
          </FieldGroup>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {copy.labels.results}
            </p>
            <Button variant="ghost" onClick={clear}>
              <SlidersHorizontalIcon data-icon="inline-start" />
              {copy.labels.clear}
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.slug}
              locale={locale}
              course={course}
              viewCourseLabel={copy.labels.viewCourse}
            />
          ))}
        </div>
      ) : (
        <Empty className="min-h-72 rounded-2xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>{copy.labels.notFound}</EmptyTitle>
            <EmptyDescription>{copy.labels.clear}</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={clear}>
            {copy.labels.clear}
          </Button>
        </Empty>
      )}
    </section>
  );
}
