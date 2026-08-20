import { notFound } from "next/navigation";

import { PricingPlans } from "@/components/public-site/pricing-plans";
import { isLocale } from "@/i18n/config";
import { getPublicPricingData } from "@/server/repositories/pricing-repository";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const pricingData = await getPublicPricingData();
  return <PricingPlans locale={locale} data={pricingData} />;
}
