import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryLibrary } from "@/components/public-site/gallery-library";
import { PublicPageHero } from "@/components/public-site/public-page-hero";
import { isLocale } from "@/i18n/config";
import { getPublicGalleryItems } from "@/server/repositories/content-library-repository";

export const metadata: Metadata = { title: "Gallery", description: "Learning moments, caring teachers, and Quran study experiences from the SHIA TALEEM community." };

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const items = await getPublicGalleryItems(locale);
  return <main id="main-content"><PublicPageHero eyebrow="Inside the academy" title="Learning moments from around the world" description="A window into focused lessons, caring teachers, and the everyday progress of our international learning community." /><GalleryLibrary items={items} /></main>;
}
