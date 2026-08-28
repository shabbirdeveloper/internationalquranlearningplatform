import type { Metadata } from "next";
import {
  Geist_Mono,
  Noto_Naskh_Arabic,
  Poppins,
} from "next/font/google";
import { notFound } from "next/navigation";

import { AppProviders } from "@/components/providers/app-providers";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getTextDirection,
  isLocale,
  locales,
} from "@/i18n/config";

import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh-arabic",
  subsets: ["arabic", "latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SHIA TALEEM",
    template: "%s | SHIA TALEEM",
  },
  description:
    "Live online Quran and Shia Islamic education with verified teachers, flexible schedules, and family progress visibility.",
  icons: {
    icon: [
      {
        url: "/shia-taleem-logo.png",
        type: "image/png",
        sizes: "1254x1254",
      },
    ],
    shortcut: "/shia-taleem-logo.png",
    apple: [
      {
        url: "/shia-taleem-logo.png",
        type: "image/png",
        sizes: "1254x1254",
      },
    ],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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

  const [dictionary] = await Promise.all([getDictionary(localeValue)]);
  const direction = getTextDirection(localeValue);

  return (
    <html
      lang={localeValue}
      dir={direction}
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${geistMono.variable} ${notoNaskh.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:not-sr-only"
        >
          {dictionary.common.skipToContent}
        </a>
        <AppProviders direction={direction}>{children}</AppProviders>
      </body>
    </html>
  );
}
