import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, Clock3Icon } from "lucide-react";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManagedContentImage } from "@/components/public-site/managed-content-image";
import { isLocale } from "@/i18n/config";
import { getPublicBlogPost } from "@/server/repositories/content-library-repository";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPublicBlogPost(locale, slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getPublicBlogPost(locale, slug);
  if (!post) notFound();
  return <main id="main-content">
    <article>
      <header className="public-page-hero-pattern border-b border-sidebar-border text-sidebar-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Button variant="ghost" className="-ms-3 mb-7 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" asChild><Link href={`/${locale}/blog`}><ArrowLeftIcon className="rtl:rotate-180" />Back to the journal</Link></Button>
          <div className="flex flex-wrap items-center gap-3"><Badge className="bg-gold text-sidebar hover:bg-gold">{post.category}</Badge><span className="inline-flex items-center gap-1.5 text-sm text-sidebar-foreground/65"><Clock3Icon className="size-4" />{post.reading_time_minutes} min read</span></div>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-sidebar-foreground/75">{post.excerpt}</p>
          <p className="mt-7 text-sm font-medium text-gold">By {post.author_name}</p>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-border/70 shadow-xl"><ManagedContentImage src={post.cover_image_url} alt={post.cover_image_alt} priority sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" /></div>
        <div className="mx-auto mt-12 max-w-3xl space-y-7 text-lg leading-9 text-foreground/80">{post.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </div>
    </article>
  </main>;
}
