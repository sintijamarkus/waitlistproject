"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["Specs", "#specs"],
  ["Modes", "#modes"],
  ["Experience", "#experience"],
  ["FAQ", "#faq"],
];

// Fiksēta navigācija: caurspīdīga virs attēla, "stikla" efekts pēc ritināšanas.
export default function Nav({ cta }: { cta: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 backdrop-blur-xl"
          : "bg-black"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="font-[family-name:var(--font-display)] text-lg font-bold tracking-[0.25em] text-white"
        >
          SKYHOME<span className="text-sky-300"> X</span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
        {cta}
      </nav>
    </header>
  );
}
