"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestParentLinkAction, type PortalActionState } from "@/features/portal/actions";
import { parentLinkRequestSchema } from "@/features/portal/schemas";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { z } from "zod";

type ParentLinkInput = z.input<typeof parentLinkRequestSchema>;
const initialState: PortalActionState = {};

export function ParentLinkRequestForm({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(requestParentLinkAction, initialState);
  const form = useForm<ParentLinkInput>({
    resolver: zodResolver(parentLinkRequestSchema),
    defaultValues: { locale, studentNumber: "", relationship: "" },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    void form.handleSubmit(() => startTransition(() => action(formData)))(event);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <input type="hidden" {...form.register("locale")} />
      {state.success ? (
        <Alert><AlertDescription>{copy.pendingApproval}</AlertDescription></Alert>
      ) : state.errorCode ? (
        <Alert variant="destructive"><AlertDescription>{copy.actionError}</AlertDescription></Alert>
      ) : null}
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(form.formState.errors.studentNumber)}>
          <FieldLabel htmlFor="studentNumber">{copy.studentNumber}</FieldLabel>
          <Input id="studentNumber" autoComplete="off" aria-invalid={Boolean(form.formState.errors.studentNumber)} {...form.register("studentNumber")} />
          <FieldError errors={form.formState.errors.studentNumber?.message ? [{ message: form.formState.errors.studentNumber.message }] : undefined} />
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.relationship)}>
          <FieldLabel htmlFor="relationship">{copy.relationship}</FieldLabel>
          <Input id="relationship" autoComplete="off" aria-invalid={Boolean(form.formState.errors.relationship)} {...form.register("relationship")} />
          <FieldError errors={form.formState.errors.relationship?.message ? [{ message: form.formState.errors.relationship.message }] : undefined} />
        </Field>
      </FieldGroup>
      <div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : null}{copy.requestLink}</Button></div>
    </form>
  );
}
