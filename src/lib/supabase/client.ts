import { createBrowserClient } from "@supabase/ssr";

// Pārlūka klients — izmanto TIKAI publisko (anon / publishable) atslēgu.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
