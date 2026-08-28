"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const premiumTargetSelector =
  '[data-premium-interactive="true"], [data-premium-hover]';
const feedbackDurationMs = 720;
const scrollRevealSelector =
  'main > section:not(:first-child):not([data-quran-ayah-ticker]), main > article, main > div:not(.sticky) > section';

export function PremiumTouchFeedback({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTarget = useRef<HTMLElement | null>(null);
  const clearTimer = useRef<number | null>(null);

  function clearFeedback() {
    if (clearTimer.current !== null) {
      window.clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }

    if (activeTarget.current) {
      delete activeTarget.current.dataset.touchActive;
      activeTarget.current = null;
    }
  }

  function showFeedback(event: React.PointerEvent<HTMLDivElement>) {
    const target = (event.target as Element).closest<HTMLElement>(premiumTargetSelector);

    if (!target || !event.currentTarget.contains(target)) return;

    clearFeedback();
    target.dataset.touchActive = "true";
    activeTarget.current = target;
    clearTimer.current = window.setTimeout(clearFeedback, feedbackDurationMs);
  }

  useEffect(() => clearFeedback, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | null = null;
    const frame = window.requestAnimationFrame(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(scrollRevealSelector)
      );

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.scrollReveal = "visible";
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      for (const target of targets) {
        const alreadyNearViewport = target.getBoundingClientRect().top <= window.innerHeight * 0.9;
        target.dataset.scrollReveal = alreadyNearViewport ? "visible" : "pending";
        if (!alreadyNearViewport) observer.observe(target);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <div
      className="public-site flex min-h-svh flex-1 flex-col"
      onPointerDownCapture={showFeedback}
    >
      {children}
    </div>
  );
}
