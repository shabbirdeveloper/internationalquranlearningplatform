import Link from "next/link";
import {
  FileSearchIcon,
  GraduationCapIcon,
  Link2Icon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const metricIcons = [UsersIcon, ShieldCheckIcon, Link2Icon, UserRoundCheckIcon];

export function AdminDashboard({
  locale,
  summary,
  dictionary,
}: {
  locale: Locale;
  summary: {
    activeStudents: number | null;
    verifiedTeachers: number | null;
    pendingParentLinks: number | null;
    teacherApplications: number | null;
  };
  dictionary: Dictionary;
}) {
  const metricLabels = [
    dictionary.portal.metrics.activeStudents,
    dictionary.portal.metrics.verifiedTeachers,
    dictionary.portal.metrics.pendingParentLinks,
    dictionary.portal.metrics.teacherApplications,
  ];
  const metricValues = [
    summary.activeStudents,
    summary.verifiedTeachers,
    summary.pendingParentLinks,
    summary.teacherApplications,
  ];
  const copy = dictionary.portal.phase2;

  return (
    <main id="main-content" className="flex flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <section aria-label={dictionary.portal.academyOverview} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricLabels.map((label, index) => {
          const Icon = metricIcons[index] ?? GraduationCapIcon;
          return (
            <Card key={label} size="sm">
              <CardHeader>
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Icon aria-hidden="true" /></div>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl">{metricValues[index] ?? "—"}</CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader><CardTitle className="text-xl">{copy.adminPeopleTitle}</CardTitle><CardDescription>{dictionary.portal.emptyDescription}</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="h-auto justify-start py-4"><Link href={`/${locale}/admin/parent-links`}><Link2Icon data-icon="inline-start" />{copy.parentLinkReviews}</Link></Button>
            <Button asChild variant="outline" className="h-auto justify-start py-4"><Link href={`/${locale}/admin/teachers`}><UserRoundCheckIcon data-icon="inline-start" />{copy.teacherApplicationReviews}</Link></Button>
            <Button asChild variant="outline" className="h-auto justify-start py-4"><Link href={`/${locale}/admin/staff`}><UsersIcon data-icon="inline-start" />{copy.staffDirectory}</Link></Button>
            <Button asChild variant="outline" className="h-auto justify-start py-4"><Link href={`/${locale}/admin/courses`}><GraduationCapIcon data-icon="inline-start" />Manage courses</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-xl">{dictionary.portal.recentActivity}</CardTitle></CardHeader>
          <CardContent><Empty className="min-h-40"><EmptyHeader><EmptyMedia variant="icon"><FileSearchIcon /></EmptyMedia><EmptyTitle>{dictionary.portal.emptyTitle}</EmptyTitle><EmptyDescription>{dictionary.portal.emptyDescription}</EmptyDescription></EmptyHeader></Empty></CardContent>
        </Card>
      </section>
    </main>
  );
}
