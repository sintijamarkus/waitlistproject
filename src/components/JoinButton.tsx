import LoginButton from "@/components/LoginButton";

const SIZES = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3.5 text-base",
  lg: "px-8 py-4 text-lg xl:px-10 xl:py-5 xl:text-xl",
};

// Futūristiskā poga: gaismas stars skrien pa perimetru + pulsējošs mirdzums.
export default function JoinButton({
  refCode,
  size = "lg",
  label = "Join the Waitlist",
}: {
  refCode?: string;
  size?: keyof typeof SIZES;
  label?: string;
}) {
  return (
    <LoginButton
      refCode={refCode}
      className="group relative inline-flex shrink-0 cursor-pointer rounded-full p-[2px] shadow-[0_0_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
    >
      <span aria-hidden className="join-glow absolute -inset-2 rounded-full blur-xl" />
      <span aria-hidden className="join-beam absolute inset-0 rounded-full" />
      <span
        className={`relative flex items-center gap-2.5 whitespace-nowrap rounded-full bg-[#050b16]/95 font-semibold tracking-wide text-white transition-colors group-hover:bg-[#0b1a30] ${SIZES[size]}`}
      >
        {label} <span className="join-arrow">→</span>
      </span>
    </LoginButton>
  );
}
