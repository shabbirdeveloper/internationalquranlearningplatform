"use client";

import { CalendarIcon } from "lucide-react";
import type { Locale as DateFnsLocale } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  placeholder,
  ariaLabel,
  displayLocale = "en",
  calendarLocale,
  disabled = false,
  className,
}: {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  placeholder: string;
  ariaLabel: string;
  displayLocale?: string;
  calendarLocale?: DateFnsLocale;
  disabled?: boolean;
  className?: string;
}) {
  const formattedValue = value
    ? new Intl.DateTimeFormat(displayLocale, { dateStyle: "medium" }).format(
        value
      )
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-start font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon data-icon="inline-start" />
          {formattedValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={calendarLocale}
        />
      </PopoverContent>
    </Popover>
  );
}
