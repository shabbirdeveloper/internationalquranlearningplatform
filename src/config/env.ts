export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export type SupabaseAdminConfig = SupabasePublicConfig & { serviceRoleKey: string };

function readNonEmpty(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = readNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = readNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getAppUrl(): string {
  return readNonEmpty(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000";
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const publicConfig = getSupabasePublicConfig();
  const serviceRoleKey = readNonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return publicConfig && serviceRoleKey ? { ...publicConfig, serviceRoleKey } : null;
}
