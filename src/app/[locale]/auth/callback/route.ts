import { NextResponse } from "next/server";

import { getSafeAuthNextPath } from "@/features/auth/redirects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeAuthNextPath(
    requestUrl.searchParams.get("next"),
    locale
  );

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase?.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
