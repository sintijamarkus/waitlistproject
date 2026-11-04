// "N people already in line" ar pulsējošu punktu.
export default function LiveCount({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur">
      <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
      {n > 0 ? (
        <>
          <b className="text-white">{n.toLocaleString("en-US")}</b> {n === 1 ? "person" : "people"} already in line
        </>
      ) : (
        "Be the first in line"
      )}
    </span>
  );
}
