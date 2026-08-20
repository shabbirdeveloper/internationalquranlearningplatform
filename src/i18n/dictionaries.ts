import "server-only";

import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/i18n/dictionaries/en").then((module) => module.default),
  ur: () => import("@/i18n/dictionaries/ur").then((module) => module.default),
  ar: () => import("@/i18n/dictionaries/ar").then((module) => module.default),
};

export async function getDictionary(localeValue: string): Promise<Dictionary> {
  if (!isLocale(localeValue)) {
    notFound();
  }

  return loaders[localeValue]();
}
