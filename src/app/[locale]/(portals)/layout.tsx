import { notFound } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getTextDirection, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireSession } from "@/server/authorization/access";

function formatPortalDate(locale: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeZone,
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeZone: "UTC",
    }).format(new Date());
  }
}

export default async function PortalsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeValue } = await params;

  if (!isLocale(localeValue)) notFound();

  const requestedPath = `/${localeValue}`;
  const [dictionary, access] = await Promise.all([
    getDictionary(localeValue),
    requireSession(localeValue, requestedPath),
  ]);
  const dateLabel = formatPortalDate(localeValue, access.timeZone);

  return (
    <PortalShell
      access={access}
      locale={localeValue}
      direction={getTextDirection(localeValue)}
      dateLabel={dateLabel}
      dictionary={dictionary}
    >
      {children}
    </PortalShell>
  );
}
