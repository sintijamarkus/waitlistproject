import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Admin skats: tiesības pārbauda DATUBĀZE (is_admin() + RLS politika),
// nevis tikai šis kods. Pat ja kāds apiet šo lapu, citu e-pastus viņš neredzēs.
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Not allowed</h1>
        <Link href="/" className="underline">Back</Link>
      </main>
    );
  }

  const { data: rows } = await supabase
    .from("waitlist")
    .select("id, email, full_name, created_at, referred_by")
    .order("created_at", { ascending: true });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-bold">Waitlist ({rows?.length ?? 0})</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="py-2">#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Referred by</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r, i) => (
            <tr key={r.id} className="border-b border-neutral-800">
              <td className="py-2">{i + 1}</td>
              <td>{r.full_name}</td>
              <td>{r.email}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.referred_by ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/" className="mt-6 inline-block underline">Back</Link>
    </main>
  );
}
