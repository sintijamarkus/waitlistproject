"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";

// Visas sadaļas (labās malas punktiem un aktīvās sadaļas izcelšanai).
const SECTIONS = [
  ["Features", "features"],
  ["Modes", "modes"],
  ["Tech", "tech"],
  ["Experience", "experience"],
  ["FAQ", "faq"],
];
// Header izvēlnē "Modes" nav — to aizstāj Drive / Sail / Fly pogas.
const LINKS = SECTIONS.filter(([, id]) => id !== "modes");

const MODES: [string, string, IconName][] = [
  ["drive", "Drive", "car"],
  ["sail", "Sail", "waves"],
  ["fly", "Fly", "plane"],
];

// Fiksēts header: logo pa kreisi, sadaļas centrā, Drive / Sail / Fly + Join pa labi.
// Lapas augšā caurspīdīgs ar lielāku logo, pēc ritināšanas "stikla" josla.
export default function Nav({ cta, sections = true }: { cta: React.ReactNode; sections?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sections) return;
    const els = ["top", ...SECTIONS.map(([, id]) => id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/60 backdrop-blur-xl"
            : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <a
            href="#top"
            aria-label="SKYHOME X"
            className="shrink-0 rounded-lg transition hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          >
            <Image
              src="/skyhome-x-logo.webp"
              alt="SKYHOME X"
              width={1825}
              height={430}
              priority
              className={`w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                scrolled ? "h-6 sm:h-7" : "h-7 sm:h-9"
              }`}
            />
          </a>

          {sections && (
            <div className="hidden items-center gap-1 xl:flex">
              {LINKS.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-white ${
                    active === id ? "bg-white/10 text-white" : "text-white/70"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {sections &&
              MODES.map(([id, label, icon]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-label={`${label} mode`}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-black/35 p-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/70 hover:bg-black/55 hover:text-sky-200 hover:shadow-[0_0_24px_rgba(56,189,248,0.45)] active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 lg:px-4"
                >
                  <Icon name={icon} className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                </a>
              ))}
            {/* Telefonā Join poga ir apakšējā joslā (StickyJoin), te — no planšetes uz augšu */}
            <div className={sections ? "hidden md:block" : ""}>{cta}</div>
          </div>
        </nav>
      </header>

      {sections && (
        <nav aria-label="Sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
          {[["Home", "top"], ...SECTIONS].map(([label, id]) => (
            <a key={id} href={`#${id}`} aria-label={label} className="group flex items-center justify-end gap-3">
              <span className="text-xs font-medium text-white/0 transition group-hover:text-white/80">{label}</span>
              <span
                className={`block rounded-full transition-all ${
                  active === id ? "h-6 w-1.5 bg-sky-300" : "h-1.5 w-1.5 bg-white/40 group-hover:bg-white"
                }`}
              />
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
