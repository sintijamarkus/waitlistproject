import Image from "next/image";
import JoinButton from "@/components/JoinButton";
import LiveCount from "@/components/LiveCount";
import Typewriter from "@/components/Typewriter";
import type { Hero as HeroImage } from "@/lib/heroes";

const display = "font-[family-name:var(--font-display)]";

type Props = { hero: HeroImage; refCode?: string; waiting: number | null; error?: string };

// 1. ekrāns. Logo un Drive / Sail / Fly ir header joslā (Nav).
// Plats ekrāns (landscape): bilde pa visu ekrānu, teksts apakšējā kreisajā stūrī.
// Stāvs ekrāns (portrait, telefons): bilde redzama visā platumā (16:9), teksts zem tās.
export default function Hero({ hero, refCode, waiting, error }: Props) {
  return (
    <section
      id="top"
      className="snap-screen relative flex h-svh flex-col overflow-hidden pt-16"
      // Tumšs 3 toņu gradients no bildes krāsām (redzams telefonā ap bildi).
      style={{ background: `linear-gradient(180deg, ${hero.tones[0]} 0%, ${hero.tones[1]} 55%, ${hero.tones[2]} 100%)` }}
    >
      {/* Mīksts gaismas plankums bildes krāsā, lai fons nav plakans */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-60 landscape:hidden"
        style={{ background: `radial-gradient(120% 60% at 50% 25%, ${hero.tones[1]}, transparent 70%)` }}
      />

      {/* Bilde: telefonā visā platumā, platā ekrānā pa visu ekrānu */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden portrait:mt-4 landscape:absolute landscape:inset-0 landscape:aspect-auto">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: hero.focus ?? "center" }}
          className="hero-drift object-cover"
        />
        {/* Platā ekrānā tumšs tikai apakšējais kreisais stūris, kur ir teksts */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/10 to-transparent portrait:hidden sm:via-transparent" />
        {/* Telefonā bildes apakša saplūst ar fonu */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent landscape:hidden" />
      </div>

      {/* Virsraksts (uzrakstās) un CTA */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 portrait:my-auto landscape:mt-auto lg:pb-12">
        <div className="max-w-md">
          <Typewriter
            className={`${display} text-2xl font-bold leading-tight drop-shadow-lg sm:text-3xl lg:text-4xl`}
            lines={[
              { text: "Don’t just travel." },
              {
                text: "Take your home with you.",
                className: "bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent",
              },
            ]}
          />
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            A flying luxury home that drives, sails and flies — wherever you want to wake up.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div id="hero-cta">
              <JoinButton refCode={refCode} size="md" />
            </div>
            {waiting !== null && <LiveCount n={waiting} />}
          </div>
          {error && <p className="mt-3 text-sm text-red-400">Login failed ({error}). Please try again.</p>}
        </div>
      </div>

      <a
        href="#features"
        aria-label="Scroll to features"
        className="scroll-cue absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center text-white/70 transition hover:text-white lg:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <span className="text-xl leading-none">⌄</span>
      </a>
    </section>
  );
}
