"use client";

import { useEffect, useState } from "react";

// Telefonā: "Join the Waitlist" josla ekrāna apakšā.
// Paslēpta, kamēr redzama hero vai beigu CTA poga, lai nav divu vienādu pogu.
export default function StickyJoin({ children, count }: { children: React.ReactNode; count: number | null }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["hero-cta", "join"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setShow(visible.size === 0);
      },
      { threshold: 0.1 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/75 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Cik cilvēku jau ir rindā — sociālais pierādījums blakus pogai */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="live-dot h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
          {count ? (
            <div className="leading-tight">
              <div className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                {count.toLocaleString("en-US")}
              </div>
              <div className="text-xs text-white/70">{count === 1 ? "person" : "people"} in line</div>
            </div>
          ) : (
            <div className="text-sm font-semibold leading-tight text-white">
              Be the first
              <br />
              in line
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
