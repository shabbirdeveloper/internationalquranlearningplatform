import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PublicTeacher = { teacher_user_id: string; slug: string; display_name: string; headline: string; biography: string; subjects: string[]; languages: string[]; age_groups: string[]; years_experience: number | null; availability_summary: string | null };

export async function getPublicTeachers(): Promise<PublicTeacher[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("public_teacher_profiles").select("teacher_user_id,slug,display_name,headline,biography,subjects,languages,age_groups,years_experience,availability_summary").eq("is_published", true).eq("is_verified", true).is("deleted_at", null).order("display_name");
  return (data ?? []) as PublicTeacher[];
}

export async function getPublicTeacher(slug: string): Promise<PublicTeacher | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.from("public_teacher_profiles").select("teacher_user_id,slug,display_name,headline,biography,subjects,languages,age_groups,years_experience,availability_summary").eq("slug", slug).eq("is_published", true).eq("is_verified", true).is("deleted_at", null).maybeSingle();
  return data as PublicTeacher | null;
}

export async function getPublicRequestQueues() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { trials: [], inquiries: [] };
  const [trials, inquiries] = await Promise.all([
    supabase.from("free_trial_requests").select("id,request_number,status,full_name,email,course_slug,created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    supabase.from("contact_inquiries").select("id,inquiry_number,status,full_name,email,subject,created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
  ]);
  return { trials: trials.data ?? [], inquiries: inquiries.data ?? [] };
}
