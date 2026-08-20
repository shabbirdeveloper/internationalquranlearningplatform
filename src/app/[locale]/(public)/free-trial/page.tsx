import { notFound } from "next/navigation";

import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { PublicRequestForm } from "@/components/public-site/public-request-form";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";

export default async function FreeTrialPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ course?: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) notFound();

  const copy = getPublicCopy(localeValue);
  const { course } = await searchParams;
  return <main id="main-content"><PublicPageHero eyebrow={copy.hero.trial[0]} title={copy.hero.trial[1]} description={copy.hero.trial[2]}/><section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><PublicRequestForm kind="trial" locale={localeValue} copy={copy} defaultCourse={course}/></section></main>;
}
