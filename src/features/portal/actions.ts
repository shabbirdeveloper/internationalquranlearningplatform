"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS, ROLE_KEYS } from "@/config/permissions";
import {
  branchFormSchema,
  coreProfileFormSchema,
  courseAdminSchema,
  parentLinkRequestSchema,
  parentProfileFormSchema,
  reviewParentLinkSchema,
  reviewTeacherApplicationSchema,
  staffAssignmentSchema,
  studentProfileFormSchema,
  teacherProfileFormSchema,
} from "@/features/portal/schemas";
import { getLocalizedPath, locales, type Locale } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserAccess } from "@/server/authorization/access";
import { hasPermission, type UserAccess } from "@/server/authorization/permissions";

export type PortalActionState = {
  success?: boolean;
  errorCode?: "UNAVAILABLE" | "UNAUTHORIZED" | "INVALID_INPUT" | "DATABASE_ERROR";
  fieldErrors?: Record<string, string[]>;
};

const initialFailure: PortalActionState = { errorCode: "INVALID_INPUT" };

function validationFailure(error: {
  flatten(): { fieldErrors: Record<string, string[] | undefined> };
}): PortalActionState {
  const fieldErrors = Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).filter(
      (entry): entry is [string, string[]] => Boolean(entry[1]?.length)
    )
  );

  return { ...initialFailure, fieldErrors };
}

async function authorize(
  permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS],
  role?: string
): Promise<UserAccess | null> {
  const access = await getCurrentUserAccess();
  if (!access || !hasPermission(access, permission)) return null;
  if (role && !access.roles.includes(role) && !hasPermission(access, PERMISSIONS.SYSTEM_FULL_ACCESS)) {
    return null;
  }
  return access;
}

function refreshPortal(locale: Locale, portal: string, suffix = ""): void {
  revalidatePath(getLocalizedPath(locale, `/${portal}${suffix}`));
}

export async function updateCoreProfileAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = coreProfileFormSchema.safeParse({
    locale: formData.get("locale"),
    portal: formData.get("portal"),
    fullName: formData.get("fullName"),
    phoneE164: formData.get("phoneE164"),
    preferredLocale: formData.get("preferredLocale"),
    timeZone: formData.get("timeZone"),
    countryCode: formData.get("countryCode"),
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.PROFILE_UPDATE_OWN);
  if (!access) return { errorCode: "UNAUTHORIZED" };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone_e164: parsed.data.phoneE164,
      preferred_locale: parsed.data.preferredLocale,
      time_zone: parsed.data.timeZone,
      country_code: parsed.data.countryCode,
    })
    .eq("user_id", access.userId);

  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, parsed.data.portal, "/profile");
  refreshPortal(parsed.data.locale, parsed.data.portal);
  return { success: true };
}

export async function updateStudentProfileAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = studentProfileFormSchema.safeParse({
    locale: formData.get("locale"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    guardianRequired: formData.get("guardianRequired") === "on",
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.PROFILE_UPDATE_OWN, ROLE_KEYS.STUDENT);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase
    .from("student_profiles")
    .update({
      date_of_birth: parsed.data.dateOfBirth,
      gender: parsed.data.gender,
      guardian_required: parsed.data.guardianRequired,
    })
    .eq("user_id", access.userId);

  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, "student", "/profile");
  refreshPortal(parsed.data.locale, "student");
  return { success: true };
}

export async function updateParentProfileAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = parentProfileFormSchema.safeParse({
    locale: formData.get("locale"),
    occupation: formData.get("occupation"),
    preferredContactChannel: formData.get("preferredContactChannel"),
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.PROFILE_UPDATE_OWN, ROLE_KEYS.PARENT);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase
    .from("parent_profiles")
    .update({
      occupation: parsed.data.occupation,
      preferred_contact_channel: parsed.data.preferredContactChannel,
    })
    .eq("user_id", access.userId);

  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, "parent", "/profile");
  refreshPortal(parsed.data.locale, "parent");
  return { success: true };
}

