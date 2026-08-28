import Link from "next/link";
import { ArrowRightIcon, Clock3Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManagedContentImage } from "@/components/public-site/managed-content-image";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/server/repositories/content-library-repository";

const blogLabels = {
  en: { featured: "Featured insight", minutes: "min read", by: "By", story: "Read the story", article: "Read article" },
  ur: { featured: "نمایاں تحریر", minutes: "منٹ مطالعہ", by: "تحریر", story: "مکمل تحریر پڑھیں", article: "مضمون پڑھیں" },
  ar: { featured: "مقال مميز", minutes: "دقائق قراءة", by: "بقلم", story: "اقرأ القصة", article: "اقرأ المقال" },
  fa: { featured: "مطلب ویژه", minutes: "دقیقه مطالعه", by: "نویسنده", story: "مطالعه مطلب", article: "مطالعه مقاله" },
} as const;

function PostMeta({ post, locale }: { post: BlogPost; locale: Locale }) {
  return <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="secondary">{post.category}</Badge><span className="inline-flex items-center gap-1"><Clock3Icon className="size-3.5" />{post.reading_time_minutes} {blogLabels[locale].minutes}</span></div>;
}

export function BlogLibrary({ locale, posts }: { locale: Locale; posts: BlogPost[] }) {
  const featured = posts.find((post) => post.is_featured) ?? posts[0];
  const remaining = posts.filter((post) => post.id !== featured?.id);
  const labels = blogLabels[locale];
  if (!featured) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <article className="group grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[0_25px_80px_-55px_oklch(0.15_0.04_248)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-72 overflow-hidden lg:min-h-[31rem]">
          <ManagedContentImage src={featured.cover_image_url} alt={featured.cover_image_alt} priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sidebar/55 via-transparent to-transparent" />
          <Badge className="absolute start-5 top-5 bg-gold text-sidebar hover:bg-gold">{labels.featured}</Badge>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <PostMeta post={featured} locale={locale} />
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{featured.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{featured.excerpt}</p>
          <p className="mt-6 text-sm font-medium text-primary">{labels.by} {featured.author_name}</p>
          <Button asChild className="mt-7 w-fit">
            <Link href={`/${locale}/blog/${featured.slug}`}>{labels.story} <ArrowRightIcon className="rtl:rotate-180" /></Link>
          </Button>
        </div>
      </article>

      {remaining.length ? <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {remaining.map((post) => <article key={post.id} className="public-interactive-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          <Link href={`/${locale}/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
            <ManagedContentImage src={post.cover_image_url} alt={post.cover_image_alt} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </Link>
          <div className="flex flex-1 flex-col p-6">
            <PostMeta post={post} locale={locale} />
            <h2 className="mt-4 font-heading text-2xl font-semibold leading-tight"><Link href={`/${locale}/blog/${post.slug}`} className="transition-colors hover:text-primary">{post.title}</Link></h2>
            <p className="mt-3 flex-1 leading-7 text-muted-foreground">{post.excerpt}</p>
            <Link href={`/${locale}/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">{labels.article} <ArrowRightIcon className="size-4 rtl:rotate-180" /></Link>
          </div>
        </article>)}
      </div> : null}
    </section>
  );
}
