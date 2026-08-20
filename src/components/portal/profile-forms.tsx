"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  updateCoreProfileAction,
  updateParentProfileAction,
  updateStudentProfileAction,
  updateTeacherProfileAction,
  type PortalActionState,
} from "@/features/portal/actions";
import {
  coreProfileFormSchema,
  parentProfileFormSchema,
  studentProfileFormSchema,
  teacherProfileFormSchema,
  type CoreProfileFormInput,
  type ParentProfileFormInput,
  type StudentProfileFormInput,
  type TeacherProfileFormInput,
} from "@/features/portal/schemas";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type {
  CoreProfile,
  ParentProfile,
  StudentProfile,
  TeacherAvailability,
  TeacherProfile,
} from "@/server/repositories/portal-repository";

const initialState: PortalActionState = {};

function FormMessage({ state, dictionary }: { state: PortalActionState; dictionary: Dictionary }) {
  if (state.success) return <Alert><AlertDescription>{dictionary.portal.phase2.saved}</AlertDescription></Alert>;
  if (state.errorCode) return <Alert variant="destructive"><AlertDescription>{dictionary.portal.phase2.actionError}</AlertDescription></Alert>;
  return null;
}

function errorList(message?: string, server?: string[]) {
  if (message) return [{ message }];
  return server?.map((item) => ({ message: item }));
}

