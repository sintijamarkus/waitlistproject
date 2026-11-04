"use client";

import { useEffect, useState } from "react";

// Teksts "uzrakstās" pa burtam, kad lapa atveras.
// Neuzrakstītā daļa jau aizņem vietu (neredzama), tāpēc lapa nelēkā.
// Ekrāna lasītāji uzreiz dabū visu tekstu.
export default function Typewriter({
  lines,
  className = "",
  speed = 55,
  startDelay = 400,
}: {
  lines: { text: string; className?: string }[];
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const full = lines.map((l) => l.text).join("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Burtu skaits nāk no pagājušā laika, nevis no soļu skaita: ja pārlūks
    // palēnina taimerus (fona cilnē), teksts tik un tā pabeidzas laikā.
    const start = performance.now() + startDelay;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const n = Math.min(full.length, Math.floor((performance.now() - start) / speed) + 1);
      if (n > 0) setCount(n);
      if (n < full.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [full, speed, startDelay]);

  const done = count >= full.length;
  let offset = 0;

  return (
    <h1 className={className}>
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <span aria-hidden>
        {lines.map((line, n) => {
          const start = offset;
          offset += line.text.length;
          const shown = Math.max(0, Math.min(line.text.length, count - start));
          // Kursors ir rindā, kuru pašlaik raksta (beigās — pēdējā rindā).
          const caretHere = done ? n === lines.length - 1 : count >= start && count < offset;
          return (
            <span key={n} className="block">
              <span className={line.className}>{line.text.slice(0, shown)}</span>
              {caretHere && <span className="type-caret" />}
              <span className="invisible">{line.text.slice(shown)}</span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
