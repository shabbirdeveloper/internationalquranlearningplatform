"use client";

import { useEffect, useRef } from "react";

const premiumTargetSelector =
  '[data-premium-interactive="true"], [data-premium-hover]';
const feedbackDurationMs = 720;

export function PremiumTouchFeedback({ children }: { children: React.ReactNode }) {
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

  return (
    <div
      className="public-site flex min-h-svh flex-1 flex-col"
      onPointerDownCapture={showFeedback}
    >
      {children}
    </div>
  );
}
