"use client";

import { CheckIcon, Share2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CourseShareButton({ title, label }: { title: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function shareCourse() {
    const shareData = { title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" variant="ghost" onClick={shareCourse} aria-live="polite">
      {copied ? <CheckIcon data-icon="inline-start" /> : <Share2Icon data-icon="inline-start" />}
      {copied ? "Link copied" : label}
    </Button>
  );
}
