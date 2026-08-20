import { z } from "zod";

import { locales } from "@/i18n/config";

const localeSchema = z.enum(locales);
const requiredText = (label: string, max: number) =>
  z.string().trim().min(2, `${label} is required.`).max(max, `${label} is too long.`);

export const pricingFeatureSchema = z.object({
  feature_text: requiredText("Feature", 180),
  display_order: z.number().int().min(0).max(10000),
  is_active: z.boolean(),
});

export const pricingPriceSchema = z.object({
  currency_code: z.string().trim().regex(/^[A-Z]{3}$/, "Choose a valid currency."),
  amount: z.number().min(0).max(1000000),
  is_active: z.boolean(),
});

export const pricingPackageSchema = z.object({
  locale: localeSchema,
  id: z.string().uuid().nullable(),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  title: requiredText("Package title", 100),
  description: requiredText("Description", 500),
  classes_per_month: z.number().int().min(1).max(100),
  class_duration_minutes: z.number().int().min(15).max(180),
  class_type: requiredText("Class type", 100),
  badge_text: z.string().trim().max(80),
  is_featured: z.boolean(),
  cta_label: requiredText("Button label", 80),
  cta_url: z.string().trim().startsWith("/", "Use an internal path beginning with /." ).max(200),
  billing_period_label: z.string().trim().min(1).max(40),
  display_order: z.number().int().min(0).max(10000),
  is_active: z.boolean(),
  features: z.array(pricingFeatureSchema).max(20),
  prices: z.array(pricingPriceSchema).min(1, "Add at least one price.").max(30),
}).superRefine((value, context) => {
  const currencyCodes = value.prices.map((price) => price.currency_code);
  if (new Set(currencyCodes).size !== currencyCodes.length) {
    context.addIssue({ code: "custom", path: ["prices"], message: "Each currency can appear only once." });
  }
});

export const pricingPackageCommandSchema = z.object({
  locale: localeSchema,
  id: z.string().uuid(),
});

export const currencySchema = z.object({
  locale: localeSchema,
  code: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Use a three-letter currency code."),
  name: requiredText("Currency name", 80),
  symbol: z.string().trim().min(1).max(8),
  display_order: z.number().int().min(0).max(10000),
  is_active: z.boolean(),
});

export const pricingPageContentSchema = z.object({
  locale: localeSchema,
  heading: requiredText("Heading", 120),
  highlighted_heading: requiredText("Highlighted heading", 120),
  subtitle: requiredText("Subtitle", 240),
  intro_text: requiredText("Introduction", 600),
  cta_section_title: requiredText("CTA title", 160),
  cta_section_description: requiredText("CTA description", 500),
  cta_button_label: requiredText("CTA button label", 80),
  cta_button_url: z.string().trim().startsWith("/", "Use an internal path beginning with /." ).max(200),
});

export type PricingPackageInput = z.infer<typeof pricingPackageSchema>;
export type CurrencyInput = z.infer<typeof currencySchema>;
export type PricingPageContentInput = z.infer<typeof pricingPageContentSchema>;
