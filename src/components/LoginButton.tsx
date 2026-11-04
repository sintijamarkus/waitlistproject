"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton({ refCode }: { refCode?: string }) {
  async function login() {
    const supabase = createClient();
    const callback = new URL("/auth/callback", window.location.origin);
    if (refCode) callback.searchParams.set("ref", refCode);

    // Pārlūks tiek aizsūtīts uz Google; Google atgriež uz Supabase,
    // Supabase atgriež uz mūsu /auth/callback.
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
  }

  return (
    <button
      onClick={login}
      className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-black shadow hover:bg-amber-400 transition"
    >
      Join with Google
    </button>
  );
}
