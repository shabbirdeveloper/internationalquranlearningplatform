"use client";

import { PauseIcon, PlayIcon, Volume1Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type PlaybackState = "idle" | "playing" | "paused" | "blocked";

const playerCopy: Record<
  Locale,
  { title: string; play: string; pause: string; permission: string }
> = {
  en: {
    title: "Surah Al-Ikhlas",
    play: "Play recitation",
    pause: "Pause recitation",
    permission: "Tap to play",
  },
  ur: {
    title: "سورۃ الاخلاص",
    play: "تلاوت چلائیں",
    pause: "تلاوت روکیں",
    permission: "تلاوت سننے کے لیے دبائیں",
  },
  ar: {
    title: "سورة الإخلاص",
    play: "تشغيل التلاوة",
    pause: "إيقاف التلاوة مؤقتًا",
    permission: "اضغط لتشغيل التلاوة",
  },
  fa: {
    title: "سوره اخلاص",
    play: "پخش تلاوت",
    pause: "توقف تلاوت",
    permission: "برای پخش لمس کنید",
  },
};

const scrollThreshold = 80;
const backgroundVolume = 0.12;

export function ScrollTilawatPlayer({ locale }: { locale: Locale }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const attemptedRef = useRef(false);
  const [state, setState] = useState<PlaybackState>("idle");
  const copy = playerCopy[locale];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = backgroundVolume;

    async function startFromScroll() {
      if (attemptedRef.current) return;
      attemptedRef.current = true;
      window.removeEventListener("scroll", handleScroll);

      try {
        await audio?.play();
        setState("playing");
      } catch {
        setState("blocked");
      }
    }

    function handleScroll() {
      if (window.scrollY >= scrollThreshold) {
        void startFromScroll();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      audio.pause();
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setState("paused");
      return;
    }

    try {
      await audio.play();
      setState("playing");
    } catch {
      setState("blocked");
    }
  }

  const isPlaying = state === "playing";
  const isVisible = state !== "idle";
  const actionLabel = isPlaying ? copy.pause : state === "blocked" ? copy.permission : copy.play;

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/surah-al-ikhlas.ogg"
        preload="none"
        loop
      />
      <div
        className={cn(
          "fixed end-4 bottom-4 z-30 transition-[opacity,transform] duration-300 sm:end-6 sm:bottom-6",
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={togglePlayback}
          aria-label={`${actionLabel}: ${copy.title}`}
          aria-pressed={isPlaying}
          className="h-auto min-h-11 gap-3 rounded-full border-gold/30 bg-sidebar/92 px-3.5 py-2 text-sidebar-foreground shadow-xl shadow-black/20 backdrop-blur-md hover:bg-sidebar hover:text-white"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {isPlaying ? <Volume1Icon aria-hidden="true" /> : <PlayIcon aria-hidden="true" className="ms-0.5" />}
            {isPlaying ? (
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30" aria-hidden="true" />
            ) : null}
          </span>
          <span className="hidden text-start leading-tight sm:block">
            <span className="block text-xs font-semibold">{copy.title}</span>
            <span className="mt-0.5 block text-[0.65rem] font-normal text-sidebar-foreground/60">
              {actionLabel}
            </span>
          </span>
          {isPlaying ? <PauseIcon aria-hidden="true" className="hidden size-3.5 sm:block" /> : null}
        </Button>
      </div>
    </>
  );
}
