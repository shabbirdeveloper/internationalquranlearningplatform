import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PricingCurrency = {
  code: string;
  name: string;
  symbol: string;
  display_order: number;
  is_active: boolean;
};

export type PricingFeature = {
  id: string;
  package_id: string;
  feature_text: string;
  display_order: number;
  is_active: boolean;
};

export type PricingPrice = {
  id: string;
  package_id: string;
  currency_code: string;
  amount: number;
  is_active: boolean;
};

export type PricingPackage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  classes_per_month: number;
  class_duration_minutes: number;
  class_type: string;
  badge_text: string | null;
  is_featured: boolean;
  cta_label: string;
  cta_url: string;
  billing_period_label: string;
  display_order: number;
  is_active: boolean;
  deleted_at: string | null;
  features: PricingFeature[];
  prices: PricingPrice[];
};

export type PricingPageContent = {
  heading: string;
  highlighted_heading: string;
  subtitle: string;
  intro_text: string;
  cta_section_title: string;
  cta_section_description: string;
  cta_button_label: string;
  cta_button_url: string;
};

export type PricingData = {
  packages: PricingPackage[];
  currencies: PricingCurrency[];
  content: PricingPageContent | null;
};

const fallbackCurrencies: PricingCurrency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", display_order: 10, is_active: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", display_order: 20, is_active: true },
  { code: "GBP", name: "British Pound", symbol: "£", display_order: 30, is_active: true },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", display_order: 40, is_active: true },
  { code: "EUR", name: "Euro", symbol: "€", display_order: 50, is_active: true },
];

const fallbackPackageBlueprints = [
  ["four-classes", "4 Classes/Month", "A gentle learning rhythm for steady foundations.", 4, null, false, [30, 30, 20, 30, 20]],
  ["eight-classes", "8 Classes/Month", "A balanced plan for consistent weekly progress.", 8, null, false, [35, 35, 22, 35, 22]],
  ["twelve-classes", "12 Classes/Month", "More guided practice for learners ready to accelerate.", 12, null, false, [40, 40, 25, 40, 25]],
  ["twenty-classes", "20 Classes/Month", "Our most focused plan for ambitious learning goals.", 20, "Most Popular", true, [50, 50, 35, 50, 35]],
] as const;

const fallbackPricingData: PricingData = {
  currencies: fallbackCurrencies,
  packages: fallbackPackageBlueprints.map(([slug, title, description, classesPerMonth, badgeText, featured, amounts], packageIndex) => ({
    id: `fallback-${slug}`,
    slug,
    title,
    description,
    classes_per_month: classesPerMonth,
    class_duration_minutes: 30,
    class_type: "One-to-one class",
    badge_text: badgeText,
    is_featured: featured,
    cta_label: "Get Admission Now",
    cta_url: "/free-trial",
    billing_period_label: "/month",
    display_order: (packageIndex + 1) * 10,
    is_active: true,
    deleted_at: null,
    features: [
      {
        id: `fallback-${slug}-feature-live`,
        package_id: `fallback-${slug}`,
        feature_text: "Live one-to-one classes",
        display_order: 10,
        is_active: true,
      },
      {
        id: `fallback-${slug}-feature-feedback`,
        package_id: `fallback-${slug}`,
        feature_text: "Teacher feedback and progress guidance",
        display_order: 20,
        is_active: true,
      },
    ],
    prices: fallbackCurrencies.map((currency, currencyIndex) => ({
      id: `fallback-${slug}-${currency.code}`,
      package_id: `fallback-${slug}`,
      currency_code: currency.code,
      amount: amounts[currencyIndex],
      is_active: true,
    })),
  })),
  content: {
    heading: "Monthly Fee Packages",
    highlighted_heading: "Online Quran & Islamic Classes",
    subtitle: "Choose the learning plan that best fits your schedule and educational needs.",
    intro_text: "Every plan includes live guidance from a carefully reviewed teacher, a schedule agreed around your family, and a clear path for steady progress.",
    cta_section_title: "Ready to begin your learning journey?",
    cta_section_description: "Book a free live trial so we can understand your goals and recommend the most suitable plan.",
    cta_button_label: "Book a Free Trial",
    cta_button_url: "/free-trial",
  },
};

const packageColumns = "id,slug,title,description,classes_per_month,class_duration_minutes,class_type,badge_text,is_featured,cta_label,cta_url,billing_period_label,display_order,is_active,deleted_at";
const currencyColumns = "code,name,symbol,display_order,is_active";
const featureColumns = "id,package_id,feature_text,display_order,is_active";
const priceColumns = "id,package_id,currency_code,amount,is_active";
const contentColumns = "heading,highlighted_heading,subtitle,intro_text,cta_section_title,cta_section_description,cta_button_label,cta_button_url";

function assemblePackages(
  packageRows: Omit<PricingPackage, "features" | "prices">[],
  featureRows: PricingFeature[],
  priceRows: Array<Omit<PricingPrice, "amount"> & { amount: number | string }>
): PricingPackage[] {
  return packageRows.map((item) => ({
    ...item,
    features: featureRows.filter((feature) => feature.package_id === item.id),
    prices: priceRows
      .filter((price) => price.package_id === item.id)
      .map((price) => ({ ...price, amount: Number(price.amount) })),
  }));
}

export async function getPublicPricingData(): Promise<PricingData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackPricingData;

  const [packagesResult, currenciesResult, featuresResult, pricesResult, contentResult] = await Promise.all([
    supabase.from("pricing_packages").select(packageColumns).eq("is_active", true).is("deleted_at", null).order("display_order").order("title"),
    supabase.from("currencies").select(currencyColumns).eq("is_active", true).order("display_order").order("code"),
    supabase.from("pricing_package_features").select(featureColumns).eq("is_active", true).order("display_order"),
    supabase.from("pricing_package_prices").select(priceColumns).eq("is_active", true),
    supabase.from("pricing_page_content").select(contentColumns).eq("id", true).maybeSingle(),
  ]);

  if (packagesResult.error || currenciesResult.error || featuresResult.error || pricesResult.error || contentResult.error) {
    return fallbackPricingData;
  }

  return {
    packages: assemblePackages(
      (packagesResult.data ?? []) as Omit<PricingPackage, "features" | "prices">[],
      (featuresResult.data ?? []) as PricingFeature[],
      (pricesResult.data ?? []) as Array<Omit<PricingPrice, "amount"> & { amount: number | string }>
    ),
    currencies: (currenciesResult.data ?? []) as PricingCurrency[],
    content: contentResult.data as PricingPageContent | null,
  };
}

export async function getAdminPricingData(): Promise<PricingData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { packages: [], currencies: [], content: null };

  const [packagesResult, currenciesResult, featuresResult, pricesResult, contentResult] = await Promise.all([
    supabase.from("pricing_packages").select(packageColumns).order("display_order").order("title"),
    supabase.from("currencies").select(currencyColumns).order("display_order").order("code"),
    supabase.from("pricing_package_features").select(featureColumns).order("display_order"),
    supabase.from("pricing_package_prices").select(priceColumns),
    supabase.from("pricing_page_content").select(contentColumns).eq("id", true).maybeSingle(),
  ]);

  return {
    packages: assemblePackages(
      (packagesResult.data ?? []) as Omit<PricingPackage, "features" | "prices">[],
      (featuresResult.data ?? []) as PricingFeature[],
      (pricesResult.data ?? []) as Array<Omit<PricingPrice, "amount"> & { amount: number | string }>
    ),
    currencies: (currenciesResult.data ?? []) as PricingCurrency[],
    content: contentResult.data as PricingPageContent | null,
  };
}
