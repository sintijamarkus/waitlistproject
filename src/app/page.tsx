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
import StickyJoin from "@/components/StickyJoin";
import Hero from "@/components/Hero";
import LiveCount from "@/components/LiveCount";
import Icon, { type IconName } from "@/components/Icon";

import { pickHero } from "@/lib/heroes";
const display = "font-[family-name:var(--font-display)]";
// Katra sadaļa = viens pilns ekrāns; ritinot tā "pieķeras" (scroll-snap globals.css).
const screen = "snap-screen relative flex min-h-svh flex-col justify-center pt-16";

const FEATURES: [IconName, string, string][] = [
  ["mountain", "Fly over iconic places", "The Grand Canyon, the Alps and the Norwegian fjords — seen from your own living room."],
  ["sunrise", "Wake up somewhere new", "Open the panoramic windows to a different view every morning."],
  ["home", "Your home, everywhere", "A fully equipped home. No hotels, no suitcases, no check-in desks."],
  ["modes", "One vehicle, three worlds", "Switch between flying, driving and sailing in under 90 seconds."],
];

const TECH: [IconName, string, string][] = [
  ["rotor", "Electric VTOL flight", "6 ducted electric rotors and a hybrid range extender. Lifts off vertically — no runway."],
  ["autopilot", "Full autopilot", "Flies, drives and sails autonomously. No pilot licence required."],
  ["glass", "270° smart glass", "Panoramic windows that dim on demand for privacy or sleep."],
  ["solar", "Self-powered home", "12 kW solar roof and a 400 kWh battery keep the lights on off-grid."],
  ["hull", "Amphibious hull", "A sealed hull turns your home into a yacht at 25 knots."],
  ["shield", "Safety first", "Triple-redundant systems, 360° radar & lidar, whole-vehicle parachute."],
];

const STATS = [
  ["1,200", "km", "flight range"],
  ["320", "km/h", "air cruise speed"],
  ["46", "m²", "living space"],
  ["90", "sec", "mode switch"],
];

