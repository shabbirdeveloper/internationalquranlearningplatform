import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogLibrary } from "@/components/public-site/blog-library";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { isLocale } from "@/i18n/config";
import { getPublicBlogPosts } from "@/server/repositories/content-library-repository";

export const metadata: Metadata = { title: "Blog", description: "Practical guidance, academy updates, and thoughtful ideas for meaningful Quran learning." };

const pageCopy = {
  en: ["SHIA TALEEM Journal", "Insights for meaningful Quran learning", "Practical guidance for learners and families, thoughtful teaching ideas, and news from our online academy."],
  ur: ["SHIA TALEEM جرنل", "بامقصد قرآنی تعلیم کے لیے رہنمائی", "طلبہ اور خاندانوں کے لیے عملی رہنمائی، تدریسی خیالات اور ہماری آن لائن اکیڈمی کی خبریں۔"],
  ar: ["مجلة SHIA TALEEM", "رؤى لتعلّم قرآني هادف", "إرشادات عملية للطلاب والعائلات، وأفكار تعليمية، وأخبار أكاديميتنا عبر الإنترنت."],
  fa: ["مجله SHIA TALEEM", "نگاه‌هایی برای یادگیری معنادار قرآن", "راهنمای عملی برای دانش‌آموزان و خانواده‌ها، ایده‌های آموزشی و تازه‌های آکادمی آنلاین ما."],
} as const;

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const posts = await getPublicBlogPosts(locale);
  const copy = pageCopy[locale];
  return <main id="main-content"><PublicPageHero eyebrow={copy[0]} title={copy[1]} description={copy[2]} /><BlogLibrary locale={locale} posts={posts} /></main>;
}
