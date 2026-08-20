import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserAccess } from "@/server/authorization/permissions";

const coreProfileRowSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().nullable(),
  phone_e164: z.string().nullable(),
  preferred_locale: z.string(),
  time_zone: z.string(),
  country_code: z.string().nullable(),
  onboarding_completed_at: z.string().nullable().optional(),
});

const studentRowSchema = z.object({
  user_id: z.string().uuid(),
  student_number: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  gender: z.string().nullable(),
  guardian_required: z.boolean(),
  enrollment_status: z.string(),
});

const parentRowSchema = z.object({
  user_id: z.string().uuid(),
  occupation: z.string().nullable(),
  preferred_contact_channel: z.string(),
});

const parentLinkRowSchema = z.object({
  id: z.string().uuid(),
  student_user_id: z.string().uuid(),
  relationship: z.string(),
  status: z.string(),
  created_at: z.string(),
});

const teacherRowSchema = z.object({
  user_id: z.string().uuid(),
  teacher_number: z.string().nullable(),
  gender: z.string().nullable(),
  country_code: z.string().nullable(),
  biography: z.string().nullable(),
  verification_status: z.string(),
  education_summary: z.string().nullable().optional(),
  hawza_qualifications: z.string().nullable().optional(),
  teaching_experience_years: z.number().nullable().optional(),
  preferred_student_age_groups: z.array(z.string()).optional().default([]),
});

const teacherLanguageRowSchema = z.object({
  language_code: z.string(),
  proficiency: z.string(),
});

const availabilityRowSchema = z.object({
  id: z.string().uuid(),
  weekday: z.number(),
  local_start_time: z.string(),
  local_end_time: z.string(),
  time_zone: z.string(),
});

const teacherApplicationRowSchema = z.object({
  id: z.string().uuid(),
  teacher_user_id: z.string().uuid().nullable(),
  applicant_name: z.string().nullable().optional(),
  application_number: z.string(),
  status: z.string(),
  submitted_at: z.string().nullable(),
  updated_at: z.string(),
});

const teacherDocumentRowSchema = z.object({
  id: z.string().uuid(),
  document_type: z.string(),
  original_filename: z.string(),
  scan_status: z.string(),
  review_status: z.string(),
  created_at: z.string(),
});

const branchRowSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  time_zone: z.string(),
  is_active: z.boolean(),
});

const membershipRowSchema = z.object({
  id: z.string().uuid(),
  branch_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role_id: z.string().uuid(),
  status: z.string(),
  is_primary: z.boolean(),
});

const staffRowSchema = z.object({
  user_id: z.string().uuid(),
  employee_number: z.string().nullable(),
  job_title: z.string().nullable(),
});

const userRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string().nullable(),
});

export type CoreProfile = z.infer<typeof coreProfileRowSchema> & { email: string | null };
export type StudentProfile = z.infer<typeof studentRowSchema>;
export type ParentProfile = z.infer<typeof parentRowSchema>;
export type TeacherProfile = z.infer<typeof teacherRowSchema>;
export type TeacherAvailability = z.infer<typeof availabilityRowSchema>;
export type TeacherDocument = z.infer<typeof teacherDocumentRowSchema>;
export type Branch = z.infer<typeof branchRowSchema>;

export type ParentLink = z.infer<typeof parentLinkRowSchema> & {
  studentName: string | null;
  studentNumber: string | null;
};

export type StudentPortalSnapshot = {
  core: CoreProfile | null;
  student: StudentProfile | null;
};

export type ParentPortalSnapshot = {
  core: CoreProfile | null;
  parent: ParentProfile | null;
  links: ParentLink[];
};

export type TeacherPortalSnapshot = {
  core: CoreProfile | null;
  teacher: TeacherProfile | null;
  languages: Array<z.infer<typeof teacherLanguageRowSchema>>;
  availability: TeacherAvailability[];
  application: z.infer<typeof teacherApplicationRowSchema> | null;
  documents: TeacherDocument[];
};

export type StaffPortalSnapshot = {
  core: CoreProfile | null;
  staff: z.infer<typeof staffRowSchema> | null;
  memberships: Array<z.infer<typeof membershipRowSchema> & { branch: Branch | null }>;
};

async function getClient(): Promise<SupabaseClient | null> {
  return createServerSupabaseClient();
}

