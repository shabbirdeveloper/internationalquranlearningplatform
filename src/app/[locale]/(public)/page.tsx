import { notFound } from "next/navigation";

import { HomeFaq } from "@/components/public-site/home-faq";
import { HomeDiscoverySections } from "@/components/public-site/home-discovery-sections";
import { HomeHero } from "@/components/public-site/home-hero";
import { HomeLearning } from "@/components/public-site/home-learning";
import { HomeSocialConnect } from "@/components/public-site/home-social-connect";
import { HomeTrust } from "@/components/public-site/home-trust";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getPublicBlogPosts,
  getPublicGalleryItems,
} from "@/server/repositories/content-library-repository";
import { getPublicPricingData } from "@/server/repositories/pricing-repository";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) {
    notFound();
  }

  const [dictionary, pricing, posts, gallery] = await Promise.all([
    getDictionary(localeValue),
    getPublicPricingData(),
    getPublicBlogPosts(localeValue),
    getPublicGalleryItems(localeValue),
  ]);

  return (
    <main id="main-content" data-home-page className="overflow-x-clip">
      <HomeHero locale={localeValue} dictionary={dictionary} />
      <HomeLearning locale={localeValue} dictionary={dictionary} />
      <HomeTrust locale={localeValue} dictionary={dictionary} />
      <HomeFaq locale={localeValue} dictionary={dictionary} />
      <HomeDiscoverySections
        locale={localeValue}
        pricing={pricing}
        posts={posts}
        gallery={gallery}
      />
      <HomeSocialConnect locale={localeValue} />
    </main>
  );
}
