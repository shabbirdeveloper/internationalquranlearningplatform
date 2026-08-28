"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/utils";

const heroMedia = [
  { src: "/images/shia-taleem-hero-learning.png", position: "object-center" },
  { src: "/images/shia-taleem-female-teacher.png", position: "object-[center_36%]" },
  { src: "/images/hero-online-class.png", position: "object-center" },
] as const;

const slideIntervalMs = 6500;

export function HomeHeroCarousel({
  locale,
  slides,
  labels,
  bookTrialLabel,
  exploreCoursesLabel,
}: {
  locale: Locale;
  slides: Dictionary["home"]["heroSlides"];
  labels: Dictionary["home"]["heroCarousel"];
  bookTrialLabel: string;
  exploreCoursesLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const slideCount = slides.length;
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (
      !playing ||
      interactionPaused ||
      slideCount < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [interactionPaused, playing, slideCount]);

  if (!activeSlide) return null;

  return (
    <section
      aria-label={labels.label}
      aria-roledescription="carousel"
      data-home-hero
      className="relative isolate flex min-h-[clamp(38rem,calc(100svh-8rem),52rem)] w-full overflow-hidden border-b border-border/70 bg-sidebar"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInteractionPaused(false);
        }
      }}
    >
      <div className="home-entrance-overlay pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
        <div className="home-entrance-panel home-entrance-panel-start" />
        <div className="home-entrance-panel home-entrance-panel-end" />
        <div className="home-entrance-brand">
          <span className="rounded-3xl bg-white/95 p-2 shadow-2xl shadow-black/20 ring-1 ring-white/30">
            <span className="relative block size-20">
              <Image
                src="/shia-taleem-logo.png"
                alt=""
                fill
                sizes="80px"
                className="object-contain"
              />
            </span>
          </span>
          <span className="font-heading text-sm font-semibold tracking-[0.24em] text-white">
            SHIA TALEEM
          </span>
        </div>
      </div>

      <div className="home-hero-sheen pointer-events-none absolute inset-y-0 z-20 w-1/3" aria-hidden="true" />

      <div className="absolute inset-0 -z-20">
        {slides.map((slide, index) => {
          const media = heroMedia[index] ?? heroMedia[0];
          return (
            <Image
              key={media.src}
              src={media.src}
              alt=""
              fill
              sizes="100vw"
              preload={index === 0}
              aria-hidden="true"
              className={cn(
                "object-cover motion-safe:transition-[opacity,transform] motion-safe:duration-1000 motion-safe:ease-out motion-reduce:transition-none",
                media.position,
                index === activeIndex ? "home-hero-active-media scale-100 opacity-100" : "scale-[1.025] opacity-0"
              )}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sidebar/95 via-sidebar/75 to-sidebar/10 rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sidebar/65 via-transparent to-transparent" />

      <button
        type="button"
        onClick={() => setPlaying((current) => !current)}
        className="sr-only focus:absolute focus:start-4 focus:top-4 focus:z-30 focus:not-sr-only focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        {playing ? labels.pause : labels.play}
      </button>

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div key={activeIndex} className="flex max-w-3xl flex-col items-start gap-7 text-start motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <span className="sr-only">{activeSlide.imageAlt}</span>
          <h1 className="max-w-3xl font-heading text-4xl leading-[1.07] font-bold tracking-[-0.045em] text-white drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-7xl">
            {activeSlide.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/85 drop-shadow-sm sm:text-lg sm:leading-8">
            {activeSlide.description}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="xl" asChild>
              <Link href={`/${locale}/free-trial`}>
                {bookTrialLabel}
                <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/45 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-sidebar" asChild>
              <Link href={`/${locale}/courses`}>
                {exploreCoursesLabel}
                <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {activeIndex + 1} / {slideCount}: {activeSlide.title}
      </p>
    </section>
  );
}
