import Link from "next/link";
import { Building2Icon, Link2Icon, UserRoundCheckIcon, UsersRoundIcon } from "lucide-react";

import {
  AssignStaffForm,
  CreateBranchForm,
  ParentLinkReviewControls,
  TeacherReviewControls,
} from "@/components/portal/admin-phase-two-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { getPendingParentLinks, getStaffDirectory, getTeacherReviewQueue } from "@/server/repositories/portal-repository";

type PendingLinks = Awaited<ReturnType<typeof getPendingParentLinks>>;
type TeacherQueue = Awaited<ReturnType<typeof getTeacherReviewQueue>>;
type StaffDirectory = Awaited<ReturnType<typeof getStaffDirectory>>;

function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return <div><h2 className="font-heading text-4xl font-semibold tracking-tight">{title}</h2><p className="mt-2 max-w-2xl text-muted-foreground">{description}</p></div>;
}

export function AdminPeopleHub({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const items = [
    { title: copy.parentLinkReviews, href: `/${locale}/admin/parent-links`, icon: Link2Icon },
    { title: copy.teacherApplicationReviews, href: `/${locale}/admin/teachers`, icon: UserRoundCheckIcon },
    { title: copy.staffDirectory, href: `/${locale}/admin/staff`, icon: Building2Icon },
  ];
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><AdminPageHeader title={copy.adminPeopleTitle} description={dictionary.portal.emptyDescription} /><div className="grid gap-5 lg:grid-cols-3">{items.map((item) => { const Icon = item.icon; return <Card key={item.href}><CardHeader><span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Icon className="size-5" /></span><CardTitle className="mt-4 text-xl">{item.title}</CardTitle><CardDescription>{dictionary.portal.emptyDescription}</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link href={item.href}>{dictionary.common.viewAll}</Link></Button></CardContent></Card>; })}</div></main>;
}

function QueueEmpty({ dictionary }: { dictionary: Dictionary }) {
  return <Empty className="min-h-56"><EmptyHeader><EmptyMedia variant="icon"><UsersRoundIcon /></EmptyMedia><EmptyTitle>{dictionary.portal.phase2.reviewQueueEmpty}</EmptyTitle><EmptyDescription>{dictionary.portal.emptyDescription}</EmptyDescription></EmptyHeader></Empty>;
}

export function ParentLinkReviewPage({ locale, links, dictionary }: { locale: Locale; links: PendingLinks; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><AdminPageHeader title={copy.parentLinkReviews} description={copy.linkRequestDescription} /><Card><CardContent className="overflow-x-auto p-0">{links.length ? <Table><TableHeader><TableRow><TableHead>{dictionary.portal.parent}</TableHead><TableHead>{dictionary.portal.student}</TableHead><TableHead>{copy.studentNumber}</TableHead><TableHead>{copy.relationship}</TableHead><TableHead className="text-end">{dictionary.portal.table.status}</TableHead></TableRow></TableHeader><TableBody>{links.map((link) => <TableRow key={link.id}><TableCell>{link.parentName ?? "—"}</TableCell><TableCell>{link.studentName ?? "—"}</TableCell><TableCell>{link.studentNumber ?? "—"}</TableCell><TableCell>{link.relationship}</TableCell><TableCell><ParentLinkReviewControls locale={locale} linkId={link.id} dictionary={dictionary} /></TableCell></TableRow>)}</TableBody></Table> : <QueueEmpty dictionary={dictionary} />}</CardContent></Card></main>;
}

export function TeacherReviewPage({ locale, applications, dictionary }: { locale: Locale; applications: TeacherQueue; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><AdminPageHeader title={copy.teacherApplicationReviews} description={copy.privateDocuments} /><Card><CardContent className="overflow-x-auto p-0">{applications.length ? <Table><TableHeader><TableRow><TableHead>{copy.teacherVerification}</TableHead><TableHead>{dictionary.portal.teacher}</TableHead><TableHead>{dictionary.portal.table.status}</TableHead><TableHead>{dictionary.portal.table.updated}</TableHead><TableHead className="text-end">{copy.verificationStatus}</TableHead></TableRow></TableHeader><TableBody>{applications.map((application) => <TableRow key={application.id}><TableCell>{application.application_number}</TableCell><TableCell>{application.teacherName ?? "—"}</TableCell><TableCell><Badge variant="outline">{copy.statusLabels[application.status] ?? application.status}</Badge></TableCell><TableCell>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(application.updated_at))}</TableCell><TableCell className="text-end"><TeacherReviewControls locale={locale} applicationId={application.id} status={application.status} dictionary={dictionary} /></TableCell></TableRow>)}</TableBody></Table> : <QueueEmpty dictionary={dictionary} />}</CardContent></Card></main>;
}

export function StaffDirectoryPage({ locale, directory, dictionary }: { locale: Locale; directory: StaffDirectory; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><AdminPageHeader title={copy.staffDirectory} description={copy.branchScope} /><AssignStaffForm locale={locale} branches={directory.branches} dictionary={dictionary} /></div><section className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]"><Card><CardHeader><CardTitle className="text-xl">{copy.createBranch}</CardTitle><CardDescription>{copy.branchScope}</CardDescription></CardHeader><CardContent><CreateBranchForm locale={locale} dictionary={dictionary} /></CardContent></Card><Card><CardHeader><CardTitle className="text-xl">{copy.staffDirectory}</CardTitle></CardHeader><CardContent className="overflow-x-auto p-0">{directory.memberships.length ? <Table><TableHeader><TableRow><TableHead>{copy.fullName}</TableHead><TableHead>{copy.staffEmail}</TableHead><TableHead>{copy.branchName}</TableHead><TableHead>{copy.jobTitle}</TableHead></TableRow></TableHeader><TableBody>{directory.memberships.map((membership) => <TableRow key={membership.id}><TableCell>{membership.fullName ?? "—"}</TableCell><TableCell>{membership.email ?? "—"}</TableCell><TableCell>{membership.branch?.name ?? "—"}</TableCell><TableCell>{membership.staff?.job_title ?? "—"}</TableCell></TableRow>)}</TableBody></Table> : <QueueEmpty dictionary={dictionary} />}</CardContent></Card></section></main>;
}
