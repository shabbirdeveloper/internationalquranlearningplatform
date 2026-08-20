"use client";

import { UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { teacherDocumentSchema } from "@/features/portal/schemas";
import type { Dictionary } from "@/i18n/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

function safeFilename(filename: string): string {
  return filename.normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120);
}

export function TeacherDocumentUpload({ applicationId, dictionary }: { applicationId: string | null; dictionary: Dictionary }) {
  const copy = dictionary.portal.phase2;
  const router = useRouter();
  const [documentType, setDocumentType] = useState("identity");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<"success" | "error" | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fileInput = event.currentTarget.elements.namedItem("privateDocument") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file || !allowedTypes.has(file.type) || file.size < 1 || file.size > 5_242_880) {
      setMessage("error");
      return;
    }
    setPending(true);
    setMessage(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Unauthorized");
      const objectPath = `${userData.user.id}/${crypto.randomUUID()}/${safeFilename(file.name)}`;
      const parsed = teacherDocumentSchema.safeParse({ documentType, objectPath, originalFilename: file.name, contentType: file.type, sizeBytes: file.size });
      if (!parsed.success) throw new Error("Invalid file");
      const { error: uploadError } = await supabase.storage.from("teacher-private").upload(objectPath, file, { contentType: file.type, upsert: false, cacheControl: "0" });
      if (uploadError) throw uploadError;
      const { error: metadataError } = await supabase.from("teacher_documents").insert({ teacher_user_id: userData.user.id, application_id: applicationId, document_type: parsed.data.documentType, object_path: objectPath, original_filename: parsed.data.originalFilename, content_type: parsed.data.contentType, size_bytes: parsed.data.sizeBytes, scan_status: "quarantined", review_status: "pending" });
      if (metadataError) { await supabase.storage.from("teacher-private").remove([objectPath]); throw metadataError; }
      if (fileInput) fileInput.value = "";
      setMessage("success");
      router.refresh();
    } catch {
      setMessage("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {message === "success" ? <Alert><AlertDescription>{copy.quarantined}</AlertDescription></Alert> : message === "error" ? <Alert variant="destructive"><AlertDescription>{copy.actionError}</AlertDescription></Alert> : null}
      <Field><FieldLabel htmlFor="documentType">{copy.uploadDocument}</FieldLabel><Select value={documentType} onValueChange={setDocumentType}><SelectTrigger id="documentType"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="identity">{copy.identityDocument}</SelectItem><SelectItem value="qualification">{copy.qualificationDocument}</SelectItem><SelectItem value="hawza_certificate">{copy.hawzaQualifications}</SelectItem><SelectItem value="reference">{copy.referenceDocument}</SelectItem><SelectItem value="other">{copy.otherDocument}</SelectItem></SelectContent></Select></Field>
      <Field><FieldLabel htmlFor="privateDocument">{copy.privateDocuments}</FieldLabel><Input id="privateDocument" name="privateDocument" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required /><FieldDescription>{copy.uploadFileRequirements}</FieldDescription></Field>
      <div><Button type="submit" disabled={pending}>{pending ? <Spinner data-icon="inline-start" /> : <UploadIcon data-icon="inline-start" />}{copy.uploadDocument}</Button></div>
    </form>
  );
}