export async function updateTeacherProfileAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  let availability: unknown = [];
  try {
    availability = JSON.parse(String(formData.get("availability") ?? "[]"));
  } catch {
    return { errorCode: "INVALID_INPUT", fieldErrors: { availability: ["Invalid availability."] } };
  }

  const parsed = teacherProfileFormSchema.safeParse({
    locale: formData.get("locale"),
    biography: formData.get("biography"),
    gender: formData.get("gender"),
    countryCode: formData.get("countryCode"),
    educationSummary: formData.get("educationSummary"),
    hawzaQualifications: formData.get("hawzaQualifications"),
    teachingExperienceYears: formData.get("teachingExperienceYears"),
    preferredStudentAgeGroups: formData.getAll("preferredStudentAgeGroups"),
    languageCodes: formData.getAll("languageCodes"),
    availability,
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.PROFILE_UPDATE_OWN, ROLE_KEYS.TEACHER);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase.rpc("update_teacher_portal_profile", {
    profile_biography: parsed.data.biography,
    profile_gender: parsed.data.gender,
    profile_country_code: parsed.data.countryCode,
    profile_education_summary: parsed.data.educationSummary,
    profile_hawza_qualifications: parsed.data.hawzaQualifications,
    profile_teaching_experience_years: parsed.data.teachingExperienceYears,
    profile_preferred_age_groups: parsed.data.preferredStudentAgeGroups,
    profile_language_codes: parsed.data.languageCodes,
    profile_availability_slots: parsed.data.availability,
  });

  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, "teacher", "/profile");
  refreshPortal(parsed.data.locale, "teacher");
  return { success: true };
}

export async function requestParentLinkAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = parentLinkRequestSchema.safeParse({
    locale: formData.get("locale"),
    studentNumber: formData.get("studentNumber"),
    relationship: formData.get("relationship"),
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.CHILD_READ_LINKED, ROLE_KEYS.PARENT);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase.rpc("request_parent_student_link", {
    requested_student_number: parsed.data.studentNumber,
    requested_relationship: parsed.data.relationship,
  });
  if (error) return { errorCode: "DATABASE_ERROR" };

  refreshPortal(parsed.data.locale, "parent");
  return { success: true };
}

export async function submitTeacherApplicationAction(
  locale: Locale
): Promise<void> {
  const access = await authorize(PERMISSIONS.PROFILE_UPDATE_OWN, ROLE_KEYS.TEACHER);
  if (!access) return;
  const supabase = await createServerSupabaseClient();
  if (!supabase) return;
  await supabase.rpc("submit_teacher_application");
  refreshPortal(locale, "teacher");
  refreshPortal(locale, "teacher", "/profile");
}

export async function createBranchAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = branchFormSchema.safeParse({
    locale: formData.get("locale"),
    code: formData.get("code"),
    name: formData.get("name"),
    timeZone: formData.get("timeZone"),
  });
  if (!parsed.success) return validationFailure(parsed.error);
  const access = await authorize(PERMISSIONS.SYSTEM_FULL_ACCESS);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase.rpc("create_branch", {
    branch_code: parsed.data.code,
    branch_name: parsed.data.name,
    branch_time_zone: parsed.data.timeZone,
  });
  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, "admin", "/staff");
  return { success: true };
}

export async function assignStaffAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = staffAssignmentSchema.safeParse({
    locale: formData.get("locale"),
    email: formData.get("email"),
    branchId: formData.get("branchId"),
    roleKey: formData.get("roleKey"),
    jobTitle: formData.get("jobTitle"),
  });
  if (!parsed.success) return validationFailure(parsed.error);
  const access = await authorize(PERMISSIONS.STAFF_MANAGE);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const { error } = await supabase.rpc("assign_staff_to_branch", {
    staff_email: parsed.data.email,
    target_branch_id: parsed.data.branchId,
    target_role_key: parsed.data.roleKey,
    staff_job_title: parsed.data.jobTitle,
  });
  if (error) return { errorCode: "DATABASE_ERROR" };
  refreshPortal(parsed.data.locale, "admin", "/staff");
  return { success: true };
}

