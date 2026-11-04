import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// "Leave the waitlist": izdzēš savu rindu (RLS atļauj dzēst tikai savu) un izlogo.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("waitlist").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
