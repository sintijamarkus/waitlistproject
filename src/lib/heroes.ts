// Hero fona bildes. Pēc katra refresh serveris izvēlas vienu nejauši.
// Jaunu bildi pievieno: ieliec 16:9 bildi BEZ teksta mapē public/hero/ un pieraksti to šeit.
// Logo, pogas, virsraksts un CTA ir kods virs bildes, tāpēc der jebkurai bildei.
export type Hero = {
  src: string;
  alt: string;
  // 3 tumši toņi no pašas bildes (debesis → ainava → dziļums) fona gradientam ap bildi.
  // Iegūti no bildes augšas, vidus un apakšas vidējās krāsas, pietumšoti.
  tones: [string, string, string];
  // Kura bildes daļa paliek redzama, kad ekrāns to apgriež (CSS object-position).
  focus?: string;
};

export const HEROES: Hero[] = [
  { src: "/hero/canyon.png", alt: "SKYHOME X flying over the Grand Canyon at sunset", tones: ["#132536", "#281b15", "#0c0808"] },
  { src: "/hero/waterfall.png", alt: "SKYHOME X flying over a waterfall in Iceland", tones: ["#1c2430", "#1d1810", "#0f0f0d"] },
  { src: "/hero/beach.png", alt: "SKYHOME X flying over a pink sand beach", tones: ["#182538", "#281c0d", "#211516"] },
  { src: "/hero/dubai.png", alt: "SKYHOME X flying over the Palm Jumeirah in Dubai", tones: ["#192433", "#322219", "#090a09"] },
  { src: "/hero/mountain.png", alt: "SKYHOME X flying over snowy mountains and an alpine lake", tones: ["#202c38", "#1d1b1a", "#0b0c08"] },
  { src: "/hero/newyork.png", alt: "SKYHOME X flying over New York at sunset", tones: ["#1c2635", "#302017", "#07090b"] },
  { src: "/hero/resort.png", alt: "SKYHOME X flying over a tropical island coast", tones: ["#152537", "#211c0c", "#090e0b"] },
];

export function pickHero(): Hero {
  return HEROES[Math.floor(Math.random() * HEROES.length)];
}