export async function reviewParentLinkAction(formData: FormData): Promise<void> {
  const parsed = reviewParentLinkSchema.safeParse({
    locale: formData.get("locale"),
    linkId: formData.get("linkId"),
    decision: formData.get("decision"),
  });
  if (!parsed.success) return;
  const access = await authorize(PERMISSIONS.PARENT_LINKS_REVIEW);
  if (!access) return;
  const supabase = await createServerSupabaseClient();
  if (!supabase) return;
  await supabase.rpc("review_parent_student_link", {
    target_link_id: parsed.data.linkId,
    decision: parsed.data.decision,
  });
  refreshPortal(parsed.data.locale, "admin", "/parent-links");
}

export async function reviewTeacherApplicationAction(formData: FormData): Promise<void> {
  const parsed = reviewTeacherApplicationSchema.safeParse({
    locale: formData.get("locale"),
    applicationId: formData.get("applicationId"),
    nextStatus: formData.get("nextStatus"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return;
  const access = await authorize(PERMISSIONS.TEACHER_APPLICATIONS_REVIEW);
  if (!access) return;
  const supabase = await createServerSupabaseClient();
  if (!supabase) return;
  await supabase.rpc("review_teacher_application", {
    target_application_id: parsed.data.applicationId,
    next_status: parsed.data.nextStatus,
    review_notes: parsed.data.notes,
  });
  refreshPortal(parsed.data.locale, "admin", "/teachers");
}

export async function saveCourseAction(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const parsed = courseAdminSchema.safeParse({
    id: String(formData.get("id") ?? "") || undefined,
    locale: formData.get("locale"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    category: formData.get("category"),
    level: formData.get("level"),
    ageGroup: formData.get("ageGroup"),
    classType: formData.get("classType"),
    durationMinutes: formData.get("durationMinutes"),
    languages: formData.get("languages"),
    coverImage: formData.get("coverImage"),
    detailImage: formData.get("detailImage"),
    methodImage: formData.get("methodImage"),
    overviewHeading: formData.get("overviewHeading"),
    description: formData.get("description"),
    guidanceHeading: formData.get("guidanceHeading"),
    guidanceBody: formData.get("guidanceBody"),
    audienceHeading: formData.get("audienceHeading"),
    audienceBody: formData.get("audienceBody"),
    benefitsHeading: formData.get("benefitsHeading"),
    benefits: formData.get("benefits"),
    methodHeading: formData.get("methodHeading"),
    methodBody: formData.get("methodBody"),
    outcomes: formData.get("outcomes"),
    syllabus: formData.get("syllabus"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) return validationFailure(parsed.error);

  const access = await authorize(PERMISSIONS.COURSES_MANAGE);
  if (!access) return { errorCode: "UNAUTHORIZED" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { errorCode: "UNAVAILABLE" };

  const course = parsed.data;
  const values = {
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    description: course.description,
    category: course.category,
    level: course.level,
    age_group: course.ageGroup,
    class_type: course.classType,
    duration_minutes: course.durationMinutes,
    languages: course.languages,
    outcomes: course.outcomes,
    syllabus: course.syllabus,
    cover_image_url: course.coverImage,
    detail_image_url: course.detailImage,
    method_image_url: course.methodImage,
    overview_heading: course.overviewHeading,
    guidance_heading: course.guidanceHeading,
    guidance_body: course.guidanceBody,
    audience_heading: course.audienceHeading,
    audience_body: course.audienceBody,
    benefits_heading: course.benefitsHeading,
    benefits: course.benefits,
    method_heading: course.methodHeading,
    method_body: course.methodBody,
    is_published: course.isPublished,
    published_at: course.isPublished ? new Date().toISOString() : null,
    deleted_at: null,
  };
  const result = course.id
    ? await supabase.from("courses").update(values).eq("id", course.id)
    : await supabase.from("courses").insert(values);
  if (result.error) return { errorCode: "DATABASE_ERROR" };

  for (const supportedLocale of locales) {
    revalidatePath(getLocalizedPath(supportedLocale, "/courses"));
    revalidatePath(getLocalizedPath(supportedLocale, `/courses/${course.slug}`));
  }
  refreshPortal(course.locale, "admin", "/courses");
  return { success: true };
}
