"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signInAction } from "@/features/auth/actions";
import {
  loginFormSchema,
  type LoginFormInput,
  type LoginState,
} from "@/features/auth/schemas";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const initialState: LoginState = {};

export function LoginForm({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [state, action, pending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormInput>({
    defaultValues: {
      email: "",
      password: "",
      locale,
    },
    resolver: zodResolver(loginFormSchema),
  });
  const submitting = pending || form.formState.isSubmitting;
  const emailErrors = form.formState.errors.email?.message
    ? [{ message: form.formState.errors.email.message }]
    : state.fieldErrors?.email?.map((message) => ({ message }));
  const passwordErrors = form.formState.errors.password?.message
    ? [{ message: form.formState.errors.password.message }]
    : state.fieldErrors?.password?.map((message) => ({ message }));
  const errorMessage =
    state.errorCode === "UNAVAILABLE"
      ? dictionary.auth.unavailable
      : state.errorCode === "INVALID_CREDENTIALS"
        ? dictionary.auth.invalidCredentials
        : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    void form.handleSubmit(() => {
      startTransition(() => {
        action(formData);
      });
    })(event);
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5"
      noValidate
    >
      <input type="hidden" {...form.register("locale")} />
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={Boolean(emailErrors)}>
          <FieldLabel htmlFor="email">{dictionary.auth.email}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(emailErrors)}
            required
            {...form.register("email")}
          />
          <FieldError errors={emailErrors} />
        </Field>
        <Field data-invalid={Boolean(passwordErrors)}>
          <FieldLabel htmlFor="password">{dictionary.auth.password}</FieldLabel>
          <div className="relative"><Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" aria-invalid={Boolean(passwordErrors)} className="pe-11" required {...form.register("password")}/><Button type="button" variant="ghost" size="icon-sm" className="absolute end-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOffIcon/> : <EyeIcon/>}<span className="sr-only">{showPassword ? dictionary.auth.hidePassword : dictionary.auth.showPassword}</span></Button></div>
          <FieldError errors={passwordErrors} />
        </Field>
      </FieldGroup>
      <div className="flex items-center justify-between gap-4 text-sm"><Field orientation="horizontal" className="gap-2"><Checkbox id="remember" name="remember" defaultChecked/><FieldLabel htmlFor="remember" className="font-normal">{dictionary.auth.remember}</FieldLabel></Field><Link className="font-medium text-primary hover:underline" href={`/${locale}/forgot-password`}>{dictionary.auth.forgotPassword}</Link></div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? <Spinner data-icon="inline-start" /> : null}
        {submitting ? dictionary.auth.submitting : dictionary.auth.submit}
      </Button>
    </form>
  );
}
