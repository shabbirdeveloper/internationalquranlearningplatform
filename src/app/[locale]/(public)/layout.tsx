import { notFound } from "next/navigation";

import { PublicFooter } from "@/components/public-site/public-footer";
import { PublicHeader } from "@/components/public-site/public-header";
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
    <div className="public-site flex min-h-svh flex-1 flex-col">
      <PublicHeader locale={localeValue} dictionary={dictionary} />
      {children}
      <PublicFooter locale={localeValue} dictionary={dictionary} />
    </div>
  );
}
