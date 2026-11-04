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
      <main className="min-h-screen bg-black text-white">
        {/* Hero attēls (16:9). Poga "Join the Waitlist" ir iezīmēta pašā bildē,
            tāpēc virs tās precīzi uzliekam caurspīdīgu ĪSTO pogu. */}
        <section className="relative mx-auto w-full max-w-[1600px] aspect-[16/9]">
          <Image
            src="/skyhome-hero.webp"
            alt="SkyHome X — a flying home that can drive, sail and fly. Don't just travel. Take your home with you."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <LoginButton
            refCode={ref}
            className="absolute left-[4%] top-[85.6%] h-[7.6%] w-[20.2%] cursor-pointer rounded-full transition hover:bg-sky-300/15 hover:shadow-[0_0_30px_rgba(125,211,252,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
          />
        </section>

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

          <LoginButton
            refCode={ref}
            className="mt-2 rounded-full border-2 border-sky-300 px-8 py-3 font-semibold shadow-[0_0_20px_rgba(125,211,252,0.5)] transition hover:bg-sky-300/10"
          >
            Join the Waitlist with Google →
          </LoginButton>
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
    <main className="min-h-screen flex flex-col items-center gap-6 bg-black bg-[url(/skyhome-hero.webp)] bg-cover bg-center bg-fixed p-8 text-white">
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
