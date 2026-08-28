"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { locales, type Locale, type TextDirection } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export function PublicMobileNav({
  locale,
  direction,
  dictionary,
}: {
  locale: Locale;
  direction: TextDirection;
  dictionary: Dictionary;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  function localePath(language: Locale) { const parts = pathname.split("/"); parts[1] = language; return parts.join("/") || `/${language}`; }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon-lg" className="ml-auto shrink-0 xl:hidden">
          <MenuIcon />
          <span className="sr-only">{dictionary.common.menu}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={direction === "rtl" ? "left" : "right"}
        closeLabel={dictionary.common.close}
      >
        <SheetHeader>
          <SheetTitle>{dictionary.common.menu}</SheetTitle>
          <SheetDescription>{dictionary.common.brandName}</SheetDescription>
        </SheetHeader>
        <nav
          aria-label={dictionary.common.menu}
          className="flex flex-col gap-1 px-4 py-2"
        >
          {dictionary.common.navigation.map((item) => (
            <Button key={item.href} variant="ghost" className="h-11 justify-start px-4" asChild>
              <Link href={`/${locale}${item.href}`} onClick={() => setOpen(false)} aria-current={(item.href === "" ? pathname === `/${locale}` : pathname.startsWith(`/${locale}${item.href}`)) ? "page" : undefined}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <div
            className="grid grid-cols-4 gap-1 rounded-lg border p-1"
            aria-label={dictionary.common.language}
          >
            {locales.map((language) => (
              <Button
                key={language}
                variant={language === locale ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={localePath(language)} onClick={() => setOpen(false)}>{language.toUpperCase()}</Link>
              </Button>
            ))}
          </div>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/login`} onClick={() => setOpen(false)}>{dictionary.common.signIn}</Link>
          </Button>
          <Button size="xl" asChild>
            <Link href={`/${locale}/free-trial`} onClick={() => setOpen(false)}>
              {dictionary.common.bookTrial}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
