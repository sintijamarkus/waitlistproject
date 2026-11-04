"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton({
  refCode,
  className,
  children,
  label = "Join the waitlist with Google",
}: {
  refCode?: string;
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
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
    <button onClick={login} aria-label={label} className={className}>
      {children}
    </button>
  );
}
