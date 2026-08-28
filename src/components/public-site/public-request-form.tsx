"use client";

import { useActionState } from "react";
import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PublicCountryPhoneControls } from "@/components/shared/country-fields";
import type { PublicCopy } from "@/content/public-pages";
import { submitContactRequest, submitTrialRequest, submitTutorRequest } from "@/features/public-site/actions";
import type { PublicRequestState } from "@/features/public-site/schemas";
import type { Locale } from "@/i18n/config";

const initialState: PublicRequestState = {};

function TextField({ name, label, type = "text", required = true, error }: { name: string; label: string; type?: string; required?: boolean; error?: string[] }) {
  return <Field data-invalid={Boolean(error)}><FieldLabel htmlFor={name}>{label}{required ? <span aria-hidden="true" className="text-primary">*</span> : null}</FieldLabel><Input id={name} name={name} type={type} required={required} aria-invalid={Boolean(error)} /><FieldError errors={error?.map((message) => ({ message }))}/></Field>;
}

export function PublicRequestForm({ kind, locale, copy, defaultCourse }: { kind: "trial" | "contact" | "tutor"; locale: Locale; copy: PublicCopy; defaultCourse?: string }) {
  const serverAction = kind === "trial" ? submitTrialRequest : kind === "contact" ? submitContactRequest : submitTutorRequest;
  const [state, action, pending] = useActionState(serverAction, initialState);
  const labels = copy.labels;
  const errorMessage = state.status === "UNAVAILABLE" ? labels.unavailable : state.status === "ERROR" ? labels.error : null;
  if (state.status === "SUCCESS") return <Card className="border-primary/20 bg-primary/5"><CardContent className="flex min-h-72 flex-col items-center justify-center text-center"><CheckCircle2Icon className="size-12 text-primary"/><h2 className="mt-5 font-heading text-3xl font-semibold">{labels.success}</h2><p className="mt-3 text-muted-foreground">{labels.reference} <strong className="text-foreground">{state.reference}</strong>.</p></CardContent></Card>;
  return <Card className="min-w-0 max-w-full overflow-hidden border-primary/10 shadow-xl"><CardContent className="min-w-0 p-5 sm:p-8 lg:p-10">
    <form action={action} className="min-w-0 max-w-full space-y-6" encType={kind === "tutor" ? "multipart/form-data" : undefined}>
      <input type="hidden" name="locale" value={locale}/>{defaultCourse ? <input type="hidden" name="courseSlug" value={defaultCourse}/> : null}
      {errorMessage ? <Alert variant="destructive"><AlertDescription>{errorMessage}</AlertDescription></Alert> : null}
      <FieldGroup className="grid min-w-0 max-w-full gap-5 sm:grid-cols-2">
        <TextField name="fullName" label={labels.name} error={state.fieldErrors?.fullName}/><TextField name="email" label={labels.email} type="email" error={state.fieldErrors?.email}/>
        <PublicCountryPhoneControls locale={locale} countryLabel={labels.country} phoneLabel={labels.phone} phoneRequired={kind !== "contact"} showCountryField={kind !== "contact"} countryError={state.fieldErrors?.country} phoneError={state.fieldErrors?.phone}/>
        {kind === "trial" ? <><TextField name="timeZone" label={labels.timezone} error={state.fieldErrors?.timeZone}/><TextField name="learnerAge" label={labels.learnerAge} error={state.fieldErrors?.learnerAge}/><TextField name="teacherPreference" label={labels.preferredTeacher} required={false}/>{defaultCourse ? null : <TextField name="courseSlug" label={copy.hero.courses[0]} required={false}/>}</> : null}
        {kind === "contact" ? <TextField name="subject" label={labels.subject} error={state.fieldErrors?.subject}/> : null}
        {kind === "tutor" ? <><TextField name="subjects" label={labels.teachingSubjects} error={state.fieldErrors?.subjects}/><TextField name="languages" label={labels.languages} error={state.fieldErrors?.languages}/></> : null}
      </FieldGroup>
      {kind === "trial" ? <FieldGroup><Field><FieldLabel htmlFor="goals">{labels.goals}</FieldLabel><Textarea id="goals" name="goals" required rows={4}/></Field><Field><FieldLabel htmlFor="schedule">{labels.schedule}</FieldLabel><Textarea id="schedule" name="schedule" required rows={3}/></Field></FieldGroup> : null}
      {kind === "contact" ? <Field><FieldLabel htmlFor="message">{labels.message}</FieldLabel><Textarea id="message" name="message" required rows={7}/></Field> : null}
      {kind === "tutor" ? <FieldGroup className="min-w-0 max-w-full"><Field><FieldLabel htmlFor="experience">{labels.experience}</FieldLabel><Textarea id="experience" name="experience" required rows={4}/></Field><Field><FieldLabel htmlFor="qualifications">{labels.qualifications}</FieldLabel><Textarea id="qualifications" name="qualifications" required rows={4}/></Field><Field><FieldLabel htmlFor="availability">{labels.availability}</FieldLabel><Textarea id="availability" name="availability" required rows={3}/></Field><Field><FieldLabel htmlFor="biography">{labels.biography}</FieldLabel><Textarea id="biography" name="biography" required rows={5}/></Field><div className="grid min-w-0 max-w-full gap-5 sm:grid-cols-3">{[["identity",labels.identity],["certificate",labels.certificate],["cv",labels.cv]].map(([name,label]) => <Field key={name} className="min-w-0"><FieldLabel htmlFor={name}>{label}</FieldLabel><Input className="max-w-full overflow-hidden file:max-w-[70%] file:truncate" id={name} name={name} type="file" accept=".pdf,.jpg,.jpeg,.png" required/><FieldDescription>{labels.files}</FieldDescription></Field>)}</div>{state.fieldErrors?.files ? <Alert variant="destructive"><AlertDescription>{state.fieldErrors.files.join(" ")}</AlertDescription></Alert> : null}</FieldGroup> : null}
      <Button type="submit" size="xl" className="w-full sm:w-auto" disabled={pending}>{pending ? <Spinner data-icon="inline-start"/> : null}{pending ? labels.submitting : labels.submit}</Button>
    </form>
  </CardContent></Card>;
}
