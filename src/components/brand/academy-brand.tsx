import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function AcademyBrand({
  href,
  name,
  inverse = false,
  compact = false,
  preload = false,
}: {
  href: string;
  name: string;
  inverse?: boolean;
  compact?: boolean;
  preload?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${name} homepage`}
      title={`${name} — Home`}
      data-home-brand-link
      className={cn(
        "-m-2 inline-flex cursor-pointer items-center rounded-xl p-2 outline-none transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]",
        inverse ? "text-sidebar-foreground" : "text-primary"
      )}
    >
      <span
        className={cn(
          "relative block shrink-0 overflow-hidden",
          compact ? "size-11" : "size-20",
          inverse ? "rounded-xl bg-white/95 p-1 shadow-sm" : null
        )}
      >
        <Image
          src="/shia-taleem-logo.png"
          alt=""
          fill
          sizes={compact ? "44px" : "80px"}
          className="object-contain"
          preload={preload}
        />
      </span>
      <span className="sr-only">{name}</span>
    </Link>
  );
}
