"use client";
import { useActionState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestPasswordReset, type PasswordResetState } from "@/features/auth/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
export function ForgotPasswordForm({locale,dictionary}:{locale:Locale;dictionary:Dictionary}){const[state,action,pending]=useActionState(requestPasswordReset,{} as PasswordResetState);return <form action={action} className="space-y-5"><input type="hidden" name="locale" value={locale}/>{state.success?<Alert><AlertDescription>{dictionary.auth.resetSent}</AlertDescription></Alert>:null}{state.error?<Alert variant="destructive"><AlertDescription>{dictionary.auth.unavailable}</AlertDescription></Alert>:null}<FieldGroup><Field><FieldLabel htmlFor="email">{dictionary.auth.email}</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" required/></Field></FieldGroup><Button className="w-full" size="lg" disabled={pending}>{pending?<Spinner data-icon="inline-start"/>:null}{dictionary.auth.resetSubmit}</Button></form>}
