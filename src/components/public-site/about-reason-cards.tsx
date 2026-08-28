"use client";

import { useState } from "react";
import {
  CalendarClockIcon,
  CircleUserRoundIcon,
  ClipboardCheckIcon,
  GraduationCapIcon,
  RouteIcon,
  UsersRoundIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const reasonIcons = [
  GraduationCapIcon,
  CircleUserRoundIcon,
  CalendarClockIcon,
  RouteIcon,
  ClipboardCheckIcon,
  UsersRoundIcon,
] as const;

type ReasonItem = {
  title: string;
  description: string;
};

export function AboutReasonCards({ items }: { items: readonly ReasonItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 grid border-t border-primary/15 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const Icon = reasonIcons[index] ?? GraduationCapIcon;
        const isSelected = selectedIndex === index;

        return (
          <button
            key={item.title}
            type="button"
            aria-pressed={isSelected}
            data-about-reason-card
            data-state={isSelected ? "selected" : "idle"}
            onClick={() => setSelectedIndex((current) => (current === index ? null : index))}
            className={cn(
              "group relative flex min-h-72 w-full flex-col border-b border-primary/15 bg-transparent px-6 py-9 text-start text-foreground transition-[transform,border-radius,background-color,color,box-shadow] duration-300 ease-out outline-none md:px-8 md:odd:border-r lg:border-r lg:px-9 lg:[&:nth-child(3n)]:border-r-0",
              "hover:z-10 hover:-translate-y-1 hover:rounded-2xl hover:border-transparent hover:bg-sidebar hover:text-sidebar-foreground hover:shadow-2xl hover:shadow-sidebar/20",
              "focus-visible:z-10 focus-visible:rounded-2xl focus-visible:ring-3 focus-visible:ring-gold/70 focus-visible:ring-offset-2",
              isSelected &&
                "z-10 -translate-y-1 rounded-2xl border-transparent bg-sidebar text-sidebar-foreground ring-1 ring-gold/50 shadow-2xl shadow-sidebar/25"
            )}
          >
            <span
              data-reason-icon
              className={cn(
                "flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-[transform,background-color,color] duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-gold group-hover:text-sidebar",
                isSelected && "scale-110 -rotate-3 bg-gold text-sidebar"
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-heading text-xl font-semibold tracking-[-0.02em]">
              {item.title}
            </h3>
            <p
              className={cn(
                "mt-3 text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-sidebar-foreground/75",
                isSelected && "text-sidebar-foreground/75"
              )}
            >
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
