import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BlogPost = {
  id: string;
  locale: Locale;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url: string;
  cover_image_alt: string;
  author_name: string;
  reading_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  locale: Locale;
  title: string;
  caption: string;
  category: string;
  image_url: string;
  image_alt: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

const fallbackPosts: Omit<BlogPost, "locale">[] = [
  {
    id: "fallback-meaningful-quran-routine",
    slug: "building-a-meaningful-quran-routine",
    title: "Building a meaningful Quran routine at home",
    excerpt: "A calm, practical approach to helping learners make Quran study part of everyday family life.",
    body: "A meaningful Quran routine begins with consistency, not intensity. Choose a quiet time that the learner can keep, prepare the learning space, and begin with a realistic goal.\n\nShort, focused lessons often create stronger habits than occasional long sessions. A caring teacher can help the learner balance reading, correction, understanding, and revision without feeling overwhelmed.\n\nFamilies can support progress by celebrating effort, listening with patience, and keeping the schedule predictable. Over time, these small actions build confidence and a lasting connection with the Quran.",
    category: "Learning guidance",
    cover_image_url: "/images/shia-taleem-hero-learning.png",
    cover_image_alt: "A student learning the Quran online from home",
    author_name: "SHIA TALEEM Academic Team",
    reading_time_minutes: 4,
    is_featured: true,
    is_published: true,
    published_at: "2026-08-20T08:00:00.000Z",
    display_order: 10,
    deleted_at: null,
    created_at: "2026-08-20T08:00:00.000Z",
    updated_at: "2026-08-20T08:00:00.000Z",
  },
  {
    id: "fallback-first-online-lesson",
    slug: "prepare-for-your-first-online-quran-lesson",
    title: "How to prepare for your first online Quran lesson",
    excerpt: "Simple steps for a focused, comfortable first lesson with your teacher.",
    body: "Your first lesson is an opportunity for the teacher to understand your current level, learning goals, and preferred pace. Keep your Quran, notebook, and a reliable device ready before the class begins.\n\nJoin from a quiet place with good lighting and test your microphone in advance. There is no need to worry about making mistakes: the lesson is designed to identify the best starting point and build a plan around you.\n\nAfter class, write down one small practice goal and confirm the next lesson time. A clear start makes consistent progress easier.",
    category: "Getting started",
    cover_image_url: "/images/hero-online-class.png",
    cover_image_alt: "A learner preparing for an online Quran lesson",
    author_name: "SHIA TALEEM Student Support",
    reading_time_minutes: 3,
    is_featured: false,
    is_published: true,
    published_at: "2026-08-14T08:00:00.000Z",
    display_order: 20,
    deleted_at: null,
    created_at: "2026-08-14T08:00:00.000Z",
    updated_at: "2026-08-14T08:00:00.000Z",
  },
  {
    id: "fallback-tajweed-confidence",
    slug: "tajweed-with-confidence",
    title: "Learning Tajweed with confidence and patience",
    excerpt: "Why steady correction and regular practice matter more than rushing through rules.",
    body: "Tajweed becomes easier when each rule is connected to real recitation. Instead of trying to memorize everything at once, learners benefit from listening, repeating, and applying one principle at a time.\n\nPatient correction is essential. A teacher should explain what changed, demonstrate the sound clearly, and give the learner enough time to try again. Regular revision then turns conscious effort into a natural recitation habit.\n\nProgress may feel gradual, but every accurately pronounced letter is meaningful. Consistency and encouragement help learners recite with both care and confidence.",
    category: "Quran studies",
    cover_image_url: "/images/quran-trial-art.png",
    cover_image_alt: "An open Quran prepared for a guided lesson",
    author_name: "SHIA TALEEM Academic Team",
    reading_time_minutes: 5,
    is_featured: false,
    is_published: true,
    published_at: "2026-08-08T08:00:00.000Z",
    display_order: 30,
    deleted_at: null,
    created_at: "2026-08-08T08:00:00.000Z",
    updated_at: "2026-08-08T08:00:00.000Z",
  },
];

const fallbackGallery: Omit<GalleryItem, "locale">[] = [
  { id: "fallback-gallery-1", title: "Live one-to-one Quran learning", caption: "A focused lesson shaped around each learner's level and pace.", category: "Live lessons", image_url: "/images/shia-taleem-hero-learning.png", image_alt: "A student attending a live online Quran lesson", is_featured: true, is_published: true, published_at: "2026-08-20T08:00:00.000Z", display_order: 10, deleted_at: null, created_at: "2026-08-20T08:00:00.000Z", updated_at: "2026-08-20T08:00:00.000Z" },
  { id: "fallback-gallery-2", title: "Caring female teachers", caption: "Clear guidance, patient correction, and a respectful learning environment.", category: "Teachers", image_url: "/images/shia-taleem-female-teacher.png", image_alt: "A female teacher leading an online lesson", is_featured: false, is_published: true, published_at: "2026-08-18T08:00:00.000Z", display_order: 20, deleted_at: null, created_at: "2026-08-18T08:00:00.000Z", updated_at: "2026-08-18T08:00:00.000Z" },
  { id: "fallback-gallery-3", title: "A thoughtful first step", caption: "Trial lessons help families meet a suitable teacher and agree on a practical plan.", category: "Student journeys", image_url: "/images/hero-online-class.png", image_alt: "A student beginning an online Quran lesson", is_featured: false, is_published: true, published_at: "2026-08-16T08:00:00.000Z", display_order: 30, deleted_at: null, created_at: "2026-08-16T08:00:00.000Z", updated_at: "2026-08-16T08:00:00.000Z" },
  { id: "fallback-gallery-4", title: "Learning with the Quran", caption: "Structured practice helps reading become fluent, accurate, and confident.", category: "Quran studies", image_url: "/images/quran-trial-art.png", image_alt: "An open Quran used during a lesson", is_featured: false, is_published: true, published_at: "2026-08-12T08:00:00.000Z", display_order: 40, deleted_at: null, created_at: "2026-08-12T08:00:00.000Z", updated_at: "2026-08-12T08:00:00.000Z" },
];

const farsiPostCopy: Record<string, Pick<BlogPost, "title" | "excerpt" | "body" | "category" | "cover_image_alt" | "author_name">> = {
  "building-a-meaningful-quran-routine": {
    title: "ساختن یک برنامه معنادار برای قرآن در خانه",
    excerpt: "روشی آرام و عملی برای تبدیل آموزش قرآن به بخشی از زندگی روزمره خانواده.",
    body: "یک برنامه معنادار قرآنی با استمرار آغاز می‌شود، نه با فشار. زمانی آرام و قابل تکرار انتخاب کنید، فضای یادگیری را آماده سازید و با هدفی واقع‌بینانه شروع کنید.\n\nجلسات کوتاه و متمرکز معمولاً عادت‌های قوی‌تری از کلاس‌های طولانی و پراکنده می‌سازند. استاد دلسوز به دانش‌آموز کمک می‌کند روخوانی، اصلاح، فهم و مرور را بدون خستگی متعادل کند.\n\nخانواده با تشویق تلاش، گوش دادن صبورانه و حفظ برنامه منظم می‌تواند از پیشرفت حمایت کند. این گام‌های کوچک به‌تدریج اعتماد و پیوندی ماندگار با قرآن می‌سازند.",
    category: "راهنمای یادگیری",
    cover_image_alt: "دانش‌آموز در حال یادگیری آنلاین قرآن از خانه",
    author_name: "گروه آموزشی SHIA TALEEM",
  },
  "prepare-for-your-first-online-quran-lesson": {
    title: "چگونه برای نخستین کلاس آنلاین قرآن آماده شویم",
    excerpt: "چند گام ساده برای یک جلسه نخست آرام، متمرکز و مفید با استاد.",
    body: "نخستین جلسه فرصتی است تا استاد سطح فعلی، هدف‌ها و سرعت مناسب شما را بشناسد. پیش از شروع، قرآن، دفتر یادداشت و دستگاهی مطمئن آماده کنید.\n\nدر محیطی آرام با نور مناسب بنشینید و میکروفن را آزمایش کنید. نگران اشتباه‌ها نباشید؛ این جلسه برای یافتن بهترین نقطه شروع و ساختن برنامه‌ای متناسب با شماست.\n\nپس از کلاس، یک هدف کوچک برای تمرین بنویسید و زمان جلسه بعد را تأیید کنید. شروع روشن، پیشرفت منظم را آسان‌تر می‌کند.",
    category: "شروع یادگیری",
    cover_image_alt: "دانش‌آموز در حال آماده شدن برای کلاس آنلاین قرآن",
    author_name: "پشتیبانی دانش‌آموزان SHIA TALEEM",
  },
  "tajweed-with-confidence": {
    title: "یادگیری تجوید با اعتماد و صبر",
    excerpt: "چرا اصلاح تدریجی و تمرین منظم از شتاب در حفظ قواعد مهم‌تر است.",
    body: "تجوید زمانی آسان‌تر می‌شود که هر قاعده با تلاوت واقعی پیوند داشته باشد. به‌جای حفظ همه‌چیز در یک مرحله، بهتر است گوش دهید، تکرار کنید و هر بار یک اصل را به کار ببرید.\n\nاصلاح صبورانه ضروری است. استاد باید تغییر را توضیح دهد، صدا را روشن اجرا کند و فرصت کافی برای تکرار بدهد. مرور منظم نیز تلاش آگاهانه را به عادت طبیعی تلاوت تبدیل می‌کند.\n\nپیشرفت ممکن است تدریجی باشد، اما تلفظ درست هر حرف ارزشمند است. استمرار و دلگرمی به دانش‌آموز کمک می‌کند با دقت و اطمینان تلاوت کند.",
    category: "مطالعات قرآن",
    cover_image_alt: "قرآن باز برای یک جلسه آموزشی هدایت‌شده",
    author_name: "گروه آموزشی SHIA TALEEM",
  },
};

const farsiGalleryCopy: Record<string, Pick<GalleryItem, "title" | "caption" | "category" | "image_alt">> = {
  "fallback-gallery-1": { title: "آموزش زنده و خصوصی قرآن", caption: "جلسه‌ای متمرکز و متناسب با سطح و سرعت هر دانش‌آموز.", category: "کلاس‌های زنده", image_alt: "دانش‌آموز در کلاس زنده آنلاین قرآن" },
  "fallback-gallery-2": { title: "اساتید خانم دلسوز", caption: "راهنمایی روشن، اصلاح صبورانه و محیط آموزشی محترمانه.", category: "اساتید", image_alt: "استاد خانم در حال برگزاری کلاس آنلاین" },
  "fallback-gallery-3": { title: "نخستین گام سنجیده", caption: "جلسه آزمایشی به خانواده کمک می‌کند استاد مناسب را بشناسد و برنامه‌ای عملی انتخاب کند.", category: "مسیر دانش‌آموز", image_alt: "دانش‌آموز در حال آغاز کلاس آنلاین قرآن" },
  "fallback-gallery-4": { title: "یادگیری همراه با قرآن", caption: "تمرین منظم، خواندن را روان، دقیق و مطمئن می‌سازد.", category: "مطالعات قرآن", image_alt: "قرآن باز در یک جلسه آموزشی" },
};

const blogColumns = "id,locale,slug,title,excerpt,body,category,cover_image_url,cover_image_alt,author_name,reading_time_minutes,is_featured,is_published,published_at,display_order,deleted_at,created_at,updated_at";
const galleryColumns = "id,locale,title,caption,category,image_url,image_alt,is_featured,is_published,published_at,display_order,deleted_at,created_at,updated_at";

function localizedPosts(locale: Locale): BlogPost[] {
  return fallbackPosts.map((post) => ({ ...post, ...(locale === "fa" ? farsiPostCopy[post.slug] : {}), locale }));
}

function localizedGallery(locale: Locale): GalleryItem[] {
  return fallbackGallery.map((item) => ({ ...item, ...(locale === "fa" ? farsiGalleryCopy[item.id] : {}), locale }));
}

export const getPublicBlogPosts = cache(async (locale: Locale): Promise<BlogPost[]> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return localizedPosts(locale);
  const { data, error } = await supabase.from("blog_posts").select(blogColumns).eq("locale", locale).eq("is_published", true).is("deleted_at", null).order("is_featured", { ascending: false }).order("display_order").order("published_at", { ascending: false });
  return error || !data?.length ? localizedPosts(locale) : data as BlogPost[];
});

export const getPublicBlogPost = cache(async (locale: Locale, slug: string): Promise<BlogPost | null> => {
  const posts = await getPublicBlogPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getPublicGalleryItems = cache(async (locale: Locale): Promise<GalleryItem[]> => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return localizedGallery(locale);
  const { data, error } = await supabase.from("gallery_items").select(galleryColumns).eq("locale", locale).eq("is_published", true).is("deleted_at", null).order("is_featured", { ascending: false }).order("display_order").order("published_at", { ascending: false });
  return error || !data?.length ? localizedGallery(locale) : data as GalleryItem[];
});

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("blog_posts").select(blogColumns).order("display_order").order("updated_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export async function getAdminGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("gallery_items").select(galleryColumns).order("display_order").order("updated_at", { ascending: false });
  return (data ?? []) as GalleryItem[];
}
