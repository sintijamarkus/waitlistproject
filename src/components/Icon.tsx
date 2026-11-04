// Vienkāršas līniju ikonas (24×24), krāsa no `currentColor`.
const PATHS = {
  mountain: "M3 20 9.5 9l4 6.5L16 12l5 8H3Z M14.5 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0",
  sunrise: "M12 3v3 M4.9 7.9l1.4 1.4 M19.1 7.9l-1.4 1.4 M2 16h2 M20 16h2 M7 16a5 5 0 0 1 10 0 M2 20h20",
  home: "M3 11 12 4l9 7 M5 9.5V20h5v-6h4v6h5V9.5",
  modes: "M4 7h13l-3-3 M20 17H7l3 3",
  rotor: "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M12 10V3 M12 14v7 M10 12H3 M14 12h7 M4 3h5 M15 21h5",
  autopilot: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M12 2v4 M12 18v4 M2 12h4 M18 12h4 M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
  glass: "M3 5h18v14H3z M3 5l6 14 M10 5l6 14 M17 5l4 9",
  solar: "M3 20 6 10h12l3 10H3Z M4.5 15h15 M9 10l-1 10 M15 10l1 10 M12 2v4 M8 4l1 2 M16 4l-1 2",
  hull: "M2 14h20l-3 5H5l-3-5Z M6 14V9h12v5 M12 9V4l4 3h-4 M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z M8.5 12l2.5 2.5 4.5-5",
  check: "M5 12.5 10 17l9-10",
  car: "M3 16v-3l2-5h14l2 5v3H3Z M3 13h18 M7 16v2 M17 16v2 M7 13.5h.01 M17 13.5h.01",
  waves: "M2 9c2 0 2-1.5 4-1.5S8 9 10 9s2-1.5 4-1.5S16 9 18 9s2-1.5 4-1.5 M2 14c2 0 2-1.5 4-1.5S8 14 10 14s2-1.5 4-1.5S16 14 18 14s2-1.5 4-1.5 M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5S16 19 18 19s2-1.5 4-1.5",
  plane: "M2 13.5 22 8l-1.5-2L13 8.5 7 4H5l3.5 6L4 11.5 2.5 10H1l1 3.5Z M6 20h12",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
