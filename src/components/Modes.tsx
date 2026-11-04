"use client";

import { useEffect, useState } from "react";

const MODES = {
  fly: {
    icon: "✈️",
    label: "Fly",
    title: "Rise above the canyon.",
    text: "Six whisper-quiet electric rotors lift your whole home vertically — no runway, no airport. Cruise above the Grand Canyon, the Alps or the Norwegian fjords while breakfast is served.",
    stats: [
      ["320 km/h", "cruise speed"],
      ["1,200 km", "flight range"],
      ["3,000 m", "max altitude"],
    ],
  },
  drive: {
    icon: "🚗",
    label: "Drive",
    title: "Roll into any town.",
    text: "Rotors fold away, wheels deploy and SKYHOME X becomes a road-legal luxury coach. Park by the beach, cruise through vineyards, or pull right up to the restaurant.",
    stats: [
      ["140 km/h", "top speed"],
      ["Level 4", "autonomous driving"],
      ["4×4", "all-terrain"],
    ],
  },
  sail: {
    icon: "⛵",
    label: "Sail",
    title: "Drop anchor anywhere.",
    text: "A sealed amphibious hull turns your home into a yacht. Land on a lake at sunset, sail to a private island, and wake up to the sound of water.",
    stats: [
      ["25 knots", "on water"],
      ["Sea state 4", "certified"],
      ["0 dB", "anchor mode"],
    ],
  },
} as const;

type Mode = keyof typeof MODES;

// Interaktīvas cilnes: Fly / Drive / Sail. Atveras arī no #fly, #drive, #sail saitēm.
export default function Modes() {
  const [mode, setMode] = useState<Mode>("fly");

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h in MODES) setMode(h as Mode);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const m = MODES[mode];

  return (
    <div>
      <div role="tablist" className="mx-auto mb-10 flex w-fit gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {(Object.keys(MODES) as Mode[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition sm:px-7 ${
              mode === key
                ? "bg-white text-black shadow-lg"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="mr-1.5">{MODES[key].icon}</span>
            {MODES[key].label}
          </button>
        ))}
      </div>

      <div key={mode} className="reveal reveal-in grid items-center gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">{m.title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{m.text}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {m.stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="font-[family-name:var(--font-display)] text-xl font-bold text-sky-300 sm:text-2xl">
                {value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
