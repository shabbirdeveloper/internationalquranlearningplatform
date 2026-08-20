import { notFound } from "next/navigation";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { PublicRequestForm } from "@/components/public-site/public-request-form";
import { getPublicCopy } from "@/content/public-pages";
import { isLocale } from "@/i18n/config";
export default async function BecomeTutorPage({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params; if(!isLocale(locale)) notFound(); const copy=getPublicCopy(locale); return <main id="main-content"><PublicPageHero eyebrow={copy.hero.tutor[0]} title={copy.hero.tutor[1]} description={copy.hero.tutor[2]}/><section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><PublicRequestForm kind="tutor" locale={locale} copy={copy}/></section></main>; }
