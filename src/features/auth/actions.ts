"use server";

import { redirect } from "next/navigation";

import { getLocalizedPath, isLocale, type Locale } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { readAccessFromClient } from "@/server/authorization/access";
import { getDefaultPortalPath } from "@/server/authorization/permissions";
import { loginFormSchema, type LoginState } from "@/features/auth/schemas";
import { getAppUrl } from "@/config/env";

export async function signInAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsedInput = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    locale: formData.get("locale"),
  });

  if (!parsedInput.success) {
    const fieldErrors = parsedInput.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
    };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { errorCode: "UNAVAILABLE" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsedInput.data.email,
    password: parsedInput.data.password,
  });

  if (error) {
    return { errorCode: "INVALID_CREDENTIALS" };
  }

  const access = await readAccessFromClient(supabase);
  const destination = access
    ? getDefaultPortalPath(access, parsedInput.data.locale)
    : null;

  redirect(
    destination ?? getLocalizedPath(parsedInput.data.locale, "/unauthorized")
  );
}

export async function signOutAction(localeValue: string): Promise<void> {
  const locale: Locale = isLocale(localeValue) ? localeValue : "en";
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect(getLocalizedPath(locale, "/"));
}

export type PasswordResetState = { success?: boolean; error?: boolean };
export async function requestPasswordReset(_state: PasswordResetState, formData: FormData): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim();
  const localeValue = String(formData.get("locale") ?? "en");
  const locale: Locale = isLocale(localeValue) ? localeValue : "en";
  if (!email || !email.includes("@")) return { error: true };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: true };
  const redirectTo = `${getAppUrl()}/${locale}/auth/callback?next=/${locale}/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  return error ? { error: true } : { success: true };
}

export async function updatePassword(_state: PasswordResetState, formData: FormData): Promise<PasswordResetState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8 || password.length > 256) return { error: true };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: true };
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: true } : { success: true };
}
