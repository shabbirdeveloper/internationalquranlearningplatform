import { notFound } from "next/navigation";

import { PublicFooter } from "@/components/public-site/public-footer";
import { PublicHeader } from "@/components/public-site/public-header";
import { PremiumTouchFeedback } from "@/components/public-site/premium-touch-feedback";
import { ScrollTilawatPlayer } from "@/components/public-site/scroll-tilawat-player";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) {
    notFound();
  }

  const dictionary = await getDictionary(localeValue);

  return (
    <PremiumTouchFeedback>
      <PublicHeader locale={localeValue} dictionary={dictionary} />
      {children}
      <PublicFooter locale={localeValue} dictionary={dictionary} />
      <ScrollTilawatPlayer locale={localeValue} />
    </PremiumTouchFeedback>
  );
}
