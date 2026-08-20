import { LockKeyholeIcon } from "lucide-react";

import {
  CoreProfileForm,
  ParentProfileForm,
  StudentProfileForm,
  TeacherProfileForm,
} from "@/components/portal/profile-forms";
import { TeacherDocumentUpload } from "@/components/portal/teacher-document-upload";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type {
  ParentPortalSnapshot,
  StaffPortalSnapshot,
  StudentPortalSnapshot,
  TeacherPortalSnapshot,
} from "@/server/repositories/portal-repository";

function ProfilePageShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main id="main-content" className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8"><div><h2 className="font-heading text-4xl font-semibold tracking-tight">{title}</h2><p className="mt-2 max-w-2xl text-muted-foreground">{description}</p></div>{children}</main>;
}

function FormCard({ children }: { children: React.ReactNode }) {
  return <Card><CardContent className="py-2">{children}</CardContent></Card>;
}

export function StudentProfilePage({ locale, snapshot, dictionary }: { locale: Locale; snapshot: StudentPortalSnapshot; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <ProfilePageShell title={copy.profileTitle} description={copy.profilePrompt}><div className="grid gap-6 xl:grid-cols-2"><FormCard><CoreProfileForm locale={locale} portal="student" profile={snapshot.core} dictionary={dictionary} /></FormCard><FormCard><StudentProfileForm locale={locale} profile={snapshot.student} dictionary={dictionary} /></FormCard></div></ProfilePageShell>;
}

export function ParentProfilePage({ locale, snapshot, dictionary }: { locale: Locale; snapshot: ParentPortalSnapshot; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <ProfilePageShell title={copy.profileTitle} description={copy.profilePrompt}><div className="grid gap-6 xl:grid-cols-2"><FormCard><CoreProfileForm locale={locale} portal="parent" profile={snapshot.core} dictionary={dictionary} /></FormCard><FormCard><ParentProfileForm locale={locale} profile={snapshot.parent} dictionary={dictionary} /></FormCard></div></ProfilePageShell>;
}

export function StaffProfilePage({ locale, snapshot, dictionary }: { locale: Locale; snapshot: StaffPortalSnapshot; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <ProfilePageShell title={copy.profileTitle} description={copy.profilePrompt}><div className="max-w-4xl"><FormCard><CoreProfileForm locale={locale} portal="staff" profile={snapshot.core} dictionary={dictionary} /></FormCard></div></ProfilePageShell>;
}

export function TeacherProfilePage({ locale, snapshot, dictionary }: { locale: Locale; snapshot: TeacherPortalSnapshot; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return (
    <ProfilePageShell title={copy.teacherProfileTitle} description={copy.privateDocuments}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <FormCard><CoreProfileForm locale={locale} portal="teacher" profile={snapshot.core} dictionary={dictionary} /></FormCard>
          <FormCard><TeacherProfileForm locale={locale} profile={snapshot.teacher} languages={snapshot.languages.map((language) => language.language_code)} availability={snapshot.availability} defaultTimeZone={snapshot.core?.time_zone ?? "UTC"} dictionary={dictionary} /></FormCard>
        </div>
        <aside className="flex flex-col gap-6">
          <Card><CardHeader><CardTitle className="text-xl">{copy.verificationStatus}</CardTitle><CardDescription>{copy.documentsRequired}</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">
            {snapshot.documents.map((document) => <div key={document.id} className="rounded-lg border p-3"><div className="flex items-start gap-2"><LockKeyholeIcon className="mt-0.5 size-4 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{document.original_filename}</p><p className="mt-1 text-xs text-muted-foreground">{copy.statusLabels[document.scan_status] ?? document.scan_status}</p></div></div><Badge variant="outline" className="mt-2">{copy.statusLabels[document.review_status] ?? document.review_status}</Badge></div>)}
            {snapshot.documents.length === 0 ? <p className="py-4 text-center text-sm text-muted-foreground">{copy.documentsRequired}</p> : null}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-xl">{copy.uploadDocument}</CardTitle><CardDescription>{copy.privateDocuments}</CardDescription></CardHeader><CardContent><TeacherDocumentUpload applicationId={snapshot.application?.id ?? null} dictionary={dictionary} /></CardContent></Card>
        </aside>
      </div>
    </ProfilePageShell>
  );
}
