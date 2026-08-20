import Link from "next/link";
import { ArrowRightIcon, CheckIcon, Clock3Icon, GraduationCapIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getLocalizedPath, type Locale } from "@/i18n/config";
import type { PricingData, PricingPackage } from "@/server/repositories/pricing-repository";

function localizedInternalPath(locale: Locale, path: string): string {
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path;
  return getLocalizedPath(locale, path);
}

function PackageCard({ locale, pricingPackage, currencies }: {
  locale: Locale;
  pricingPackage: PricingPackage;
  currencies: PricingData["currencies"];
}) {
  const prices = currencies.flatMap((currency) => {
    const price = pricingPackage.prices.find((item) => item.currency_code === currency.code && item.is_active);
    return price ? [{ ...price, currency }] : [];
  });

  return (
    <Card data-premium-interactive="true" className={pricingPackage.is_featured ? "relative h-full bg-sidebar text-sidebar-foreground ring-2 ring-primary shadow-2xl shadow-sidebar/20" : "h-full bg-sidebar text-sidebar-foreground ring-1 ring-sidebar-border shadow-xl shadow-sidebar/10"}>
      {pricingPackage.badge_text ? <div className="absolute end-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-sidebar">{pricingPackage.badge_text}</div> : null}
      <CardHeader className="gap-4 px-6 pt-7">
        <div className="flex size-11 items-center justify-center rounded-xl bg-sidebar-accent text-gold ring-1 ring-sidebar-border"><GraduationCapIcon className="size-5" aria-hidden="true" /></div>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-semibold text-sidebar-foreground">{pricingPackage.title}</CardTitle>
          <p className="min-h-10 text-sm leading-6 text-sidebar-foreground/70">{pricingPackage.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6 px-6">
        <div className="flex flex-col gap-3 border-y border-sidebar-border py-4 text-sm">
          <span className="flex items-center gap-2"><Clock3Icon className="size-4 text-gold" aria-hidden="true" />{pricingPackage.class_duration_minutes} minute class</span>
          <span className="flex items-center gap-2 text-sidebar-foreground/70"><GraduationCapIcon className="size-4 text-gold" aria-hidden="true" />{pricingPackage.class_type}</span>
        </div>
        {pricingPackage.features.length ? <ul className="flex flex-col gap-3">{pricingPackage.features.map((feature) => <li key={feature.id} className="flex gap-3 text-sm leading-5 text-sidebar-foreground/85"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><CheckIcon className="size-3" aria-hidden="true" /></span>{feature.feature_text}</li>)}</ul> : null}
        <div className="mt-auto flex flex-col gap-2 rounded-xl bg-sidebar-accent/70 p-4 ring-1 ring-sidebar-border">
          {prices.map(({ currency, amount }) => <div key={currency.code} className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-sidebar-foreground/75">{currency.code}</span><span className="font-semibold text-sidebar-foreground">{currency.symbol}{new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}{pricingPackage.billing_period_label}</span></div>)}
          {!prices.length ? <p className="text-sm text-sidebar-foreground/70">Contact us for current fees.</p> : null}
        </div>
      </CardContent>
      <CardFooter className="border-sidebar-border bg-sidebar-accent/45 p-4"><Button className="w-full" size="lg" asChild><Link href={localizedInternalPath(locale, pricingPackage.cta_url)}>{pricingPackage.cta_label}<ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden="true" /></Link></Button></CardFooter>
    </Card>
  );
}

export function PricingPlans({ locale, data }: { locale: Locale; data: PricingData }) {
  if (!data.content) {
    return <main id="main-content" className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8"><Empty className="border bg-warm-surface py-16"><EmptyHeader><EmptyMedia variant="icon"><SparklesIcon /></EmptyMedia><EmptyTitle>Pricing is being prepared</EmptyTitle><EmptyDescription>The academy is updating its learning plans. Please contact us for current fee information.</EmptyDescription></EmptyHeader></Empty></main>;
  }

  return (
    <main id="main-content">
      <section className="relative overflow-hidden bg-warm-surface px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Fee structure</span>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.045em] text-sidebar sm:text-5xl">{data.content.heading}<span className="mt-1 block text-primary">{data.content.highlighted_heading}</span></h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{data.content.subtitle}</p>
          <p className="max-w-3xl border-t border-gold/50 pt-4 text-sm leading-7 text-foreground/75 sm:text-base">{data.content.intro_text}</p>
        </div>
      </section>
      <section aria-label="Monthly learning packages" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {data.packages.length ? <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">{data.packages.map((pricingPackage) => <PackageCard key={pricingPackage.id} locale={locale} pricingPackage={pricingPackage} currencies={data.currencies} />)}</div> : <Empty className="border bg-warm-surface py-16"><EmptyHeader><EmptyMedia variant="icon"><SparklesIcon /></EmptyMedia><EmptyTitle>Learning plans are being configured</EmptyTitle><EmptyDescription>Please contact the academy while the latest packages are prepared.</EmptyDescription></EmptyHeader></Empty>}
      </section>
      <section className="px-4 pb-20 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-3xl bg-primary px-6 py-10 text-primary-foreground shadow-xl sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12"><div className="max-w-2xl"><h2 className="font-heading text-3xl font-semibold sm:text-4xl">{data.content.cta_section_title}</h2><p className="mt-3 leading-7 text-primary-foreground/80">{data.content.cta_section_description}</p></div><Button variant="secondary" size="lg" asChild><Link href={localizedInternalPath(locale, data.content.cta_button_url)}>{data.content.cta_button_label}<ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden="true" /></Link></Button></div></section>
    </main>
  );
}
