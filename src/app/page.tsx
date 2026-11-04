import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import JoinButton from "@/components/JoinButton";
import CopyLink from "@/components/CopyLink";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Modes from "@/components/Modes";

const HERO = "/skyhome-x-hero-16x9.webp";
const display = "font-[family-name:var(--font-display)]";

const STATS = [
  ["1,200", "km", "flight range"],
  ["320", "km/h", "air cruise speed"],
  ["46", "m²", "living space"],
  ["3", "modes", "fly · drive · sail"],
];

const SPECS: [string, [string, string][]][] = [
  [
    "Flight",
    [
      ["Propulsion", "6 electric ducted rotors + hybrid range extender"],
      ["Take-off", "Vertical (VTOL) — no runway needed"],
      ["Range / Cruise", "1,200 km · 320 km/h"],
      ["Autopilot", "Fully autonomous, no pilot licence required"],
    ],
  ],
  [
    "Home",
    [
      ["Layout", "2 bedrooms · lounge · kitchen · rain-shower bath"],
      ["Guests", "Sleeps 4 in comfort"],
      ["Windows", "270° panoramic smart glass, dims on demand"],
      ["Energy", "12 kW solar roof · 400 kWh battery"],
    ],
  ],
  [
    "Road & Water",
    [
      ["Road", "140 km/h · Level 4 autonomous · 4×4"],
      ["Water", "Amphibious hull · 25 knots"],
      ["Dimensions", "14.8 m × 3.2 m (rotors folded)"],
      ["Switching", "Change mode in under 90 seconds"],
    ],
  ],
  [
    "Safety",
    [
      ["Redundancy", "Triple-redundant batteries & flight computers"],
      ["Emergency", "Whole-vehicle ballistic parachute"],
      ["Sensors", "360° radar, lidar and thermal vision"],
      ["Certification", "Designed to EASA & FAA standards"],
    ],
  ],
];

const BENEFITS = [
  ["🏔️", "Fly over iconic places", "The Grand Canyon, the Alps and the Norwegian fjords — from your living room."],
  ["🌅", "Wake up somewhere new", "Every morning, a different view through the panoramic windows."],
  ["🛋️", "Your home, everywhere", "A fully equipped home. No hotels, no suitcases, no check-in."],
  ["🔄", "One vehicle, three worlds", "Switch between flying, driving and sailing in seconds."],
];