async function readCoreProfile(
  supabase: SupabaseClient,
  access: UserAccess
): Promise<CoreProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select(
      "user_id,full_name,phone_e164,preferred_locale,time_zone,country_code,onboarding_completed_at"
    )
    .eq("user_id", access.userId)
    .maybeSingle();
  const parsed = coreProfileRowSchema.safeParse(data);
  return parsed.success ? { ...parsed.data, email: access.email } : null;
}

export async function getStudentPortalSnapshot(
  access: UserAccess
): Promise<StudentPortalSnapshot> {
  const supabase = await getClient();
  if (!supabase) return { core: null, student: null };

  const [core, studentResult] = await Promise.all([
    readCoreProfile(supabase, access),
    supabase
      .from("student_profiles")
      .select("user_id,student_number,date_of_birth,gender,guardian_required,enrollment_status")
      .eq("user_id", access.userId)
      .maybeSingle(),
  ]);
  const parsedStudent = studentRowSchema.safeParse(studentResult.data);
  return { core, student: parsedStudent.success ? parsedStudent.data : null };
}

export async function getParentPortalSnapshot(
  access: UserAccess
): Promise<ParentPortalSnapshot> {
  const supabase = await getClient();
  if (!supabase) return { core: null, parent: null, links: [] };

  const [core, parentResult, linksResult] = await Promise.all([
    readCoreProfile(supabase, access),
    supabase
      .from("parent_profiles")
      .select("user_id,occupation,preferred_contact_channel")
      .eq("user_id", access.userId)
      .maybeSingle(),
    supabase
      .from("parent_student_links")
      .select("id,student_user_id,relationship,status,created_at")
      .eq("parent_user_id", access.userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);
  const parent = parentRowSchema.safeParse(parentResult.data);
  const links = z.array(parentLinkRowSchema).safeParse(linksResult.data);
  const linkRows = links.success ? links.data : [];
  const activeStudentIds = linkRows
    .filter((link) => link.status === "active")
    .map((link) => link.student_user_id);

  if (activeStudentIds.length === 0) {
    return {
      core,
      parent: parent.success ? parent.data : null,
      links: linkRows.map((link) => ({ ...link, studentName: null, studentNumber: null })),
    };
  }

  const [profilesResult, studentsResult] = await Promise.all([
    supabase.from("profiles").select("user_id,full_name").in("user_id", activeStudentIds),
    supabase
      .from("student_profiles")
      .select("user_id,student_number")
      .in("user_id", activeStudentIds),
  ]);
  const names = new Map<string, string | null>(
    z
      .array(z.object({ user_id: z.string().uuid(), full_name: z.string().nullable() }))
      .catch([])
      .parse(profilesResult.data)
      .map((row) => [row.user_id, row.full_name])
  );
  const numbers = new Map<string, string | null>(
    z
      .array(z.object({ user_id: z.string().uuid(), student_number: z.string().nullable() }))
      .catch([])
      .parse(studentsResult.data)
      .map((row) => [row.user_id, row.student_number])
  );

  return {
    core,
    parent: parent.success ? parent.data : null,
    links: linkRows.map((link) => ({
      ...link,
      studentName: names.get(link.student_user_id) ?? null,
      studentNumber: numbers.get(link.student_user_id) ?? null,
    })),
  };
}

export async function getTeacherPortalSnapshot(
  access: UserAccess
): Promise<TeacherPortalSnapshot> {
  const supabase = await getClient();
  if (!supabase) {
    return { core: null, teacher: null, languages: [], availability: [], application: null, documents: [] };
  }

  const [core, teacherResult, languagesResult, availabilityResult, applicationResult, documentsResult] =
    await Promise.all([
      readCoreProfile(supabase, access),
      supabase
        .from("teacher_profiles")
        .select(
          "user_id,teacher_number,gender,country_code,biography,verification_status,education_summary,hawza_qualifications,teaching_experience_years,preferred_student_age_groups"
        )
        .eq("user_id", access.userId)
        .maybeSingle(),
      supabase
        .from("teacher_languages")
        .select("language_code,proficiency")
        .eq("teacher_user_id", access.userId)
        .is("deleted_at", null)
        .order("language_code"),
      supabase
        .from("teacher_availability")
        .select("id,weekday,local_start_time,local_end_time,time_zone")
        .eq("teacher_user_id", access.userId)
        .eq("is_active", true)
        .is("deleted_at", null)
        .order("weekday")
        .order("local_start_time"),
      supabase
        .from("teacher_applications")
        .select("id,teacher_user_id,application_number,status,submitted_at,updated_at")
        .eq("teacher_user_id", access.userId)
        .is("deleted_at", null)
        .maybeSingle(),
      supabase
        .from("teacher_documents")
        .select("id,document_type,original_filename,scan_status,review_status,created_at")
        .eq("teacher_user_id", access.userId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
    ]);

  const teacher = teacherRowSchema.safeParse(teacherResult.data);
  const languages = z.array(teacherLanguageRowSchema).safeParse(languagesResult.data);
  const availability = z.array(availabilityRowSchema).safeParse(availabilityResult.data);
  const application = teacherApplicationRowSchema.safeParse(applicationResult.data);
  const documents = z.array(teacherDocumentRowSchema).safeParse(documentsResult.data);

  return {
    core,
    teacher: teacher.success ? teacher.data : null,
    languages: languages.success ? languages.data : [],
    availability: availability.success ? availability.data : [],
    application: application.success ? application.data : null,
    documents: documents.success ? documents.data : [],
  };
}

export async function getStaffPortalSnapshot(
  access: UserAccess
): Promise<StaffPortalSnapshot> {
  const supabase = await getClient();
  if (!supabase) return { core: null, staff: null, memberships: [] };

  const [core, staffResult, membershipsResult] = await Promise.all([
    readCoreProfile(supabase, access),
    supabase
      .from("staff_profiles")
      .select("user_id,employee_number,job_title")
      .eq("user_id", access.userId)
      .maybeSingle(),
    supabase
      .from("branch_memberships")
      .select("id,branch_id,user_id,role_id,status,is_primary")
      .eq("user_id", access.userId)
      .eq("status", "active")
      .is("deleted_at", null),
  ]);
  const staff = staffRowSchema.safeParse(staffResult.data);
  const memberships = z.array(membershipRowSchema).safeParse(membershipsResult.data);
  const rows = memberships.success ? memberships.data : [];
  const branchIds = rows.map((row) => row.branch_id);
  const branchResult = branchIds.length
    ? await supabase
        .from("branches")
        .select("id,code,name,time_zone,is_active")
        .in("id", branchIds)
    : { data: [] };
  const branches = z.array(branchRowSchema).catch([]).parse(branchResult.data);
  const byId = new Map(branches.map((branch) => [branch.id, branch]));

  return {
    core,
    staff: staff.success ? staff.data : null,
    memberships: rows.map((membership) => ({
      ...membership,
      branch: byId.get(membership.branch_id) ?? null,
    })),
  };
}

export async function getAdminSummary() {
  const supabase = await getClient();
  if (!supabase) {
    return { activeStudents: null, verifiedTeachers: null, pendingParentLinks: null, teacherApplications: null };
  }
  const [students, teachers, links, applications] = await Promise.all([
    supabase
      .from("student_profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("enrollment_status", "active")
      .is("deleted_at", null),
    supabase
      .from("teacher_profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("verification_status", "approved")
      .is("deleted_at", null),
    supabase
      .from("parent_student_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null),
    supabase
      .from("teacher_applications")
      .select("id", { count: "exact", head: true })
      .not("status", "in", '("draft","approved","rejected")')
      .is("deleted_at", null),
  ]);
  return {
    activeStudents: students.error ? null : students.count,
    verifiedTeachers: teachers.error ? null : teachers.count,
    pendingParentLinks: links.error ? null : links.count,
    teacherApplications: applications.error ? null : applications.count,
  };
}

export async function getPendingParentLinks() {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("parent_student_links")
    .select("id,parent_user_id,student_user_id,relationship,status,created_at")
    .eq("status", "pending")
    .is("deleted_at", null)
    .order("created_at")
    .limit(50);
  const rows = z
    .array(
      z.object({
        id: z.string().uuid(),
        parent_user_id: z.string().uuid(),
        student_user_id: z.string().uuid(),
        relationship: z.string(),
        status: z.string(),
        created_at: z.string(),
      })
    )
    .catch([])
    .parse(data);
  const userIds = Array.from(
    new Set(rows.flatMap((row) => [row.parent_user_id, row.student_user_id]))
  );
  if (userIds.length === 0) return [];
  const [profilesResult, studentsResult] = await Promise.all([
    supabase.from("profiles").select("user_id,full_name").in("user_id", userIds),
    supabase
      .from("student_profiles")
      .select("user_id,student_number")
      .in("user_id", rows.map((row) => row.student_user_id)),
  ]);
  const profiles = z
    .array(z.object({ user_id: z.string().uuid(), full_name: z.string().nullable() }))
    .catch([])
    .parse(profilesResult.data);
  const students = z
    .array(z.object({ user_id: z.string().uuid(), student_number: z.string().nullable() }))
    .catch([])
    .parse(studentsResult.data);
  const names = new Map(profiles.map((profile) => [profile.user_id, profile.full_name]));
  const numbers = new Map(students.map((student) => [student.user_id, student.student_number]));
  return rows.map((row) => ({
    ...row,
    parentName: names.get(row.parent_user_id) ?? null,
    studentName: names.get(row.student_user_id) ?? null,
    studentNumber: numbers.get(row.student_user_id) ?? null,
  }));
}

export async function getTeacherReviewQueue() {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("teacher_applications")
    .select("id,teacher_user_id,application_number,status,submitted_at,updated_at,applicant_name")
    .not("status", "in", '("draft","approved","rejected")')
    .is("deleted_at", null)
    .order("updated_at")
    .limit(50);
  const applications = z.array(teacherApplicationRowSchema).catch([]).parse(data);
  if (applications.length === 0) return [];
  const teacherIds = applications.flatMap((application) => application.teacher_user_id ? [application.teacher_user_id] : []);
  const { data: profilesData } = teacherIds.length ? await supabase
    .from("profiles")
    .select("user_id,full_name")
    .in("user_id", teacherIds) : { data: [] };
  const profiles = z
    .array(z.object({ user_id: z.string().uuid(), full_name: z.string().nullable() }))
    .catch([])
    .parse(profilesData);
  const names = new Map(profiles.map((profile) => [profile.user_id, profile.full_name]));
  return applications.map((application) => ({
    ...application,
    teacherName: application.applicant_name ?? (application.teacher_user_id ? names.get(application.teacher_user_id) : null) ?? null,
  }));
}

export async function getStaffDirectory() {
  const supabase = await getClient();
  if (!supabase) return { branches: [], memberships: [] };
  const [branchesResult, membershipsResult] = await Promise.all([
    supabase
      .from("branches")
      .select("id,code,name,time_zone,is_active")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("branch_memberships")
      .select("id,branch_id,user_id,role_id,status,is_primary")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  const branches = z.array(branchRowSchema).catch([]).parse(branchesResult.data);
  const memberships = z.array(membershipRowSchema).catch([]).parse(membershipsResult.data);
  if (memberships.length === 0) return { branches, memberships: [] };

  const userIds = memberships.map((membership) => membership.user_id);
  const [usersResult, profilesResult, staffResult] = await Promise.all([
    supabase.from("users").select("id,email").in("id", userIds),
    supabase.from("profiles").select("user_id,full_name").in("user_id", userIds),
    supabase.from("staff_profiles").select("user_id,employee_number,job_title").in("user_id", userIds),
  ]);
  const users = z.array(userRowSchema).catch([]).parse(usersResult.data);
  const profiles = z
    .array(z.object({ user_id: z.string().uuid(), full_name: z.string().nullable() }))
    .catch([])
    .parse(profilesResult.data);
  const staff = z.array(staffRowSchema).catch([]).parse(staffResult.data);
  const branchMap = new Map(branches.map((branch) => [branch.id, branch]));
  const userMap = new Map(users.map((user) => [user.id, user]));
  const profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));
  const staffMap = new Map(staff.map((staffProfile) => [staffProfile.user_id, staffProfile]));

  return {
    branches,
    memberships: memberships.map((membership) => ({
      ...membership,
      branch: branchMap.get(membership.branch_id) ?? null,
      email: userMap.get(membership.user_id)?.email ?? null,
      fullName: profileMap.get(membership.user_id)?.full_name ?? null,
      staff: staffMap.get(membership.user_id) ?? null,
    })),
  };
}
