import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google -> Supabase -> ŠEIT ar ?code=...
// Iemainām vienreizējo kodu pret sesiju un ierakstām lietotāju waitlist tabulā.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const ref = searchParams.get("ref");

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/?error=auth`);
  }

  const user = data.user;
  const referredBy = ref && /^\d+$/.test(ref) ? Number(ref) : null;

  // Dublikātus aptur DB unique constraint uz user_id.
  // ignoreDuplicates = "ON CONFLICT DO NOTHING": otrā ielogošanās neko nemaina.
  const { error: insertError } = await supabase.from("waitlist").upsert(
    {
      user_id: user.id,
      email: user.email!,
      full_name: user.user_metadata.full_name ?? null,
      referred_by: referredBy,
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );

  if (insertError) {
    console.error("waitlist insert failed:", insertError.message);
  }

  return NextResponse.redirect(`${origin}/`);
}
