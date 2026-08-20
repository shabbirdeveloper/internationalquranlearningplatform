"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS } from "@/config/permissions";
import {
  currencySchema,
  pricingPackageCommandSchema,
  pricingPackageSchema,
  pricingPageContentSchema,
} from "@/features/pricing/schemas";
import { locales } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserAccess } from "@/server/authorization/access";
import { hasPermission } from "@/server/authorization/permissions";

export type PricingActionState = {
  success?: boolean;
  error?: string;
  savedId?: string;
};

async function getAuthorizedClient() {
  const access = await getCurrentUserAccess();
  if (!access || !hasPermission(access, PERMISSIONS.CONTENT_MANAGE)) return null;
  return createServerSupabaseClient();
}

function readJson(formData: FormData): unknown {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function refreshPricing(): void {
  for (const locale of locales) {
    revalidatePath(`/${locale}/pricing`);
    revalidatePath(`/${locale}/admin/pricing`);
  }
}

function invalidMessage(issues: Array<{ message: string }>): PricingActionState {
  return { error: issues[0]?.message ?? "Review the form and try again." };
}

export async function savePricingPackageAction(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const parsed = pricingPackageSchema.safeParse(readJson(formData));
  if (!parsed.success) return invalidMessage(parsed.error.issues);

  const supabase = await getAuthorizedClient();
  if (!supabase) return { error: "You are not authorized to manage pricing." };

  const { locale, id, features, prices, ...packageData } = parsed.data;
  void locale;
  const { data, error } = await supabase.rpc("save_pricing_package", {
    p_package_id: id,
    p_package: packageData,
    p_features: features,
    p_prices: prices,
  });

  if (error) return { error: error.message };
  refreshPricing();
  return { success: true, savedId: data as string };
}

export async function saveCurrencyAction(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const parsed = currencySchema.safeParse(readJson(formData));
  if (!parsed.success) return invalidMessage(parsed.error.issues);
  const supabase = await getAuthorizedClient();
  if (!supabase) return { error: "You are not authorized to manage pricing." };

  const { locale, ...currency } = parsed.data;
  void locale;
  const { error } = await supabase.from("currencies").upsert(currency, { onConflict: "code" });
  if (error) return { error: error.message };
  refreshPricing();
  return { success: true };
}

export async function savePricingPageContentAction(
  _previousState: PricingActionState,
  formData: FormData
): Promise<PricingActionState> {
  const parsed = pricingPageContentSchema.safeParse(readJson(formData));
  if (!parsed.success) return invalidMessage(parsed.error.issues);
  const supabase = await getAuthorizedClient();
  if (!supabase) return { error: "You are not authorized to manage pricing." };

  const { locale, ...content } = parsed.data;
  void locale;
  const { error } = await supabase.from("pricing_page_content").upsert({ id: true, ...content });
  if (error) return { error: error.message };
  refreshPricing();
  return { success: true };
}

export async function togglePricingPackageAction(formData: FormData): Promise<void> {
  const parsed = pricingPackageCommandSchema.safeParse({ locale: formData.get("locale"), id: formData.get("id") });
  if (!parsed.success) return;
  const supabase = await getAuthorizedClient();
  if (!supabase) return;
  const { data } = await supabase.from("pricing_packages").select("is_active").eq("id", parsed.data.id).single();
  if (!data) return;
  await supabase.from("pricing_packages").update({ is_active: !data.is_active, deleted_at: null }).eq("id", parsed.data.id);
  refreshPricing();
}

export async function archivePricingPackageAction(formData: FormData): Promise<void> {
  const parsed = pricingPackageCommandSchema.safeParse({ locale: formData.get("locale"), id: formData.get("id") });
  if (!parsed.success) return;
  const supabase = await getAuthorizedClient();
  if (!supabase) return;
  await supabase.from("pricing_packages").update({ is_active: false, deleted_at: new Date().toISOString() }).eq("id", parsed.data.id);
  refreshPricing();
}

export async function duplicatePricingPackageAction(formData: FormData): Promise<void> {
  const parsed = pricingPackageCommandSchema.safeParse({ locale: formData.get("locale"), id: formData.get("id") });
  if (!parsed.success) return;
  const supabase = await getAuthorizedClient();
  if (!supabase) return;

  const [packageResult, featuresResult, pricesResult] = await Promise.all([
    supabase.from("pricing_packages").select("slug,title,description,classes_per_month,class_duration_minutes,class_type,badge_text,cta_label,cta_url,billing_period_label,display_order").eq("id", parsed.data.id).single(),
    supabase.from("pricing_package_features").select("feature_text,display_order,is_active").eq("package_id", parsed.data.id),
    supabase.from("pricing_package_prices").select("currency_code,amount,is_active").eq("package_id", parsed.data.id),
  ]);
  if (!packageResult.data || featuresResult.error || pricesResult.error) return;

  const suffix = Date.now().toString(36);
  const packageData = {
    ...packageResult.data,
    slug: `${packageResult.data.slug}-copy-${suffix}`,
    title: `${packageResult.data.title} (Copy)`,
    is_featured: false,
    is_active: false,
    display_order: packageResult.data.display_order + 1,
  };
  await supabase.rpc("save_pricing_package", {
    p_package_id: null,
    p_package: packageData,
    p_features: featuresResult.data ?? [],
    p_prices: pricesResult.data ?? [],
  });
  refreshPricing();
}
