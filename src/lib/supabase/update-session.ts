import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicConfig } from "@/config/env";

export async function updateSupabaseSession(
  request: NextRequest
): Promise<NextResponse> {
  const config = getSupabasePublicConfig();
  let response = NextResponse.next({ request });

  if (!config) {
    return response;
  }

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, responseHeaders) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(responseHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  try {
    await supabase.auth.getClaims();
  } catch {
    // Public pages remain available during a temporary identity-provider outage.
  }

  return response;
}
