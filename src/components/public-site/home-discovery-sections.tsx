import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  Clock3Icon,
  ImagesIcon,
} from "lucide-react";

import { ManagedContentImage } from "@/components/public-site/managed-content-image";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type {
  BlogPost,
  GalleryItem,
} from "@/server/repositories/content-library-repository";
import type {
  PricingData,
  PricingPackage,
} from "@/server/repositories/pricing-repository";

const copy = {
  en: {
    pricingTitle: "Learning plans for every family",
    pricingDescription:
      "Choose a clear monthly rhythm with live one-to-one classes and teacher feedback.",
    pricingLink: "View all pricing",
    blogTitle: "Guidance for meaningful Quran learning",
    blogDescription:
      "Practical ideas, academy updates, and thoughtful support for learners and families.",
    blogLink: "Visit the journal",
    readArticle: "Read article",
    galleryTitle: "Learning moments from our academy",
    galleryDescription:
      "A closer look at focused lessons, caring teachers, and student journeys around the world.",
    galleryLink: "Explore the gallery",
    from: "From",
  },
  ur: {
    pricingTitle: "ہر خاندان کے لیے تعلیمی منصوبے",
    pricingDescription:
      "براہ راست انفرادی کلاسوں اور استاد کی رہنمائی کے ساتھ واضح ماہانہ منصوبہ منتخب کریں۔",
    pricingLink: "تمام فیس پیکجز دیکھیں",
    blogTitle: "بامقصد قرآنی تعلیم کے لیے رہنمائی",
    blogDescription:
      "طلبہ اور خاندانوں کے لیے عملی خیالات، اکیڈمی کی خبریں اور مفید رہنمائی۔",
    blogLink: "جرنل دیکھیں",
    readArticle: "مضمون پڑھیں",
    galleryTitle: "ہماری اکیڈمی کے تعلیمی لمحات",
    galleryDescription:
      "توجہ سے بھرپور اسباق، شفیق اساتذہ اور دنیا بھر کے طلبہ کے سفر کی ایک جھلک۔",
    galleryLink: "گیلری دیکھیں",
    from: "ابتدائی",
  },
  ar: {
    pricingTitle: "خطط تعليمية تناسب كل أسرة",
    pricingDescription:
      "اختر خطة شهرية واضحة مع دروس فردية مباشرة ومتابعة مستمرة من المعلم.",
    pricingLink: "عرض جميع الأسعار",
    blogTitle: "إرشاد لتعلّم قرآني هادف",
    blogDescription:
      "أفكار عملية وأخبار الأكاديمية ودعم مدروس للطلاب والعائلات.",
    blogLink: "زيارة المجلة",
    readArticle: "اقرأ المقال",
    galleryTitle: "لحظات تعليمية من أكاديميتنا",
    galleryDescription:
      "نظرة أقرب إلى الدروس المركزة والمعلمين المهتمين ورحلات الطلاب حول العالم.",
    galleryLink: "استكشف المعرض",
    from: "ابتداءً من",
  },
  fa: {
    pricingTitle: "برنامه‌های آموزشی برای هر خانواده",
    pricingDescription:
      "یک برنامه ماهانه روشن با کلاس‌های خصوصی زنده و بازخورد استاد انتخاب کنید.",
    pricingLink: "مشاهده همه قیمت‌ها",
    blogTitle: "راهنمای یادگیری معنادار قرآن",
    blogDescription:
      "ایده‌های کاربردی، تازه‌های آکادمی و پشتیبانی سنجیده برای دانش‌آموزان و خانواده‌ها.",
    blogLink: "مشاهده مجله",
    readArticle: "مطالعه مقاله",
    galleryTitle: "لحظه‌های یادگیری در آکادمی",
    galleryDescription:
      "نگاهی نزدیک‌تر به کلاس‌های متمرکز، اساتید دلسوز و مسیر دانش‌آموزان در سراسر جهان.",
    galleryLink: "مشاهده گالری",
    from: "از",
  },
} as const;

