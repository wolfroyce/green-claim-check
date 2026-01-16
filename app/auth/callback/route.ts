import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/app";

  if (code) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.redirect(
          new URL("/auth/login?error=Configuration error", requestUrl.origin)
        );
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      // Success - redirect to app
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        new URL("/auth/login?error=An unexpected error occurred", requestUrl.origin)
      );
    }
  }

  // No code parameter - redirect to login
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
