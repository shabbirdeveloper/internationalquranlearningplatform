"use server";

import { createServerSupabaseAdminClient } from "@/lib/supabase/admin";
import { contactRequestSchema, trialRequestSchema, tutorRequestSchema, type PublicRequestState } from "@/features/public-site/schemas";
import { applyDialCode } from "@/lib/countries";

function value(formData: FormData, key: string) { return String(formData.get(key) ?? ""); }
function fields(formData: FormData) {
  const phone = value(formData, "phoneLocal");
  const phoneDialCode = value(formData, "phoneCountry").split(":")[1] ?? "";
  return {
    fullName: value(formData, "fullName"),
    email: value(formData, "email"),
    phone: phone ? applyDialCode(phone, phoneDialCode) : "",
    locale: value(formData, "locale"),
  };
}

export async function submitTrialRequest(_state: PublicRequestState, formData: FormData): Promise<PublicRequestState> {
  const parsed = trialRequestSchema.safeParse({ ...fields(formData), country: value(formData, "country"), timeZone: value(formData, "timeZone"), learnerAge: value(formData, "learnerAge"), courseSlug: value(formData, "courseSlug") || undefined, teacherPreference: value(formData, "teacherPreference") || undefined, goals: value(formData, "goals"), schedule: value(formData, "schedule") });
  if (!parsed.success) return { status: "ERROR", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const supabase = createServerSupabaseAdminClient();
  if (!supabase) return { status: "UNAVAILABLE" };
  const data = parsed.data;
  const { data: created, error } = await supabase.from("free_trial_requests").insert({ full_name: data.fullName, email: data.email, phone: data.phone, country: data.country, time_zone: data.timeZone, learner_age: data.learnerAge, course_slug: data.courseSlug || null, teacher_preference: data.teacherPreference || null, learning_goals: data.goals, preferred_schedule: data.schedule, locale: data.locale }).select("request_number").single();
  return error || !created ? { status: "ERROR" } : { status: "SUCCESS", reference: created.request_number };
}

export async function submitContactRequest(_state: PublicRequestState, formData: FormData): Promise<PublicRequestState> {
  const parsed = contactRequestSchema.safeParse({ ...fields(formData), subject: value(formData, "subject"), message: value(formData, "message") });
  if (!parsed.success) return { status: "ERROR", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const supabase = createServerSupabaseAdminClient();
  if (!supabase) return { status: "UNAVAILABLE" };
  const data = parsed.data;
  const { data: created, error } = await supabase.from("contact_inquiries").insert({ full_name: data.fullName, email: data.email, phone: data.phone || null, subject: data.subject, message: data.message, locale: data.locale }).select("inquiry_number").single();
  return error || !created ? { status: "ERROR" } : { status: "SUCCESS", reference: created.inquiry_number };
}

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
function validFile(file: File) { return file.size > 0 && file.size <= 5_242_880 && allowedTypes.has(file.type); }

export async function submitTutorRequest(_state: PublicRequestState, formData: FormData): Promise<PublicRequestState> {
  const parsed = tutorRequestSchema.safeParse({ ...fields(formData), country: value(formData, "country"), subjects: value(formData, "subjects"), languages: value(formData, "languages"), experience: value(formData, "experience"), qualifications: value(formData, "qualifications"), availability: value(formData, "availability"), biography: value(formData, "biography") });
  if (!parsed.success) return { status: "ERROR", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const files = [["identity", formData.get("identity")], ["qualification", formData.get("certificate")], ["other", formData.get("cv")]] as const;
  if (files.some(([, file]) => !(file instanceof File) || !validFile(file))) return { status: "ERROR", fieldErrors: { files: ["Three valid PDF, JPG or PNG files are required (5 MB maximum each)."] } };
  const supabase = createServerSupabaseAdminClient();
  if (!supabase) return { status: "UNAVAILABLE" };
  const data = parsed.data;
  const applicationId = crypto.randomUUID();
  const { data: created, error: applicationError } = await supabase.from("teacher_applications").insert({ id: applicationId, status: "submitted", submitted_at: new Date().toISOString(), applicant_name: data.fullName, applicant_email: data.email, applicant_phone: data.phone, applicant_country: data.country, teaching_subjects: data.subjects, teaching_languages: data.languages, teaching_experience: data.experience, qualifications: data.qualifications, weekly_availability: data.availability, professional_biography: data.biography }).select("application_number").single();
  if (applicationError || !created) return { status: "ERROR" };
  for (const [documentType, fileValue] of files) {
    const file = fileValue as File;
    const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
    const objectPath = `public-applications/${applicationId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("teacher-private").upload(objectPath, file, { contentType: file.type, upsert: false });
    if (uploadError) return { status: "ERROR", reference: created.application_number };
    const { error: documentError } = await supabase.from("teacher_documents").insert({ application_id: applicationId, document_type: documentType, object_path: objectPath, original_filename: file.name, content_type: file.type, size_bytes: file.size });
    if (documentError) return { status: "ERROR", reference: created.application_number };
  }
  return { status: "SUCCESS", reference: created.application_number };
}
