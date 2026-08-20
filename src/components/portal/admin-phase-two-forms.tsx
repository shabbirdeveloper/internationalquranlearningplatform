"use client";

import { useActionState, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  assignStaffAction,
  createBranchAction,
  reviewParentLinkAction,
  reviewTeacherApplicationAction,
  type PortalActionState,
} from "@/features/portal/actions";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Branch } from "@/server/repositories/portal-repository";

const initialState: PortalActionState = {};

function ActionMessage({ state, dictionary }: { state: PortalActionState; dictionary: Dictionary }) {
  if (state.success) return <Alert><AlertDescription>{dictionary.portal.phase2.saved}</AlertDescription></Alert>;
  if (state.errorCode) return <Alert variant="destructive"><AlertDescription>{dictionary.portal.phase2.actionError}</AlertDescription></Alert>;
  return null;
}

export function CreateBranchForm({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(createBranchAction, initialState);
  return <form action={action} className="flex flex-col gap-4"><input type="hidden" name="locale" value={locale} /><ActionMessage state={state} dictionary={dictionary} /><FieldGroup><Field><FieldLabel htmlFor="branchCode">{copy.branchCode}</FieldLabel><Input id="branchCode" name="code" required maxLength={32} /></Field><Field><FieldLabel htmlFor="branchName">{copy.branchName}</FieldLabel><Input id="branchName" name="name" required maxLength={120} /></Field><Field><FieldLabel htmlFor="branchTimeZone">{copy.timeZone}</FieldLabel><Input id="branchTimeZone" name="timeZone" defaultValue="UTC" required /></Field></FieldGroup><div><Button type="submit" disabled={pending}>{copy.createBranch}</Button></div></form>;
}

export function AssignStaffForm({ locale, branches, dictionary }: { locale: Locale; branches: Branch[]; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const [state, action, pending] = useActionState(assignStaffAction, initialState);
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [roleKey, setRoleKey] = useState("admission_officer");
  return (
    <Dialog>
      <DialogTrigger asChild><Button disabled={!branches.length}>{copy.assignStaff}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{copy.assignStaff}</DialogTitle><DialogDescription>{copy.branchScope}. {copy.roleDetails}</DialogDescription></DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} /><input type="hidden" name="branchId" value={branchId} /><input type="hidden" name="roleKey" value={roleKey} />
          <ActionMessage state={state} dictionary={dictionary} />
          <FieldGroup><Field><FieldLabel htmlFor="staffEmail">{copy.staffEmail}</FieldLabel><Input id="staffEmail" name="email" type="email" required /></Field><Field><FieldLabel htmlFor="jobTitle">{copy.jobTitle}</FieldLabel><Input id="jobTitle" name="jobTitle" /></Field><Field><FieldLabel>{copy.branchName}</FieldLabel><Select value={branchId} onValueChange={setBranchId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{branches.map((branch) => <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>)}</SelectContent></Select></Field><Field><FieldLabel>{copy.role}</FieldLabel><Select value={roleKey} onValueChange={setRoleKey}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(copy.roleLabels).map(([role, label]) => <SelectItem key={role} value={role}>{label}</SelectItem>)}</SelectContent></Select></Field></FieldGroup>
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{dictionary.common.close}</Button></DialogClose><Button type="submit" disabled={pending}>{copy.assignStaff}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ParentLinkReviewControls({ locale, linkId, dictionary }: { locale: Locale; linkId: string; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  return <div className="flex justify-end gap-2">{(["active", "rejected"] as const).map((decision) => <Dialog key={decision}><DialogTrigger asChild><Button size="sm" variant={decision === "active" ? "default" : "outline"}>{decision === "active" ? copy.approve : copy.reject}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{decision === "active" ? copy.approve : copy.reject}</DialogTitle><DialogDescription>{copy.linkRequestDescription}</DialogDescription></DialogHeader><form action={reviewParentLinkAction}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="linkId" value={linkId} /><input type="hidden" name="decision" value={decision} /><DialogFooter><DialogClose asChild><Button type="button" variant="outline">{dictionary.common.close}</Button></DialogClose><Button type="submit" variant={decision === "active" ? "default" : "destructive"}>{decision === "active" ? copy.approve : copy.reject}</Button></DialogFooter></form></DialogContent></Dialog>)}</div>;
}

const transitions: Record<string, string[]> = {
  submitted: ["documents_under_review", "information_requested", "rejected"],
  documents_under_review: ["information_requested", "interview_scheduled", "rejected"],
  information_requested: ["documents_under_review", "rejected"],
  interview_scheduled: ["interview_completed"],
  interview_completed: ["demo_scheduled", "reference_verification", "rejected"],
  demo_scheduled: ["demo_evaluated"],
  demo_evaluated: ["reference_verification", "rejected"],
  reference_verification: ["approved", "rejected"],
  approved: ["suspended"],
  suspended: ["approved", "rejected"],
};

export function TeacherReviewControls({ locale, applicationId, status, dictionary }: { locale: Locale; applicationId: string; status: string; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const choices = transitions[status] ?? [];
  const [nextStatus, setNextStatus] = useState(choices[0] ?? "");
  return <Dialog><DialogTrigger asChild><Button size="sm" variant="outline" disabled={!choices.length}>{copy.teacherVerification}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{copy.teacherVerification}</DialogTitle><DialogDescription>{copy.verificationStatus}</DialogDescription></DialogHeader><form action={reviewTeacherApplicationAction} className="flex flex-col gap-4"><input type="hidden" name="locale" value={locale} /><input type="hidden" name="applicationId" value={applicationId} /><input type="hidden" name="nextStatus" value={nextStatus} /><Field><FieldLabel>{copy.verificationStatus}</FieldLabel><Select value={nextStatus} onValueChange={setNextStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{choices.map((choice) => <SelectItem key={choice} value={choice}>{copy.statusLabels[choice] ?? choice.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select></Field><Field><FieldLabel htmlFor={`notes-${applicationId}`}>{copy.notes}</FieldLabel><Textarea id={`notes-${applicationId}`} name="notes" rows={4} maxLength={5000} /></Field><DialogFooter><DialogClose asChild><Button type="button" variant="outline">{dictionary.common.close}</Button></DialogClose><Button type="submit">{copy.saveChanges}</Button></DialogFooter></form></DialogContent></Dialog>;
}
