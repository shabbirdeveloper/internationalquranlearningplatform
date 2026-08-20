import { notFound } from "next/navigation";

import { HomeFaq } from "@/components/public-site/home-faq";
import { HomeHero } from "@/components/public-site/home-hero";
import { HomeLearning } from "@/components/public-site/home-learning";
import { HomeTrust } from "@/components/public-site/home-trust";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) {
    notFound();
  }

  const dictionary = await getDictionary(localeValue);

  return (
    <main id="main-content">
      <HomeHero locale={localeValue} dictionary={dictionary} />
      <HomeLearning locale={localeValue} dictionary={dictionary} />
      <HomeTrust locale={localeValue} dictionary={dictionary} />
      <HomeFaq locale={localeValue} dictionary={dictionary} />
    </main>
  );
}
