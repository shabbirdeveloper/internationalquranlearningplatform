import {
  BabyIcon,
  Building2Icon,
  CheckCircle2Icon,
  FileClockIcon,
  Link2Icon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react";

import { ParentLinkRequestForm } from "@/components/portal/parent-link-request-form";
import {
  checklistIcons,
  PortalOnboardingOverview,
  statusIcons,
} from "@/components/portal/portal-onboarding-overview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitTeacherApplicationAction } from "@/features/portal/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { UserAccess } from "@/server/authorization/permissions";
import type {
  ParentPortalSnapshot,
  StaffPortalSnapshot,
  StudentPortalSnapshot,
  TeacherPortalSnapshot,
} from "@/server/repositories/portal-repository";

function displayName(access: UserAccess, fullName: string | null | undefined, fallback: string): string {
  return fullName ?? access.displayName ?? access.email ?? fallback;
}

function statusLabel(dictionary: Dictionary, status: string): string {
  return dictionary.portal.phase2.statusLabels[status] ?? status.replaceAll("_", " ");
}

export function StudentDashboard({
  locale,
  access,
  snapshot,
  dictionary,
}: {
  locale: Locale;
  access: UserAccess;
  snapshot: StudentPortalSnapshot;
  dictionary: Dictionary;
}) {
  const copy = dictionary.portal.phase2;
  const core = snapshot.core;
  const student = snapshot.student;
  return (
    <PortalOnboardingOverview
      locale={locale}
      portal="student"
      displayName={displayName(access, core?.full_name, dictionary.portal.student)}
      dictionary={dictionary}
      checklist={[
        { label: copy.contactLocation, description: copy.profilePrompt, complete: Boolean(core?.full_name && core.phone_e164 && core.country_code), icon: checklistIcons.contact },
        { label: copy.studentProfileTitle, description: copy.roleDetails, complete: Boolean(student?.date_of_birth && student.gender), icon: checklistIcons.role },
        { label: copy.languageTimeZone, description: `${core?.preferred_locale ?? "—"} · ${core?.time_zone ?? "UTC"}`, complete: Boolean(core?.preferred_locale && core.time_zone), icon: checklistIcons.locale },
      ]}
      statusItems={[
        { label: statusLabel(dictionary, student?.enrollment_status ?? "prospective"), description: copy.prospectiveStudent, icon: statusIcons.user },
        { label: copy.portalActive, description: dictionary.portal.studentOverview, icon: statusIcons.secure },
        { label: student?.guardian_required ? copy.guardianRequired : copy.guardianNotRequired, description: copy.accountStatus, icon: Link2Icon },
      ]}
      activityTitle={copy.activityTitle}
      activityDescription={copy.activityEmpty}
    />
  );
}

export function ParentDashboard({
  locale,
  access,
  snapshot,
  dictionary,
}: {
  locale: Locale;
  access: UserAccess;
  snapshot: ParentPortalSnapshot;
  dictionary: Dictionary;
}) {
  const copy = dictionary.portal.phase2;
  const core = snapshot.core;
  return (
    <PortalOnboardingOverview
      locale={locale}
      portal="parent"
      displayName={displayName(access, core?.full_name, dictionary.portal.parent)}
      dictionary={dictionary}
      checklist={[
        { label: copy.contactLocation, description: copy.profilePrompt, complete: Boolean(core?.full_name && core.phone_e164 && core.country_code), icon: checklistIcons.contact },
        { label: copy.parentProfileTitle, description: copy.roleDetails, complete: Boolean(snapshot.parent?.preferred_contact_channel), icon: checklistIcons.role },
        { label: copy.languageTimeZone, description: `${core?.preferred_locale ?? "—"} · ${core?.time_zone ?? "UTC"}`, complete: Boolean(core?.preferred_locale && core.time_zone), icon: checklistIcons.locale },
      ]}
      statusItems={[
        { label: copy.portalActive, description: dictionary.portal.parentOverview, icon: ShieldCheckIcon },
        { label: `${snapshot.links.filter((link) => link.status === "active").length} ${copy.linkedChildren}`, description: copy.accountStatus, icon: UsersRoundIcon },
        { label: `${snapshot.links.filter((link) => link.status === "pending").length} ${copy.pendingApproval}`, description: copy.linkRequestDescription, icon: FileClockIcon },
      ]}
      activityTitle={copy.activityTitle}
      activityDescription={copy.activityEmpty}
    >
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.linkedChildren}</CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot.links.length ? (
              <div className="divide-y">
                {snapshot.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 py-4">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><BabyIcon className="size-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{link.studentName ?? copy.pendingApproval}</p>
                      <p className="text-sm text-muted-foreground">{link.studentNumber ?? link.relationship}</p>
                    </div>
                    <Badge variant="outline">{statusLabel(dictionary, link.status)}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="py-8 text-center text-sm text-muted-foreground">{copy.noLinks}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.linkRequestTitle}</CardTitle>
            <CardDescription>{copy.linkRequestDescription}</CardDescription>
          </CardHeader>
          <CardContent><ParentLinkRequestForm locale={locale} dictionary={dictionary} /></CardContent>
        </Card>
      </section>
    </PortalOnboardingOverview>
  );
}

export function TeacherDashboard({
  locale,
  access,
  snapshot,
  dictionary,
}: {
  locale: Locale;
  access: UserAccess;
  snapshot: TeacherPortalSnapshot;
  dictionary: Dictionary;
}) {
  const copy = dictionary.portal.phase2;
  const core = snapshot.core;
  const teacher = snapshot.teacher;
  const hasIdentity = snapshot.documents.some((document) => document.document_type === "identity");
  const hasQualification = snapshot.documents.some((document) => document.document_type === "qualification");
  const canSubmit = Boolean(teacher?.biography && teacher.education_summary && teacher.country_code && snapshot.languages.length && snapshot.availability.length && hasIdentity && hasQualification && ["draft", "information_requested"].includes(snapshot.application?.status ?? "draft"));
  const submitAction = submitTeacherApplicationAction.bind(null, locale);
  return (
    <PortalOnboardingOverview
      locale={locale}
      portal="teacher"
      displayName={displayName(access, core?.full_name, dictionary.portal.teacher)}
      dictionary={dictionary}
      checklist={[
        { label: copy.contactLocation, description: copy.profilePrompt, complete: Boolean(core?.full_name && core.phone_e164 && core.country_code), icon: checklistIcons.contact },
        { label: copy.professionalProfile, description: copy.teacherVerification, complete: Boolean(teacher?.biography && teacher.education_summary && teacher.country_code), icon: checklistIcons.role },
        { label: copy.languages, description: copy.weeklyAvailability, complete: Boolean(snapshot.languages.length && snapshot.availability.length), icon: checklistIcons.locale },
      ]}
      statusItems={[
        { label: statusLabel(dictionary, snapshot.application?.status ?? "draft"), description: copy.verificationStatus, icon: UserRoundCheckIcon },
        { label: hasIdentity ? copy.complete : copy.identityDocument, description: copy.documentsRequired, icon: LockKeyholeIcon },
        { label: hasQualification ? copy.complete : copy.qualificationDocument, description: copy.privateDocuments, icon: ShieldCheckIcon },
      ]}
      activityTitle={copy.activityTitle}
      activityDescription={copy.activityEmpty}
    >
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.teacherVerification}</CardTitle>
            <CardDescription>{copy.documentsRequired}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {snapshot.documents.length ? snapshot.documents.map((document) => (
              <div key={document.id} className="flex items-center gap-3 rounded-lg border p-3">
                <LockKeyholeIcon className="size-5 text-primary" />
                <div className="min-w-0 flex-1"><p className="truncate font-medium">{document.original_filename}</p><p className="text-sm text-muted-foreground">{statusLabel(dictionary, document.scan_status)}</p></div>
                <Badge variant="outline">{statusLabel(dictionary, document.review_status)}</Badge>
              </div>
            )) : <p className="py-6 text-center text-sm text-muted-foreground">{copy.documentsRequired}</p>}
            <p className="flex items-start gap-2 text-sm text-muted-foreground"><LockKeyholeIcon className="mt-0.5 size-4 shrink-0" />{copy.privateDocuments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-xl">{copy.applicationHistory}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-3"><FileClockIcon className="mt-0.5 size-5 text-muted-foreground" /><div><p className="font-medium">{snapshot.application ? statusLabel(dictionary, snapshot.application.status) : copy.applicationNotSubmitted}</p>{snapshot.application ? <p className="text-sm text-muted-foreground">{snapshot.application.application_number}</p> : null}</div></div>
            <form action={submitAction}>
              <Button type="submit" disabled={!canSubmit}>{copy.submitForReview}</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PortalOnboardingOverview>
  );
}

export function StaffDashboard({
  locale,
  access,
  snapshot,
  dictionary,
}: {
  locale: Locale;
  access: UserAccess;
  snapshot: StaffPortalSnapshot;
  dictionary: Dictionary;
}) {
  const copy = dictionary.portal.phase2;
  const core = snapshot.core;
  return (
    <PortalOnboardingOverview
      locale={locale}
      portal="staff"
      displayName={displayName(access, core?.full_name, dictionary.portal.staff)}
      dictionary={dictionary}
      checklist={[
        { label: copy.contactLocation, description: copy.profilePrompt, complete: Boolean(core?.full_name && core.phone_e164 && core.country_code), icon: checklistIcons.contact },
        { label: copy.branchScope, description: copy.roleDetails, complete: Boolean(snapshot.memberships.length), icon: Building2Icon },
        { label: copy.languageTimeZone, description: `${core?.preferred_locale ?? "—"} · ${core?.time_zone ?? "UTC"}`, complete: Boolean(core?.preferred_locale && core.time_zone), icon: checklistIcons.locale },
      ]}
      statusItems={[
        { label: copy.portalActive, description: dictionary.portal.staffOverview, icon: CheckCircle2Icon },
        { label: snapshot.staff?.job_title ?? dictionary.portal.staff, description: copy.role, icon: statusIcons.user },
        { label: `${access.permissions.length} ${copy.permissions}`, description: access.roles.join(", "), icon: ShieldCheckIcon },
      ]}
      activityTitle={copy.activityTitle}
      activityDescription={copy.activityEmpty}
    >
      <Card>
        <CardHeader><CardTitle className="text-xl">{copy.branchScope}</CardTitle></CardHeader>
        <CardContent>
          {snapshot.memberships.length ? <div className="divide-y">{snapshot.memberships.map((membership) => (
            <div key={membership.id} className="flex items-center gap-3 py-4"><Building2Icon className="size-5 text-primary" /><div className="flex-1"><p className="font-medium">{membership.branch?.name ?? copy.branchScope}</p><p className="text-sm text-muted-foreground">{membership.branch?.time_zone ?? "UTC"}</p></div>{membership.is_primary ? <Badge variant="outline">{copy.complete}</Badge> : null}</div>
          ))}</div> : <p className="py-8 text-center text-sm text-muted-foreground">{copy.noBranch}</p>}
        </CardContent>
      </Card>
    </PortalOnboardingOverview>
  );
}
