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
      className={cn(
        "inline-flex items-center rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
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