export function CoreProfileForm({
  locale,
  portal,
  profile,
  dictionary,
}: {
  locale: Locale;
  portal: "student" | "parent" | "teacher" | "staff" | "admin";
  profile: CoreProfile | null;
  dictionary: Dictionary;
}) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(updateCoreProfileAction, initialState);
  const form = useForm<CoreProfileFormInput, unknown, z.output<typeof coreProfileFormSchema>>({
    resolver: zodResolver(coreProfileFormSchema),
    defaultValues: {
      locale,
      portal,
      fullName: profile?.full_name ?? "",
      phoneE164: profile?.phone_e164 ?? "",
      preferredLocale: (profile?.preferred_locale as CoreProfileFormInput["preferredLocale"]) ?? locale,
      timeZone: profile?.time_zone ?? "UTC",
      countryCode: profile?.country_code ?? "",
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    void form.handleSubmit(() => startTransition(() => action(formData)))(event);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" {...form.register("locale")} />
      <input type="hidden" {...form.register("portal")} />
      <FormMessage state={state} dictionary={dictionary} />
      <FieldSet>
        <FieldLegend>{copy.contactProfileTitle}</FieldLegend>
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={Boolean(form.formState.errors.fullName || state.fieldErrors?.fullName)}>
            <FieldLabel htmlFor={`${portal}-fullName`}>{copy.fullName}</FieldLabel>
            <Input id={`${portal}-fullName`} autoComplete="name" aria-invalid={Boolean(form.formState.errors.fullName)} {...form.register("fullName")} />
            <FieldError errors={errorList(form.formState.errors.fullName?.message, state.fieldErrors?.fullName)} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.phoneE164 || state.fieldErrors?.phoneE164)}>
            <FieldLabel htmlFor={`${portal}-phoneE164`}>{copy.phone}</FieldLabel>
            <Input id={`${portal}-phoneE164`} type="tel" inputMode="tel" autoComplete="tel" placeholder="+60123456789" aria-invalid={Boolean(form.formState.errors.phoneE164)} {...form.register("phoneE164")} />
            <FieldError errors={errorList(form.formState.errors.phoneE164?.message, state.fieldErrors?.phoneE164)} />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${portal}-preferredLocale`}>{copy.preferredLanguage}</FieldLabel>
            <Controller control={form.control} name="preferredLocale" render={({ field }) => (
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`${portal}-preferredLocale`}><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(copy.languageLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.timeZone || state.fieldErrors?.timeZone)}>
            <FieldLabel htmlFor={`${portal}-timeZone`}>{copy.timeZone}</FieldLabel>
            <Input id={`${portal}-timeZone`} autoComplete="off" placeholder="Asia/Kuala_Lumpur" aria-invalid={Boolean(form.formState.errors.timeZone)} {...form.register("timeZone")} />
            <FieldError errors={errorList(form.formState.errors.timeZone?.message, state.fieldErrors?.timeZone)} />
          </Field>
          <Field data-invalid={Boolean(form.formState.errors.countryCode || state.fieldErrors?.countryCode)}>
            <FieldLabel htmlFor={`${portal}-countryCode`}>{copy.countryCode}</FieldLabel>
            <Input id={`${portal}-countryCode`} autoComplete="country" maxLength={2} placeholder="MY" aria-invalid={Boolean(form.formState.errors.countryCode)} {...form.register("countryCode")} />
            <FieldError errors={errorList(form.formState.errors.countryCode?.message, state.fieldErrors?.countryCode)} />
          </Field>
        </FieldGroup>
      </FieldSet>
      <div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : null}{pending ? copy.saving : copy.saveChanges}</Button></div>
    </form>
  );
}

export function StudentProfileForm({ locale, profile, dictionary }: { locale: Locale; profile: StudentProfile | null; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(updateStudentProfileAction, initialState);
  const form = useForm<StudentProfileFormInput, unknown, z.output<typeof studentProfileFormSchema>>({
    resolver: zodResolver(studentProfileFormSchema),
    defaultValues: { locale, dateOfBirth: profile?.date_of_birth ?? "", gender: (profile?.gender as StudentProfileFormInput["gender"]) ?? "not_specified", guardianRequired: profile?.guardian_required ?? false },
  });
  function submit(event: FormEvent<HTMLFormElement>) { const formData = new FormData(event.currentTarget); void form.handleSubmit(() => startTransition(() => action(formData)))(event); }
  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" {...form.register("locale")} /><FormMessage state={state} dictionary={dictionary} />
      <FieldSet><FieldLegend>{copy.studentProfileTitle}</FieldLegend><FieldGroup className="grid gap-5 md:grid-cols-2">
        <Field data-invalid={Boolean(form.formState.errors.dateOfBirth)}><FieldLabel htmlFor="dateOfBirth">{copy.dateOfBirth}</FieldLabel><Input id="dateOfBirth" type="date" aria-invalid={Boolean(form.formState.errors.dateOfBirth)} {...form.register("dateOfBirth")} /><FieldError errors={errorList(form.formState.errors.dateOfBirth?.message)} /></Field>
        <Field><FieldLabel htmlFor="studentGender">{copy.gender}</FieldLabel><Controller control={form.control} name="gender" render={({ field }) => <Select name={field.name} value={field.value} onValueChange={field.onChange}><SelectTrigger id="studentGender"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="not_specified">{copy.notSpecified}</SelectItem><SelectItem value="male">{copy.male}</SelectItem><SelectItem value="female">{copy.female}</SelectItem></SelectContent></Select>} /></Field>
        <Field orientation="horizontal" className="md:col-span-2"><input id="guardianRequired" type="checkbox" className="size-4 accent-primary" {...form.register("guardianRequired")} /><FieldLabel htmlFor="guardianRequired">{copy.guardianRequired}</FieldLabel></Field>
      </FieldGroup></FieldSet>
      <div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : null}{pending ? copy.saving : copy.saveChanges}</Button></div>
    </form>
  );
}

export function ParentProfileForm({ locale, profile, dictionary }: { locale: Locale; profile: ParentProfile | null; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(updateParentProfileAction, initialState);
  const form = useForm<ParentProfileFormInput, unknown, z.output<typeof parentProfileFormSchema>>({ resolver: zodResolver(parentProfileFormSchema), defaultValues: { locale, occupation: profile?.occupation ?? "", preferredContactChannel: (profile?.preferred_contact_channel as ParentProfileFormInput["preferredContactChannel"]) ?? "email" } });
  function submit(event: FormEvent<HTMLFormElement>) { const formData = new FormData(event.currentTarget); void form.handleSubmit(() => startTransition(() => action(formData)))(event); }
  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate><input type="hidden" {...form.register("locale")} /><FormMessage state={state} dictionary={dictionary} />
      <FieldSet><FieldLegend>{copy.parentProfileTitle}</FieldLegend><FieldGroup className="grid gap-5 md:grid-cols-2">
        <Field><FieldLabel htmlFor="occupation">{copy.occupation}</FieldLabel><Input id="occupation" autoComplete="organization-title" {...form.register("occupation")} /></Field>
        <Field><FieldLabel htmlFor="contactChannel">{copy.contactChannel}</FieldLabel><Controller control={form.control} name="preferredContactChannel" render={({ field }) => <Select name={field.name} value={field.value} onValueChange={field.onChange}><SelectTrigger id="contactChannel"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(copy.contactChannelLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} /></Field>
      </FieldGroup></FieldSet><div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : null}{pending ? copy.saving : copy.saveChanges}</Button></div>
    </form>
  );
}

type AvailabilityDraft = { weekday: number; start_time: string; end_time: string; time_zone: string };

function initialAvailability(rows: TeacherAvailability[], timeZone: string): AvailabilityDraft[] {
  return rows.length ? rows.map((row) => ({ weekday: row.weekday, start_time: row.local_start_time.slice(0, 5), end_time: row.local_end_time.slice(0, 5), time_zone: row.time_zone })) : [{ weekday: 1, start_time: "09:00", end_time: "12:00", time_zone: timeZone }];
}

export function TeacherProfileForm({ locale, profile, languages, availability: initialRows, defaultTimeZone, dictionary }: { locale: Locale; profile: TeacherProfile | null; languages: string[]; availability: TeacherAvailability[]; defaultTimeZone: string; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(updateTeacherProfileAction, initialState);
  const [availability, setAvailability] = useState<AvailabilityDraft[]>(() => initialAvailability(initialRows, defaultTimeZone));
  const form = useForm<TeacherProfileFormInput, unknown, z.output<typeof teacherProfileFormSchema>>({ resolver: zodResolver(teacherProfileFormSchema), defaultValues: { locale, biography: profile?.biography ?? "", gender: (profile?.gender as TeacherProfileFormInput["gender"]) ?? "not_specified", countryCode: profile?.country_code ?? "", educationSummary: profile?.education_summary ?? "", hawzaQualifications: profile?.hawza_qualifications ?? "", teachingExperienceYears: profile?.teaching_experience_years ?? 0, preferredStudentAgeGroups: (profile?.preferred_student_age_groups as TeacherProfileFormInput["preferredStudentAgeGroups"]) ?? [], languageCodes: languages as TeacherProfileFormInput["languageCodes"], availability } });
  function submit(event: FormEvent<HTMLFormElement>) { const formData = new FormData(event.currentTarget); formData.set("availability", JSON.stringify(availability)); void form.handleSubmit(() => startTransition(() => action(formData)))(event); }
  function updateAvailability(index: number, key: keyof AvailabilityDraft, value: string | number) { setAvailability((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row)); }
  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate><input type="hidden" {...form.register("locale")} /><FormMessage state={state} dictionary={dictionary} />
      <FieldSet><FieldLegend>{copy.professionalProfile}</FieldLegend><FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.biography)}><FieldLabel htmlFor="biography">{copy.biography}</FieldLabel><Textarea id="biography" rows={5} aria-invalid={Boolean(form.formState.errors.biography)} {...form.register("biography")} /><FieldError errors={errorList(form.formState.errors.biography?.message, state.fieldErrors?.biography)} /></Field>
        <div className="grid gap-5 md:grid-cols-2"><Field><FieldLabel htmlFor="teacherGender">{copy.gender}</FieldLabel><Controller control={form.control} name="gender" render={({ field }) => <Select name={field.name} value={field.value} onValueChange={field.onChange}><SelectTrigger id="teacherGender"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="not_specified">{copy.notSpecified}</SelectItem><SelectItem value="male">{copy.male}</SelectItem><SelectItem value="female">{copy.female}</SelectItem></SelectContent></Select>} /></Field><Field><FieldLabel htmlFor="teacherCountry">{copy.countryCode}</FieldLabel><Input id="teacherCountry" maxLength={2} placeholder="PK" {...form.register("countryCode")} /></Field></div>
        <Field><FieldLabel htmlFor="educationSummary">{copy.education}</FieldLabel><Textarea id="educationSummary" rows={3} {...form.register("educationSummary")} /></Field>
        <Field><FieldLabel htmlFor="hawzaQualifications">{copy.hawzaQualifications}</FieldLabel><Textarea id="hawzaQualifications" rows={3} {...form.register("hawzaQualifications")} /></Field>
        <Field><FieldLabel htmlFor="experienceYears">{copy.teachingExperience}</FieldLabel><Input id="experienceYears" type="number" min={0} max={80} {...form.register("teachingExperienceYears")} /></Field>
        <Field><FieldLabel>{copy.languages}</FieldLabel><div className="flex flex-wrap gap-3">{Object.entries(copy.languageLabels).map(([value,label]) => <label key={value} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><input type="checkbox" value={value} className="size-4 accent-primary" {...form.register("languageCodes")} />{label}</label>)}</div></Field>
        <Field><FieldLabel>{copy.ageGroups}</FieldLabel><div className="flex flex-wrap gap-3">{Object.entries(copy.ageGroupLabels).map(([value, label]) => <label key={value} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><input type="checkbox" value={value} className="size-4 accent-primary" {...form.register("preferredStudentAgeGroups")} />{label}</label>)}</div></Field>
      </FieldGroup></FieldSet>
      <FieldSet><FieldLegend>{copy.weeklyAvailability}</FieldLegend><FieldDescription>{defaultTimeZone}</FieldDescription><FieldGroup>
        {availability.map((row, index) => <div key={`${index}-${row.weekday}`} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <Field><FieldLabel htmlFor={`weekday-${index}`}>{copy.day}</FieldLabel><select id={`weekday-${index}`} className="h-9 rounded-md border bg-background px-3 text-sm" value={row.weekday} onChange={(event) => updateAvailability(index, "weekday", Number(event.target.value))}>{[0,1,2,3,4,5,6].map((day) => <option key={day} value={day}>{new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 7, 2 + day)))}</option>)}</select></Field>
          <Field><FieldLabel htmlFor={`start-${index}`}>{copy.startTime}</FieldLabel><Input id={`start-${index}`} type="time" value={row.start_time} onChange={(event) => updateAvailability(index, "start_time", event.target.value)} /></Field>
          <Field><FieldLabel htmlFor={`end-${index}`}>{copy.endTime}</FieldLabel><Input id={`end-${index}`} type="time" value={row.end_time} onChange={(event) => updateAvailability(index, "end_time", event.target.value)} /></Field>
          <Button type="button" variant="ghost" size="icon" className="self-end" disabled={availability.length === 1} onClick={() => setAvailability((current) => current.filter((_, rowIndex) => rowIndex !== index))}><Trash2Icon /><span className="sr-only">{copy.remove}</span></Button>
        </div>)}
        <div><Button type="button" variant="outline" onClick={() => setAvailability((current) => [...current, { weekday: 1, start_time: "09:00", end_time: "12:00", time_zone: defaultTimeZone }])}><PlusIcon data-icon="inline-start" />{copy.weeklyAvailability}</Button></div>
      </FieldGroup></FieldSet>
      <div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : null}{pending ? copy.saving : copy.saveChanges}</Button></div>
    </form>
  );
}