const SPECS: [string, [string, string][]][] = [
  [
    "Flight",
    [
      ["Propulsion", "6 electric ducted rotors + hybrid range extender"],
      ["Take-off", "Vertical (VTOL) — no runway needed"],
      ["Range / Cruise", "1,200 km · 320 km/h · max 3,000 m"],
    ],
  ],
  [
    "Home",
    [
      ["Layout", "2 bedrooms · lounge · kitchen · rain-shower bath"],
      ["Guests", "Sleeps 4 in comfort"],
      ["Energy", "12 kW solar roof · 400 kWh battery"],
    ],
  ],
  [
    "Road & Water",
    [
      ["Road", "140 km/h · Level 4 autonomous · 4×4"],
      ["Water", "Amphibious hull · 25 knots · sea state 4"],
      ["Dimensions", "14.8 m × 3.2 m (rotors folded)"],
    ],
  ],
  [
    "Safety",
    [
      ["Redundancy", "Triple-redundant batteries & flight computers"],
      ["Sensors", "360° radar, lidar and thermal vision"],
      ["Certification", "Designed to EASA & FAA standards"],
    ],
  ],
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

  // Katrā refresh cita fona bilde (izvēlas serveris, tāpēc nav hydration kļūdu).
  const hero = pickHero();

  // ===================== Neielogots: landing page =====================
  return (
    <main className="snap-page bg-black">
      <Nav cta={<JoinButton refCode={ref} size="sm" />} />
      <StickyJoin count={waiting}>
        <JoinButton refCode={ref} size="sm" />
      </StickyJoin>

      <Hero hero={hero} refCode={ref} waiting={waiting} error={error} />

      {/* ---------- 2. FEATURES ---------- */}
      <section id="features" className={`${screen} bg-gradient-to-b from-black to-[#06101f]`}>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead eyebrow="Features" title="A home that travels with you.">
            No hotels to find, no suitcases to pack. Wake up in your own bed — somewhere extraordinary.
          </SectionHead>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.07]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-300/10 text-sky-300 ring-1 ring-sky-300/20 transition group-hover:bg-sky-300/20">
                    <Icon name={icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3. MODES ---------- */}
      <section id="modes" className={`${screen} bg-[#06101f]`}>
        {/* Neredzami enkuri #drive / #sail / #fly saitēm no attēla */}
        <span id="drive" className="absolute top-0" />
        <span id="sail" className="absolute top-0" />
        <span id="fly" className="absolute top-0" />
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead eyebrow="One home. Three worlds." title="Fly. Drive. Sail." />
          <Reveal className="mt-12">
            <Modes />
          </Reveal>
        </div>
      </section>

      {/* ---------- 4. TECH FEATURES ---------- */}
      <section id="tech" className={`${screen} bg-gradient-to-b from-[#06101f] to-black`}>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead eyebrow="Tech features" title="Engineered for freedom." />

          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map(([value, unit, label], i) => (
              <Reveal key={label} delay={i * 80}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
                  <div className={`${display} text-3xl font-bold sm:text-4xl`}>
                    {value}
                    <span className="ml-1 text-base text-sky-300 sm:text-lg">{unit}</span>
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TECH.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="flex h-full gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-sky-300/40">
                  <span className="mt-0.5 text-sky-300">
                    <Icon name={icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <details className="group mt-4 rounded-2xl border border-white/10 bg-white/[0.03] open:border-sky-300/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold hover:text-sky-200">
              Full specifications
              <span className="text-xl text-sky-300 transition group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-x-10 px-5 pb-5 md:grid-cols-2">
              {SPECS.map(([group, rows]) => (
                <div key={group} className="pt-3">
                  <h4 className="mb-1 text-sm font-semibold uppercase tracking-wider text-sky-300">{group}</h4>
                  <dl className="divide-y divide-white/10">
                    {rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-2.5 text-sm">
                        <dt className="text-white/50">{k}</dt>
                        <dd className="text-white/90">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="px-5 pb-5 text-xs text-white/40">Concept specifications. Subject to change.</p>
          </details>
        </div>
      </section>

      {/* ---------- 5. EXPERIENCE ---------- */}
      <section id="experience" className={`${screen} overflow-hidden`}>
        <Image src={hero.src} alt="" fill sizes="100vw" className="object-cover opacity-30 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
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
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/75">
              Imagine waking up in your own comfortable bed, opening the panoramic windows — and the
              Grand Canyon unfolds beneath you. After breakfast you continue over mountains, oceans and
              the most beautiful landscapes on Earth. Your home travels with you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- 6. FAQ + FINAL CTA ---------- */}
      <section id="faq" className={`${screen} border-t border-white/10`}>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <h2 className={`${display} text-4xl font-bold`}>Questions</h2>
            </Reveal>
            <div className="mt-8 space-y-3">
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

          <Reveal>
            <div
              id="join"
              className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-gradient-to-br from-[#0b2140] via-[#06101f] to-black px-6 py-14 text-center"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/30 blur-3xl" />
              <h2 className={`${display} relative text-3xl font-bold sm:text-5xl`}>Be first on board.</h2>
              <p className="relative mx-auto mt-4 max-w-md text-white/70">
                Join the waitlist with your Google account in one click.
              </p>
              <ul className="relative mx-auto mt-6 flex max-w-md flex-col gap-2 text-left text-sm text-white/80">
                {["First delivery slots in 2029", "Private test flight invitation", "Free and non-binding"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 shrink-0 text-sky-300" /> {t}
                  </li>
                ))}
              </ul>
              <div className="relative mt-8 flex flex-col items-center gap-4">
                <JoinButton refCode={ref} size="lg" />
                {waiting !== null && <LiveCount n={waiting} />}
              </div>
            </div>
          </Reveal>
        </div>
        <Footer />
      </section>
    </main>
  );
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">{eyebrow}</p>
      <h2 className={`${display} mt-3 text-4xl font-bold sm:text-5xl`}>{title}</h2>
      {children && <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">{children}</p>}
    </Reveal>
  );
}

async function OnTheList({
  user,
  total,
}: {
  user: User;
  total: number | null;
}) {
  const supabase = await createClient();
  const hero = pickHero();
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
      <Image src={hero.src} alt="" fill priority sizes="100vw" className="hero-drift object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

      <Nav
        sections={false}
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

function Footer() {
  return (
    <footer className="border-t border-white/10 pb-28 pt-10 md:pb-10">
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
