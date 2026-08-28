"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { locales, type Locale } from "@/i18n/config";
import type { NavItem } from "@/i18n/types";

function switchLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  parts[1] = locale;
  return parts.join("/") || `/${locale}`;
}

export function PublicDesktopNav({ locale, items, label }: { locale: Locale; items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="hidden flex-1 items-center justify-center xl:flex">
      {items.map((item) => {
        const href = `/${locale}${item.href}`;
        const active = item.href === "" ? pathname === `/${locale}` : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Button
            key={item.href || "home"}
            variant={active ? "secondary" : "ghost"}
            size="sm"
            className="px-2.5 text-[0.88rem] font-medium"
            asChild
          >
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100 aria-[current=page]:after:scale-x-0"
            >
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function PublicLanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center rounded-lg border border-border/80 bg-muted/55 p-0.5"
      aria-label={label}
    >
      {locales.map((language) => (
        <Button
          key={language}
          variant={language === locale ? "secondary" : "ghost"}
          size="xs"
          asChild
        >
          <Link href={switchLocale(pathname, language)}>
            {language.toUpperCase()}
          </Link>
        </Button>
      ))}
    </div>
  );
}
