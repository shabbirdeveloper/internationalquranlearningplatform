import { z } from "zod";

import { locales } from "@/i18n/config";

export const loginFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(256, "Password is too long."),
  locale: z.enum(locales),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

export type LoginState = {
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
  errorCode?: "INVALID_CREDENTIALS" | "UNAVAILABLE";
};
