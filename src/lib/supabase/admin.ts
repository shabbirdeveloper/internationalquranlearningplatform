import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseAdminConfig } from "@/config/env";

export function createServerSupabaseAdminClient() {
  const config = getSupabaseAdminConfig();
  if (!config) return null;
  return createClient(config.url, config.serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