const FAQ = [
  ["When will SKYHOME X launch?", "The first homes are planned for 2029. Waitlist members get the first delivery slots and private test flights."],
  ["Do I need a pilot licence?", "No. SKYHOME X flies, drives and sails autonomously. You simply choose the destination."],
  ["Does joining the waitlist cost anything?", "No. Joining is free and non-binding — you only reserve your place in line."],
  ["What data do you store?", "Only your name and email from Google. Nothing else is saved, and you can leave the list at any time."],
];

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
  const waiting = typeof total === "number" ? total : null;

  if (user) return <OnTheList user={user} total={waiting} />;

  // ===================== Neielogots: landing page =====================
  return (
    <main id="top" className="bg-black">
      <Nav cta={<JoinButton refCode={ref} size="sm" />} />

      {/* ---------- HERO: 16:9 attēls, CTA redzams uzreiz ---------- */}
      <section className="relative bg-black pt-16">
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[calc((100svh-4rem)*16/9)] overflow-hidden lg:rounded-b-3xl">
          <Image
            src={HERO}
            alt="SKYHOME X flying over the Grand Canyon. One home. Three worlds. Don't just travel. Take your home with you."
            fill
            priority
            sizes="100vw"
            className="hero-drift object-cover"
          />
          {/* Tumšāka apakša, lai poga labi izceļas */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />

          {/* DRIVE / SAIL / FLY ikonas attēlā = klikšķināmas pogas */}
          {[
            ["drive", "39%"],
            ["sail", "47.6%"],
            ["fly", "55.8%"],
          ].map(([id, left]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={`Explore ${id} mode`}
              style={{ left }}
              className="absolute top-[16.5%] hidden h-[9.5%] w-[5.6%] rounded-xl transition hover:bg-white/10 hover:shadow-[0_0_24px_rgba(125,211,252,0.6)] lg:block"
            />
          ))}

          {/* CTA virs attēla (lielos ekrānos) */}
          <div className="absolute bottom-[5%] left-[3.6%] hidden items-center gap-4 lg:flex">
            <JoinButton refCode={ref} size="lg" />
            <a
              href="#specs"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold backdrop-blur-md transition hover:bg-white/20"
            >
              Explore specs
            </a>
            {waiting !== null && <LiveCount n={waiting} />}
          </div>

          {/* Scroll indikators */}
          <a
            href="#specs"
            aria-label="Scroll to specs"
            className="scroll-cue absolute bottom-[4%] right-[3%] hidden flex-col items-center gap-1 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-md transition hover:bg-black/60 lg:flex"
          >
            Specs
            <span className="text-xl">⌄</span>
          </a>
        </div>

        {/* CTA zem attēla (telefonā / planšetē) */}
        <div className="flex flex-col items-center gap-4 px-4 py-8 lg:hidden">
          <JoinButton refCode={ref} size="md" />
          <a href="#specs" className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold">
            Explore specs ↓
          </a>
          {waiting !== null && <LiveCount n={waiting} />}
        </div>

        {error && (
          <p className="pb-6 text-center text-sm text-red-400">Login failed ({error}). Please try again.</p>
        )}
      </section>

      {/* ---------- SPECS ---------- */}
      <section id="specs" className="relative border-t border-white/10 bg-gradient-to-b from-[#06101f] to-black py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Specifications</p>
            <h2 className={`${display} mt-3 text-4xl font-bold sm:text-5xl`}>Engineered for freedom.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              A flying mobile home that takes you anywhere — by air, by road and by water.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map(([value, unit, label], i) => (
              <Reveal key={label} delay={i * 100}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-sky-300/40 hover:bg-white/[0.07]">
                  <div className={`${display} text-4xl font-bold sm:text-5xl`}>
                    {value}
                    <span className="ml-1 text-lg text-sky-300 sm:text-xl">{unit}</span>
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-wider text-white/50">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {SPECS.map(([group, rows], i) => (
              <Reveal key={group} delay={i * 80}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <h3 className={`${display} mb-4 text-xl font-bold text-sky-300`}>{group}</h3>
                  <dl className="divide-y divide-white/10">
                    {rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm sm:text-base">
                        <dt className="text-white/50">{k}</dt>
                        <dd className="text-white/90">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-white/40">Concept specifications. Subject to change.</p>
        </div>
      </section>

      {/* ---------- MODES ---------- */}
      <section id="modes" className="relative py-24">
        {/* Neredzami enkuri #drive / #sail / #fly saitēm no attēla */}
        <span id="drive" className="absolute top-0" />
        <span id="sail" className="absolute top-0" />
        <span id="fly" className="absolute top-0" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">One home. Three worlds.</p>
            <h2 className={`${display} mt-3 text-4xl font-bold sm:text-5xl`}>Fly. Drive. Sail.</h2>
          </Reveal>
          <Reveal>
            <Modes />
          </Reveal>
        </div>
      </section>

      {/* ---------- EXPERIENCE ---------- */}
      <section id="experience" className="relative overflow-hidden py-28">
        <Image src={HERO} alt="" fill sizes="100vw" className="object-cover opacity-25 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              Your home. Your world. Your freedom.
            </p>
            <h2 className={`${display} mt-4 text-4xl font-bold leading-tight sm:text-6xl`}>
              Don&apos;t just visit the world&apos;s most beautiful places.{" "}
              <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                Live above them.
              </span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              Imagine waking up in your own comfortable bed, opening the panoramic windows — and the
              Grand Canyon unfolds beneath you. After breakfast you continue over mountains, oceans and
              the most beautiful landscapes on Earth. No hotels to find, no suitcases to pack. Your home
              travels with you.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 text-left sm:grid-cols-2">
            {BENEFITS.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="flex h-full gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-sky-300/40">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-white/60">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="mb-10 text-center">
            <h2 className={`${display} text-4xl font-bold`}>Questions</h2>
          </Reveal>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <Reveal key={q}>
                <details className="group rounded-2xl border border-white/10 bg-white/[0.03] transition open:border-sky-300/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold hover:text-sky-200">
                    {q}
                    <span className="text-xl text-sky-300 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-white/60">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-sky-300/20 bg-gradient-to-br from-[#0b2140] via-[#06101f] to-black px-6 py-16 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/30 blur-3xl" />
            <h2 className={`${display} relative text-3xl font-bold sm:text-5xl`}>Be first on board.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/70">
              Join the waitlist with your Google account in one click. Free, no commitment.
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-4">
              <JoinButton refCode={ref} size="lg" />
              {waiting !== null && <LiveCount n={waiting} />}
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

// ===================== Ielogots: "You're on the list" =====================
async function OnTheList({
  user,
  total,
}: {
  user: User;
  total: number | null;
}) {
  const supabase = await createClient();
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
    <main id="top" className="relative min-h-screen overflow-hidden bg-black">
      <Image src={HERO} alt="" fill priority sizes="100vw" className="hero-drift object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

      <Nav
        cta={
          <form action="/auth/signout" method="post">
            <button className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
              Log out
            </button>
          </form>
        }
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-20 pt-28 sm:px-6">
        <div className="reveal reveal-in w-full max-w-lg rounded-[2rem] border border-sky-300/30 bg-black/60 p-8 text-center shadow-[0_0_80px_rgba(56,189,248,0.15)] backdrop-blur-xl">
          {avatar && (
            <Image
              src={avatar}
              alt={firstName}
              width={104}
              height={104}
              className="mx-auto rounded-full ring-4 ring-sky-300/40"
            />
          )}
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Boarding confirmed</p>
          <h1 className={`${display} mt-2 text-3xl font-bold sm:text-4xl`}>
            You&apos;re on the list, {firstName}! ✈️
          </h1>
          <p className="mt-2 text-white/60">{user.email}</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className={`${display} text-4xl font-bold text-sky-300`}>
                #{typeof position === "number" && position > 0 ? position : "—"}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/50">
                your spot{total !== null ? ` of ${total}` : ""}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className={`${display} text-4xl font-bold`}>{typeof invited === "number" ? invited : 0}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/50">people you invited</div>
            </div>
          </div>

          {shareUrl && (
            <div className="mt-6 text-left">
              <p className="mb-2 text-sm text-white/60">Invite friends — share your personal link:</p>
              <CopyLink url={shareUrl} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <form action="/auth/signout" method="post">
              <button className="cursor-pointer rounded-full bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/85">
                Log out
              </button>
            </form>
            <form action="/leave" method="post">
              <button className="cursor-pointer rounded-full border border-red-400/60 px-6 py-2.5 font-semibold text-red-300 transition hover:bg-red-500/10">
                Leave the waitlist
              </button>
            </form>
            <Link
              href="/admin"
              className="rounded-full border border-white/20 px-6 py-2.5 font-semibold text-white/80 transition hover:bg-white/10"
            >
              Admin
            </Link>
          </div>
        </div>

        <details open className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/70 backdrop-blur">
          <summary className="cursor-pointer list-none p-5 font-semibold hover:text-sky-200">
            Everything Google told us about you <span className="text-white/40">(user_metadata)</span>
          </summary>
          <pre className="overflow-x-auto px-5 pb-5 text-xs text-emerald-300">{JSON.stringify(meta, null, 2)}</pre>
        </details>
        <details className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/70 backdrop-blur">
          <summary className="cursor-pointer list-none p-5 font-semibold hover:text-sky-200">
            The full Supabase user object
          </summary>
          <pre className="overflow-x-auto px-5 pb-5 text-xs text-emerald-300">{JSON.stringify(user, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}

function LiveCount({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur">
      <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
      {n.toLocaleString("en-US")} {n === 1 ? "person" : "people"} waiting for take-off
    </span>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-white/40 sm:flex-row sm:px-6">
        <span className={`${display} tracking-[0.25em] text-white/70`}>
          SKYHOME<span className="text-sky-300"> X</span>
        </span>
        <span>The ultimate travel experience. A concept product.</span>
        <a href="#top" className="rounded-full px-3 py-1 transition hover:bg-white/10 hover:text-white">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
