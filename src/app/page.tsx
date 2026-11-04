import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import JoinButton from "@/components/JoinButton";
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
      <main className="min-h-screen bg-black text-white">
        {/* Hero attēls (lēnām "peld") + centrēta animētā poga */}
        <section className="relative mx-auto w-full max-w-[1600px] overflow-hidden aspect-[1600/752]">
          <Image
            src="/skyhome-x-hero.webp"
            alt="SkyHome X — a flying home that can drive, sail and fly. Don't just travel. Take your home with you."
            fill
            priority
            sizes="100vw"
            className="hero-drift object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-[8%] bg-gradient-to-b from-transparent to-black" />
        </section>

        <div className="relative z-10 flex justify-center px-4 pt-8 sm:pt-10">
          <JoinButton refCode={ref} />
        </div>

        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-14 text-center">
          <h1 className="text-4xl font-bold tracking-[0.3em]">SKYHOME X</h1>
          <p className="text-lg tracking-widest text-sky-300">
            Your home. Your world. Your freedom.
          </p>
          <p className="text-xl text-neutral-200">A flying mobile home that takes you anywhere.</p>

          <p className="max-w-2xl leading-relaxed text-neutral-400">
            Imagine waking up in your own comfortable bed, opening the panoramic windows — and the
            Grand Canyon unfolds beneath you. After breakfast you continue over mountains, oceans and
            the most beautiful landscapes on Earth. No hotels to find, no suitcases to pack, no
            changing transport. Your home travels with you.
          </p>

          <p className="text-2xl font-semibold leading-snug">
            Don&apos;t just visit the world&apos;s most beautiful places.
            <br />
            <span className="text-sky-300">Live above them.</span>
          </p>

          <ul className="grid w-full gap-3 text-left sm:grid-cols-2">
            {[
              ["🏔️", "Fly over the Grand Canyon, the Alps and the Norwegian fjords."],
              ["🌅", "Wake up every day somewhere extraordinary."],
              ["🛋️", "Enjoy a fully equipped home wherever you go."],
              ["🔄", "Switch between flying, driving and sailing modes."],
            ].map(([icon, text]) => (
              <li
                key={text}
                className="flex gap-3 rounded-xl border border-sky-300/20 bg-white/5 p-4 text-neutral-200"
              >
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <JoinButton refCode={ref} size="md" />
          </div>
          {typeof total === "number" && (
            <p className="text-sm text-neutral-400">{total} people waiting for take-off</p>
          )}
          {error && <p className="text-sm text-red-400">Login failed ({error}). Try again.</p>}
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            SKYHOME X — The ultimate travel experience
          </p>
        </section>
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
    <main className="min-h-screen flex flex-col items-center gap-6 bg-black bg-[url(/skyhome-x-hero.webp)] bg-cover bg-center bg-fixed p-8 text-white">
      <div className="mt-10 w-full max-w-md rounded-2xl border border-sky-300/40 bg-black/70 p-6 text-center backdrop-blur">
        {avatar && (
          <Image
            src={avatar}
            alt={firstName}
            width={96}
            height={96}
            className="mx-auto rounded-full"
          />
        )}
        <h1 className="mt-4 text-3xl font-bold">You&apos;re on the list, {firstName}! ✈️</h1>
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

      <section className="w-full max-w-2xl rounded-2xl bg-black/80 p-4 backdrop-blur">
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
