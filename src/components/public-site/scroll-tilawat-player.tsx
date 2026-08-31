"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const backgroundVolume = 0.06;

export function ScrollTilawatPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = backgroundVolume;

    function removeUnlockListeners() {
      window.removeEventListener("click", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
    }

    function beginPlayback() {
      void audio?.play().then(
        () => {
          removeUnlockListeners();
          setIsPlaying(true);
        },
        () => setIsPlaying(false)
      );
    }

    function unlockPlayback(event: Event) {
      removeUnlockListeners();

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("[data-tilawat-control]")
      ) {
        return;
      }

      beginPlayback();
    }

    window.addEventListener("click", unlockPlayback);
    window.addEventListener("keydown", unlockPlayback);
    beginPlayback();

    return () => {
      removeUnlockListeners();
      audio.pause();
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/surah-al-alaq.mp3"
        preload="none"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="fixed end-4 bottom-4 z-30 sm:end-6 sm:bottom-6">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={togglePlayback}
          data-tilawat-control
          aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
          aria-pressed={isPlaying}
          title={isPlaying ? "Pause recitation" : "Play recitation"}
          className="size-12 rounded-full border-sky-300/40 bg-sidebar/92 text-sky-200 shadow-xl shadow-black/20 backdrop-blur-md hover:scale-105 hover:border-sky-200 hover:bg-sidebar hover:text-sky-100"
        >
          {isPlaying ? (
            <PauseIcon aria-hidden="true" className="size-5" />
          ) : (
            <PlayIcon aria-hidden="true" className="ms-0.5 size-5" />
          )}
        </Button>
      </div>
    </>
  );
}
