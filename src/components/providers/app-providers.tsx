"use client";

import { Direction } from "radix-ui";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { TextDirection } from "@/i18n/config";

export function AppProviders({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: TextDirection;
}) {
  return (
    <Direction.Provider dir={direction}>
      <TooltipProvider>{children}</TooltipProvider>
    </Direction.Provider>
  );
}
