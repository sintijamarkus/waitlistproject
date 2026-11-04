import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";
import CopyLink from "@/components/CopyLink";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; error?: string }>;
}) {
  const { ref, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Publisks skaitītājs (SECURITY DEFINER funkcija atgriež tikai skaitli, ne e-pastus).
  const { data: total } = await supabase.rpc("waitlist_count");

  // ---------- Neielogots: landing page ----------
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-6xl">🧦</div>
        <h1 className="text-5xl font-bold">SockSync</h1>
        <p className="max-w-md text-lg text-neutral-500">
          A tiny tag for every sock. Your phone tells you where the missing one is hiding.
        </p>
        <LoginButton refCode={ref} />
        {typeof total === "number" && (
          <p className="text-sm text-neutral-500">{total} people waiting</p>
        )}
        {error && <p className="text-sm text-red-500">Login failed ({error}). Try again.</p>}
      </main>
    );
  }

  // ---------- Ielogots: "You're on the list" ----------
  const meta = user.user_metadata;
  const firstName = (meta.full_name ?? meta.name ?? user.email ?? "").split(" ")[0];
  const avatar: string | undefined = meta.avatar_url ?? meta.picture;

  const { data: row } = await supabase
    .from("waitlist")
    .select("id, created_at")
    .eq("user_id", user.id)
    .maybeSingle();
  const { data: position } = await supabase.rpc("my_waitlist_position");
  const { data: invited } = await supabase.rpc("my_referral_count");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const shareUrl = row ? `${proto}://${host}/?ref=${row.id}` : null;

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 p-8">
      <div className="mt-10 w-full max-w-md rounded-2xl border border-neutral-700 p-6 text-center">
        {avatar && (
          <Image
            src={avatar}
            alt={firstName}
            width={96}
            height={96}
            className="mx-auto rounded-full"
          />
        )}
        <h1 className="mt-4 text-3xl font-bold">You&apos;re on the list, {firstName}!</h1>
        <p className="text-neutral-500">{user.email}</p>
        {typeof position === "number" && position > 0 && (
          <p className="mt-2 text-xl">You&apos;re #{position} on the list</p>
        )}
        {typeof invited === "number" && (
          <p className="text-sm text-neutral-500">You invited {invited} people</p>
        )}

        {shareUrl && (
          <div className="mt-4 text-left">
            <p className="mb-1 text-sm text-neutral-500">Your invite link:</p>
            <CopyLink url={shareUrl} />
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <form action="/auth/signout" method="post">
            <button className="rounded-full bg-neutral-700 px-5 py-2 hover:bg-neutral-600">Log out</button>
          </form>
          <form action="/leave" method="post">
            <button className="rounded-full border border-red-500 px-5 py-2 text-red-400 hover:bg-red-500/10">
              Leave the waitlist
            </button>
          </form>
        </div>
        <Link href="/admin" className="mt-4 inline-block text-xs text-neutral-500 underline">
          admin
        </Link>
      </div>

      <section className="w-full max-w-2xl">
        <h2 className="mb-2 font-semibold">Everything Google told us (user_metadata):</h2>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-green-300">
          {JSON.stringify(meta, null, 2)}
        </pre>
        <h2 className="mb-2 mt-4 font-semibold">The full Supabase user object:</h2>
        <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-green-300">
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>
    </main>
  );
}
