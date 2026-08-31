"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";

const whatsappNumber = "923195951872";

const socialCopy: Record<
  Locale,
  {
    title: string;
    description: string;
    whatsapp: string;
    facebook: string;
    x: string;
    floatingWhatsapp: string;
    message: string;
  }
> = {
  en: {
    title: "Stay connected with Shia Taleem",
    description:
      "Message our team directly or share the academy with families looking for thoughtful online Quran learning.",
    whatsapp: "Chat on WhatsApp",
    facebook: "Share on Facebook",
    x: "Share on X",
    floatingWhatsapp: "Chat with Shia Taleem on WhatsApp",
    message: "Assalamu Alaikum, I would like to know more about Shia Taleem.",
  },
  ur: {
    title: "شیعہ تعلیم سے جڑے رہیں",
    description:
      "ہماری ٹیم کو براہ راست پیغام بھیجیں یا آن لائن قرآنی تعلیم تلاش کرنے والے خاندانوں کے ساتھ اکیڈمی شیئر کریں۔",
    whatsapp: "واٹس ایپ پر رابطہ کریں",
    facebook: "فیس بک پر شیئر کریں",
    x: "ایکس پر شیئر کریں",
    floatingWhatsapp: "واٹس ایپ پر شیعہ تعلیم سے رابطہ کریں",
    message: "السلام علیکم، میں شیعہ تعلیم کے بارے میں مزید جاننا چاہتا ہوں۔",
  },
  ar: {
    title: "ابقوا على تواصل مع شيعة تعليم",
    description:
      "راسلوا فريقنا مباشرة أو شاركوا الأكاديمية مع العائلات الباحثة عن تعليم قرآني متقن عبر الإنترنت.",
    whatsapp: "تواصل عبر واتساب",
    facebook: "شارك على فيسبوك",
    x: "شارك على إكس",
    floatingWhatsapp: "تواصل مع شيعة تعليم عبر واتساب",
    message: "السلام عليكم، أود معرفة المزيد عن شيعة تعليم.",
  },
  fa: {
    title: "با شیعه تعلیم در ارتباط باشید",
    description:
      "مستقیماً با تیم ما پیام دهید یا آکادمی را با خانواده‌های علاقه‌مند به آموزش آنلاین قرآن به اشتراک بگذارید.",
    whatsapp: "گفتگو در واتساپ",
    facebook: "اشتراک‌گذاری در فیسبوک",
    x: "اشتراک‌گذاری در ایکس",
    floatingWhatsapp: "ارتباط با شیعه تعلیم در واتساپ",
    message: "السلام علیکم، می‌خواهم درباره شیعه تعلیم بیشتر بدانم.",
  },
};

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

function openShare(platform: "facebook" | "x", locale: Locale) {
  const pageUrl = `${window.location.origin}/${locale}`;
  const url =
    platform === "facebook"
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
      : `https://x.com/intent/post?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent("Discover thoughtful online Quran learning with Shia Taleem.")}`;

  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}

export function HomeSocialConnect({ locale }: { locale: Locale }) {
  const copy = socialCopy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(copy.message)}`;
  const actionClass =
    "group flex min-h-14 items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/60 active:translate-y-0";

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby="social-connect-title"
        className="public-page-hero-pattern relative overflow-hidden border-y border-sidebar-border text-sidebar-foreground"
      >
        <div className="pointer-events-none absolute -start-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-[#25D366]/10 blur-3xl" />
        <div className="pointer-events-none absolute -end-16 top-0 size-56 rounded-full bg-[#1877F2]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="social-connect-title"
              className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl"
            >
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-sidebar-foreground/70 sm:text-lg">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end" aria-label={copy.title}>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-social-action="whatsapp"
              className={`${actionClass} bg-[#25D366] text-[#062f1c] hover:text-[#062f1c]`}
            >
              <WhatsAppLogo className="size-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              <span>{copy.whatsapp}</span>
              <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
            </a>

            <button
              type="button"
              data-social-action="facebook"
              onClick={() => openShare("facebook", locale)}
              className={`${actionClass} bg-[#1877F2] text-white`}
            >
              <FacebookLogo className="size-6 transition-transform duration-300 group-hover:scale-110" />
              <span>{copy.facebook}</span>
            </button>

            <button
              type="button"
              data-social-action="x"
              onClick={() => openShare("x", locale)}
              className={`${actionClass} bg-white text-black`}
            >
              <XLogo className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <span>{copy.x}</span>
            </button>
          </div>
        </div>
      </section>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-home-whatsapp-cta
        aria-label={copy.floatingWhatsapp}
        className={`group fixed bottom-4 start-4 z-40 flex min-h-12 items-center gap-2.5 rounded-full bg-[#25D366] px-3.5 py-2.5 font-semibold text-[#062f1c] shadow-2xl shadow-black/25 transition-[opacity,transform] duration-300 hover:scale-105 active:scale-95 sm:bottom-6 sm:start-6 sm:px-4 ${
          isSectionVisible
            ? "pointer-events-none translate-y-4 scale-90 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <span className="absolute -inset-1 -z-10 rounded-full bg-[#25D366]/35 motion-safe:animate-ping" aria-hidden="true" />
        <WhatsAppLogo className="size-6 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
        <span className="hidden text-sm sm:inline">WhatsApp</span>
      </a>
    </>
  );
}
