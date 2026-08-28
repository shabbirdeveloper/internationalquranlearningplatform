"use client";

import Link from "next/link";
import { BookOpenIcon, ExternalLinkIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useActionState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveCourseAction, type PortalActionState } from "@/features/portal/actions";
import type { Locale } from "@/i18n/config";
import type { AdminCourse } from "@/server/repositories/portal-repository";

const initialState: PortalActionState = {};

type EditableCourse = Partial<AdminCourse>;

function ActionMessage({ state }: { state: PortalActionState }) {
  if (state.success) return <Alert><AlertDescription>Course content saved and the public pages were refreshed.</AlertDescription></Alert>;
  if (state.errorCode) return <Alert variant="destructive"><AlertDescription>The course could not be saved. Check the required fields and confirm the course-content migration has been run in Supabase.</AlertDescription></Alert>;
  return null;
}

function InputField({ name, label, value, error, type = "text", description }: { name: string; label: string; value?: string | number; error?: string; type?: string; description?: string }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={`${name}-${String(value ?? "new").slice(0, 12)}`}>{label}</FieldLabel>
      <Input id={`${name}-${String(value ?? "new").slice(0, 12)}`} name={name} type={type} defaultValue={value ?? ""} aria-invalid={Boolean(error)} required />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

function TextareaField({ name, label, value, error, rows = 4, description }: { name: string; label: string; value?: string; error?: string; rows?: number; description?: string }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={`${name}-${value?.slice(0, 12) ?? "new"}`}>{label}</FieldLabel>
      <Textarea id={`${name}-${value?.slice(0, 12) ?? "new"}`} name={name} defaultValue={value ?? ""} rows={rows} aria-invalid={Boolean(error)} required />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

function lines(value?: string[]): string {
  return value?.join("\n") ?? "";
}

function CourseEditorForm({ locale, course }: { locale: Locale; course?: EditableCourse }) {
  const [state, action, pending] = useActionState(saveCourseAction, initialState);
  const error = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={action} className="flex flex-col gap-7 py-2">
      <input type="hidden" name="locale" value={locale} />
      {course?.id ? <input type="hidden" name="id" value={course.id} /> : null}
      <ActionMessage state={state} />

      <FieldSet>
        <FieldLegend>Course basics</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <InputField name="title" label="Course title" value={course?.title} error={error("title")} />
          <InputField name="slug" label="URL slug" value={course?.slug} error={error("slug")} description="Lowercase words separated with hyphens." />
          <InputField name="category" label="Category" value={course?.category} error={error("category")} />
          <InputField name="level" label="Level" value={course?.level} error={error("level")} />
          <InputField name="ageGroup" label="Age group" value={course?.ageGroup} error={error("ageGroup")} />
          <InputField name="classType" label="Class type" value={course?.classType ?? "One-to-one"} error={error("classType")} />
          <InputField name="durationMinutes" label="Lesson duration (minutes)" value={course ? Number.parseInt(course.duration ?? "30", 10) : 30} error={error("durationMinutes")} type="number" />
          <TextareaField name="languages" label="Languages" value={lines(course?.languages)} error={error("languages")} rows={3} description="One language per line." />
        </FieldGroup>
        <TextareaField name="summary" label="Short catalog summary" value={course?.summary} error={error("summary")} rows={3} />
        <Field orientation="horizontal">
          <Checkbox id={`published-${course?.id ?? "new"}`} name="isPublished" defaultChecked={course?.isPublished ?? false} />
          <FieldLabel htmlFor={`published-${course?.id ?? "new"}`}>Publish this course on the website</FieldLabel>
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Course images</FieldLegend>
        <FieldDescription>Choose assets already saved in the public/images folder. These three images appear in the catalog, learning section, and methodology section.</FieldDescription>
        <FieldGroup className="grid gap-5 lg:grid-cols-3">
          <InputField name="coverImage" label="Cover image path" value={course?.coverImage ?? "/images/hero-online-class.png"} error={error("coverImage")} description="Example: /images/hero-online-class.png" />
          <InputField name="detailImage" label="Guidance image path" value={course?.detailImage ?? "/images/shia-taleem-hero-learning.png"} error={error("detailImage")} />
          <InputField name="methodImage" label="Method image path" value={course?.methodImage ?? "/images/shia-taleem-female-teacher.png"} error={error("methodImage")} />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Overview and guidance</FieldLegend>
        <FieldGroup>
          <InputField name="overviewHeading" label="Overview heading" value={course?.overviewHeading} error={error("overviewHeading")} />
          <TextareaField name="description" label="Complete course introduction" value={course?.description} error={error("description")} rows={6} />
          <InputField name="guidanceHeading" label="Guidance section heading" value={course?.guidanceHeading} error={error("guidanceHeading")} />
          <TextareaField name="guidanceBody" label="Guidance section content" value={course?.guidanceBody} error={error("guidanceBody")} rows={6} />
          <InputField name="audienceHeading" label="Audience section heading" value={course?.audienceHeading} error={error("audienceHeading")} />
          <TextareaField name="audienceBody" label="Who should join" value={course?.audienceBody} error={error("audienceBody")} rows={5} />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Benefits and teaching method</FieldLegend>
        <FieldGroup>
          <InputField name="benefitsHeading" label="Benefits heading" value={course?.benefitsHeading} error={error("benefitsHeading")} />
          <TextareaField name="benefits" label="Benefits" value={lines(course?.benefits)} error={error("benefits")} rows={7} description="One benefit per line." />
          <InputField name="methodHeading" label="Teaching method heading" value={course?.methodHeading} error={error("methodHeading")} />
          <TextareaField name="methodBody" label="Teaching method content" value={course?.methodBody} error={error("methodBody")} rows={6} />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Outcomes and curriculum</FieldLegend>
        <FieldGroup className="grid gap-5 lg:grid-cols-2">
          <TextareaField name="outcomes" label="Learning outcomes" value={lines(course?.outcomes)} error={error("outcomes")} rows={7} description="One outcome per line." />
          <TextareaField name="syllabus" label="Curriculum stages" value={lines(course?.syllabus)} error={error("syllabus")} rows={7} description="One stage per line." />
        </FieldGroup>
      </FieldSet>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}><SaveIcon data-icon="inline-start" />{pending ? "Saving…" : course?.id ? "Save course changes" : "Create course"}</Button>
        {course?.slug ? <Button variant="outline" asChild><Link href={`/${locale}/courses/${course.slug}`} target="_blank">Preview course<ExternalLinkIcon data-icon="inline-end" /></Link></Button> : null}
      </div>
    </form>
  );
}

export function CourseAdmin({ locale, courses }: { locale: Locale; courses: AdminCourse[] }) {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><BookOpenIcon aria-hidden="true" /></div>
          <CardTitle className="text-2xl">Course content</CardTitle>
          <CardDescription>Create courses and manage every part of the public detail page, including images, long-form content, benefits, outcomes, and curriculum.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="new-course">
              <AccordionTrigger><span className="flex items-center gap-3"><PlusIcon aria-hidden="true" />Add a new course</span></AccordionTrigger>
              <AccordionContent><CourseEditorForm locale={locale} /></AccordionContent>
            </AccordionItem>
            {courses.map((course) => (
              <AccordionItem key={course.id} value={course.id}>
                <AccordionTrigger>
                  <span className="flex min-w-0 flex-1 items-center gap-3 pe-3 text-start">
                    <span className="truncate">{course.title}</span>
                    <Badge variant={course.isPublished ? "default" : "secondary"}>{course.isPublished ? "Published" : "Draft"}</Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent><CourseEditorForm locale={locale} course={course} /></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
