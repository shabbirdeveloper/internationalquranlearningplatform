import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { updateSupabaseSession } from "@/lib/supabase/update-session";

function detectLocale(request: NextRequest): string {
  const acceptedLanguages = request.headers
    .get("accept-language")
    ?.split(",")
    .map((entry) => entry.split(";")[0]?.trim().toLowerCase())
    .filter((entry): entry is string => Boolean(entry));

  const matchedLocale = acceptedLanguages?.find((language) =>
    locales.some(
      (locale) =>
        language === locale || language.startsWith(`${locale}-`)
    )
  );

  const baseLocale = matchedLocale?.split("-")[0];
  return baseLocale && isLocale(baseLocale) ? baseLocale : defaultLocale;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (!firstSegment || !isLocale(firstSegment)) {
    const locale = detectLocale(request);
    const localizedUrl = request.nextUrl.clone();
    localizedUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(localizedUrl);
  }

  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
