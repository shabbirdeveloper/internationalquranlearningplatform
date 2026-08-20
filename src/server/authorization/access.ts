import "server-only";

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { PermissionKey } from "@/config/permissions";
import { getLocalizedPath, type Locale } from "@/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  hasPermission,
  type UserAccess,
} from "@/server/authorization/permissions";

const accessPayloadSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email().nullable(),
  display_name: z.string().nullable(),
  time_zone: z.string().min(1),
  role_keys: z.array(z.string()),
  permission_keys: z.array(z.string()),
});

export async function readAccessFromClient(
  supabase: SupabaseClient
): Promise<UserAccess | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_current_user_access");

  if (error) {
    return {
      userId: user.id,
      email: user.email ?? null,
      displayName: null,
      timeZone: "UTC",
      roles: [],
      permissions: [],
    };
  }

  const parsedAccess = accessPayloadSchema.safeParse(data);

  if (!parsedAccess.success) {
    return null;
  }

  return {
    userId: parsedAccess.data.user_id,
    email: parsedAccess.data.email,
    displayName: parsedAccess.data.display_name,
    timeZone: parsedAccess.data.time_zone,
    roles: parsedAccess.data.role_keys,
    permissions: parsedAccess.data.permission_keys,
  };
}

export const getCurrentUserAccess = cache(async (): Promise<UserAccess | null> => {
  const supabase = await createServerSupabaseClient();
  return supabase ? readAccessFromClient(supabase) : null;
});

export async function requireSession(
  locale: Locale,
  requestedPath: string
): Promise<UserAccess> {
  const access = await getCurrentUserAccess();

  if (!access) {
    const loginPath = getLocalizedPath(locale, "/login");
    redirect(`${loginPath}?next=${encodeURIComponent(requestedPath)}`);
  }

  return access;
}

export async function requirePermission(
  locale: Locale,
  permission: PermissionKey,
  requestedPath: string
): Promise<UserAccess> {
  const access = await requireSession(locale, requestedPath);

  if (!hasPermission(access, permission)) {
    redirect(getLocalizedPath(locale, "/unauthorized"));
  }

  return access;
}

export type { UserAccess } from "@/server/authorization/permissions";
