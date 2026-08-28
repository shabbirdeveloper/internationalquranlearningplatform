import type { Locale } from "@/i18n/config";

import styles from "./quran-ayah-ticker.module.css";

const ayahCopy: Record<
  Locale,
  { label: string; translation: string; reference: string }
> = {
  en: {
    label: "Quran verse",
    translation: "So which of your Lord’s favors will you both deny?",
    reference: "Surah Ar-Rahman · 55:13",
  },
  ur: {
    label: "قرآنی آیت",
    translation: "پس تم اپنے رب کی کون کون سی نعمتوں کو جھٹلاؤ گے؟",
    reference: "سورۃ الرحمٰن · 55:13",
  },
  ar: {
    label: "آية قرآنية",
    translation: "فأي نعم ربكما تكذبان؟",
    reference: "سورة الرحمن · 55:13",
  },
  fa: {
    label: "آیه قرآن",
    translation: "پس کدام‌یک از نعمت‌های پروردگارتان را انکار می‌کنید؟",
    reference: "سوره الرحمن · ۵۵:۱۳",
  },
};

const ayah = "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ";

function AyahContent({
  copy,
}: {
  copy: (typeof ayahCopy)[Locale];
}) {
  return (
    <span className="flex shrink-0 items-center gap-4 pe-12 sm:gap-6 sm:pe-16">
      <span
        lang="ar"
        dir="rtl"
        className="font-arabic text-xl leading-none font-semibold text-white sm:text-2xl"
      >
        {ayah}
      </span>
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
      <span className="whitespace-nowrap text-sm text-white/78 sm:text-base">
        {copy.translation}
      </span>
      <span className="whitespace-nowrap rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold sm:text-sm">
        {copy.reference}
      </span>
    </span>
  );
}

export function QuranAyahTicker({ locale }: { locale: Locale }) {
  const copy = ayahCopy[locale];

  return (
    <section
      data-quran-ayah-ticker
      aria-label={copy.label}
      className="relative z-10 border-b border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <p className="sr-only">
        {ayah}. {copy.translation} {copy.reference}
      </p>
      <div className="flex min-h-14 w-full items-stretch sm:min-h-16">
        <div className={`${styles.ticker} min-w-0 flex-1 overflow-hidden`} dir="ltr">
          <div className={`${styles.track} h-full items-center ps-6 sm:ps-8`} aria-hidden="true">
            <AyahContent copy={copy} />
            <AyahContent copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
}
