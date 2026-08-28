import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryLibrary } from "@/components/public-site/gallery-library";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { isLocale } from "@/i18n/config";
import { getPublicGalleryItems } from "@/server/repositories/content-library-repository";

export const metadata: Metadata = { title: "Gallery", description: "Learning moments, caring teachers, and Quran study experiences from the SHIA TALEEM community." };

const pageCopy = {
  en: ["Inside the academy", "Learning moments from around the world", "A window into focused lessons, caring teachers, and the everyday progress of our international learning community."],
  ur: ["اکیڈمی کے اندر", "دنیا بھر سے سیکھنے کے لمحات", "توجہ سے بھرپور اسباق، شفیق اساتذہ اور ہماری عالمی تعلیمی برادری کی روزمرہ پیش رفت کی ایک جھلک۔"],
  ar: ["داخل الأكاديمية", "لحظات تعلّم من حول العالم", "نافذة على الدروس المركزة والمعلمين المهتمين والتقدم اليومي لمجتمعنا التعليمي الدولي."],
  fa: ["درون آکادمی", "لحظه‌های یادگیری از سراسر جهان", "نگاهی به کلاس‌های متمرکز، اساتید دلسوز و پیشرفت روزمره جامعه آموزشی بین‌المللی ما."],
} as const;

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const items = await getPublicGalleryItems(locale);
  const copy = pageCopy[locale];
  return <main id="main-content"><PublicPageHero eyebrow={copy[0]} title={copy[1]} description={copy[2]} /><GalleryLibrary items={items} locale={locale} /></main>;
}
