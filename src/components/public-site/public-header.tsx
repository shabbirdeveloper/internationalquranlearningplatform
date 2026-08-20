import Link from "next/link";
import { ArrowRightIcon, Globe2Icon } from "lucide-react";

import { AcademyBrand } from "@/components/brand/academy-brand";
import {
  PublicDesktopNav,
  PublicLanguageSwitcher,
} from "@/components/public-site/public-desktop-nav";
import { PublicMobileNav } from "@/components/public-site/public-mobile-nav";
import { Button } from "@/components/ui/button";
import { getTextDirection, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function PublicHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 shadow-[0_10px_35px_-28px_oklch(0.19_0.04_248_/_45%)] backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-center gap-2 overflow-hidden px-4 text-center text-[0.65rem] font-medium tracking-wide sm:px-6 sm:text-[0.7rem] lg:px-8">
          <Globe2Icon aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{dictionary.home.globalDescription}</span>
        </div>
      </div>
      <div
        dir="ltr"
        className="mx-auto flex h-24 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="shrink-0">
          <AcademyBrand
            href={`/${locale}`}
            name={dictionary.common.brandName}
            preload
          />
        </div>
        <PublicDesktopNav
          locale={locale}
          items={dictionary.common.navigation}
          label={dictionary.common.menu}
        />
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <PublicLanguageSwitcher
            locale={locale}
            label={dictionary.common.language}
          />
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/login`}>{dictionary.common.signIn}</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href={`/${locale}/free-trial`}>
              {dictionary.common.bookTrial}
              <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <PublicMobileNav
          locale={locale}
          direction={getTextDirection(locale)}
          dictionary={dictionary}
        />
      </div>
    </header>
  );
}
