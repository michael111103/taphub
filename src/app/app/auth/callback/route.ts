import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/app/supabase";

/** Link konfirmasi email / reset password dari Supabase mendarat di sini */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "";
  const base = req.headers.get("x-app-base") ?? "/app";
  if (code) {
    await supabaseServer().auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(`${base}${next || "/"}`, req.url));
}
