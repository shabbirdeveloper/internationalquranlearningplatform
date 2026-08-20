"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/config/env";

export function createBrowserSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(config.url, config.publishableKey);
}
