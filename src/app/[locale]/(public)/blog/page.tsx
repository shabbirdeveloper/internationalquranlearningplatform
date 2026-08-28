import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogLibrary } from "@/components/public-site/blog-library";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { isLocale } from "@/i18n/config";
import { getPublicBlogPosts } from "@/server/repositories/content-library-repository";

export const metadata: Metadata = { title: "Blog", description: "Practical guidance, academy updates, and thoughtful ideas for meaningful Quran learning." };

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const posts = await getPublicBlogPosts(locale);
  return <main id="main-content"><PublicPageHero eyebrow="SHIA TALEEM Journal" title="Insights for meaningful Quran learning" description="Practical guidance for learners and families, thoughtful teaching ideas, and news from our online academy." /><BlogLibrary locale={locale} posts={posts} /></main>;
}