function SectionHeading({
  title,
  description,
  href,
  linkLabel,
  inverse = false,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  inverse?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <h2
          className={`font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl ${
            inverse ? "text-sidebar-foreground" : "text-foreground"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-4 max-w-2xl text-base leading-8 sm:text-lg ${
            inverse ? "text-sidebar-foreground/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      </div>
      <Button variant={inverse ? "secondary" : "outline"} size="lg" asChild>
        <Link href={href}>
          {linkLabel}
          <ArrowRightIcon aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </Button>
    </div>
  );
}

function PricingPreviewCard({
  locale,
  pricingPackage,
  pricing,
}: {
  locale: Locale;
  pricingPackage: PricingPackage;
  pricing: PricingData;
}) {
  const preferredCurrency =
    pricing.currencies.find((currency) => currency.code === "USD") ??
    pricing.currencies[0];
  const price = preferredCurrency
    ? pricingPackage.prices.find(
        (item) =>
          item.currency_code === preferredCurrency.code && item.is_active,
      )
    : undefined;

  return (
    <article
      data-premium-interactive="true"
      className={`public-interactive-card group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 text-sidebar-foreground shadow-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        pricingPackage.is_featured
          ? "border-gold/70 bg-primary ring-1 ring-gold/60"
          : "border-sidebar-border bg-sidebar"
      }`}
    >
      {pricingPackage.badge_text ? (
        <span className="absolute end-5 top-5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-sidebar">
          {pricingPackage.badge_text}
        </span>
      ) : null}
      <p className="pe-20 text-sm font-semibold text-gold">
        {pricingPackage.classes_per_month} classes / month
      </p>
      <h3 className="mt-4 font-heading text-2xl font-semibold">
        {pricingPackage.title}
      </h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-sidebar-foreground/70">
        {pricingPackage.description}
      </p>
      <div className="my-6 flex items-center gap-2 border-y border-sidebar-border py-4 text-sm text-sidebar-foreground/80">
        <Clock3Icon aria-hidden="true" className="size-4 text-gold" />
        {pricingPackage.class_duration_minutes} minute one-to-one class
      </div>
      <ul className="space-y-3">
        {pricingPackage.features.slice(0, 2).map((feature) => (
          <li key={feature.id} className="flex gap-2.5 text-sm leading-6">
            <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-gold text-sidebar">
              <CheckIcon aria-hidden="true" className="size-2.5" />
            </span>
            {feature.feature_text}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-7">
        {price && preferredCurrency ? (
          <p className="font-heading text-3xl font-semibold text-gold">
            {preferredCurrency.symbol}
            {new Intl.NumberFormat(locale, {
              maximumFractionDigits: 2,
            }).format(price.amount)}
            <span className="ms-1 text-sm font-medium text-sidebar-foreground/65">
              {pricingPackage.billing_period_label}
            </span>
          </p>
        ) : null}
        <Link
          href={`/${locale}/free-trial`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sidebar-foreground transition-colors hover:text-gold"
        >
          {pricingPackage.cta_label}
          <ArrowRightIcon aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}

export function HomeDiscoverySections({
  locale,
  pricing,
  posts,
  gallery,
}: {
  locale: Locale;
  pricing: PricingData;
  posts: BlogPost[];
  gallery: GalleryItem[];
}) {
  const labels = copy[locale];
  const pricingPackages = pricing.packages.slice(0, 4);
  const featuredPosts = posts.slice(0, 3);
  const galleryItems = gallery.slice(0, 3);

  return (
    <>
      {pricingPackages.length ? (
        <section className="border-t border-border/70 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title={labels.pricingTitle}
              description={labels.pricingDescription}
              href={`/${locale}/pricing`}
              linkLabel={labels.pricingLink}
            />
            <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
              {pricingPackages.map((pricingPackage) => (
                <PricingPreviewCard
                  key={pricingPackage.id}
                  locale={locale}
                  pricingPackage={pricingPackage}
                  pricing={pricing}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {featuredPosts.length ? (
        <section className="border-t border-border/70 bg-warm-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title={labels.blogTitle}
              description={labels.blogDescription}
              href={`/${locale}/blog`}
              linkLabel={labels.blogLink}
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`public-interactive-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm ${
                    index === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""
                  }`}
                >
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className={`relative block overflow-hidden ${
                      index === 0 ? "min-h-72" : "aspect-[16/10]"
                    }`}
                  >
                    <ManagedContentImage
                      src={post.cover_image_url}
                      alt={post.cover_image_alt}
                      sizes={index === 0 ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 1024px) 100vw, 30vw"}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {post.category}
                    </p>
                    <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-4 flex-1 leading-7 text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      {labels.readArticle}
                      <ArrowRightIcon aria-hidden="true" className="size-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {galleryItems.length ? (
        <section className="public-page-hero-pattern border-t border-sidebar-border px-4 py-16 text-sidebar-foreground sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              title={labels.galleryTitle}
              description={labels.galleryDescription}
              href={`/${locale}/gallery`}
              linkLabel={labels.galleryLink}
              inverse
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:grid-rows-2">
              {galleryItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${locale}/gallery`}
                  className={`public-interactive-card group relative min-h-72 overflow-hidden rounded-3xl border border-sidebar-border bg-sidebar shadow-xl ${
                    index === 0
                      ? "lg:col-span-7 lg:row-span-2 lg:min-h-[35rem]"
                      : "lg:col-span-5 lg:min-h-[17rem]"
                  }`}
                >
                  <ManagedContentImage
                    src={item.image_url}
                    alt={item.image_alt}
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-white/15">
                      <ImagesIcon aria-hidden="true" className="size-4" />
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {item.category}
                    </p>
                    <h3 className="mt-2 max-w-xl font-heading text-2xl font-semibold sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-sidebar-foreground/75">
                      {item.caption}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
