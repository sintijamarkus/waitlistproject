import LoginButton from "@/components/LoginButton";

// Futūristiskā poga: gaismas stars skrien pa perimetru + pulsējošs mirdzums.
export default function JoinButton({
  refCode,
  size = "lg",
}: {
  refCode?: string;
  size?: "lg" | "md";
}) {
  const text = size === "lg" ? "px-9 py-4 text-lg sm:px-14 sm:py-5 sm:text-2xl" : "px-8 py-3 text-base";

  return (
    <LoginButton
      refCode={refCode}
      className="group relative inline-flex cursor-pointer rounded-full p-[3px] shadow-[0_0_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
    >
      <span aria-hidden className="join-glow absolute -inset-3 rounded-full blur-2xl" />
      <span aria-hidden className="join-beam absolute inset-0 rounded-full" />
      <span
        className={`relative flex items-center gap-3 rounded-full bg-[#050b16]/95 font-semibold tracking-wide text-white ${text} group-hover:bg-[#0a1628]`}
      >
        Join the Waitlist <span className="join-arrow">→</span>
      </span>
    </LoginButton>
  );
}
