import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  Globe2Icon,
  MapPinIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type ChecklistItem = {
  label: string;
  description: string;
  complete: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

type StatusItem = {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function PortalOnboardingOverview({
  locale,
  portal,
  displayName,
  checklist,
  statusItems,
  activityTitle,
  activityDescription,
  dictionary,
  children,
}: {
  locale: Locale;
  portal: "student" | "parent" | "teacher" | "staff";
  displayName: string;
  checklist: ChecklistItem[];
  statusItems: StatusItem[];
  activityTitle: string;
  activityDescription: string;
  dictionary: Dictionary;
  children?: React.ReactNode;
}) {
  const completeCount = checklist.filter((item) => item.complete).length;
  const percentage = Math.round((completeCount / Math.max(checklist.length, 1)) * 100);
  const copy = dictionary.portal.phase2;

  return (
    <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <div className="mb-6">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">
              {copy.welcome}, {displayName}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{copy.profilePrompt}</p>
          </div>

          <div className="mb-6 max-w-3xl">
            <div className="mb-2 flex items-center justify-between gap-4 text-sm font-medium">
              <span>{copy.profileCompletion.replace("{percent}", String(percentage))}</span>
              <span className="text-muted-foreground">{completeCount}/{checklist.length}</span>
            </div>
            <Progress value={percentage} aria-label={copy.profileCompletion.replace("{percent}", String(percentage))} />
          </div>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-xl">{copy.profileChecklist}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {checklist.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      href={`/${locale}/${portal}/profile`}
                      key={item.label}
                      className="group flex items-center gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-background text-primary group-hover:bg-accent">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{item.label}</span>
                        <span className="block text-sm text-muted-foreground">{item.description}</span>
                      </span>
                      <span className={item.complete ? "flex items-center gap-2 text-sm text-primary" : "flex items-center gap-2 text-sm text-gold"}>
                        {item.complete ? <CheckCircle2Icon className="size-5" /> : <CircleDashedIcon className="size-5" />}
                        <span className="hidden sm:inline">{item.complete ? copy.complete : copy.incomplete}</span>
                      </span>
                      <ArrowRightIcon className="size-4 text-muted-foreground rtl:rotate-180" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{copy.accountStatus}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {statusItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </section>

      {children}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{activityTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-36 flex-col items-center justify-center gap-3 border-t text-center text-muted-foreground">
          <BookOpenIcon className="size-10" />
          <p className="max-w-xl">{activityDescription}</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href={`/${locale}/${portal}/profile`}>
            {copy.completeProfile}
            <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href={`/${locale}/${portal}/profile`}>{copy.viewAccountDetails}</Link>
        </Button>
      </div>
    </main>
  );
}

export const checklistIcons = {
  contact: MapPinIcon,
  role: UserRoundIcon,
  locale: Globe2Icon,
};

export const statusIcons = {
  user: UserRoundIcon,
  secure: ShieldCheckIcon,
  time: Clock3Icon,
};
