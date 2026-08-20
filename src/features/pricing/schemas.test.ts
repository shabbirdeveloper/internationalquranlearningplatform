import { describe, expect, it } from "vitest";

import { currencySchema, pricingPackageSchema, pricingPageContentSchema } from "@/features/pricing/schemas";

const validPackage = {
  locale: "en" as const,
  id: null,
  slug: "four-classes",
  title: "4 Classes/Month",
  description: "A steady monthly learning plan.",
  classes_per_month: 4,
  class_duration_minutes: 30,
  class_type: "One-to-one class",
  badge_text: "",
  is_featured: false,
  cta_label: "Get Admission Now",
  cta_url: "/free-trial",
  billing_period_label: "/month",
  display_order: 10,
  is_active: true,
  features: [{ feature_text: "Teacher feedback", display_order: 10, is_active: true }],
  prices: [{ currency_code: "USD", amount: 30, is_active: true }],
};

describe("pricing schemas", () => {
  it("accepts a complete package", () => {
    expect(pricingPackageSchema.safeParse(validPackage).success).toBe(true);
  });

  it("rejects duplicate package currencies", () => {
    const parsed = pricingPackageSchema.safeParse({
      ...validPackage,
      prices: [validPackage.prices[0], validPackage.prices[0]],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects external CTA URLs", () => {
    expect(pricingPackageSchema.safeParse({ ...validPackage, cta_url: "https://example.com" }).success).toBe(false);
  });

  it("validates currencies and page content", () => {
    expect(currencySchema.safeParse({ locale: "en", code: "gbp", name: "British Pound", symbol: "£", display_order: 30, is_active: true }).success).toBe(true);
    expect(pricingPageContentSchema.safeParse({ locale: "en", heading: "Monthly Fee Packages", highlighted_heading: "Online Quran Classes", subtitle: "Choose the right plan.", intro_text: "Live guidance and steady progress.", cta_section_title: "Ready to begin?", cta_section_description: "Book a free live trial today.", cta_button_label: "Book a Free Trial", cta_button_url: "/free-trial" }).success).toBe(true);
  });
});
