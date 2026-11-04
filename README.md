# 🧦 SockSync — Waitlist

Izdomāts produkts: mazs tags katrai zeķei, telefons pasaka, kur paslēpusies pazudusī.
Šodien — tā waitlist lapa: **Join with Google → Supabase datubāze → "You're on the list!"**

Tech: Next.js 15 (App Router) · Supabase Auth + Postgres · `@supabase/ssr` · Tailwind

---

## 🚀 Palaišana uz sava datora

```bash
git clone https://github.com/sintijamarkus/waitlistproject.git
cd waitlistproject
npm install
cp .env.example .env.local   # ieliec savas Supabase vērtības
npm run dev                  # http://localhost:3000
```

---

## Milestone 2 — Supabase

1. https://supabase.com → **New project**.
2. **Project Settings → API**: nokopē **Project URL** un **anon / publishable key** uz `.env.local`.
3. ⚠️ **service_role / secret** atslēgu NEKAD neliec pārlūkā, kodā vai GitHub. Šai aplikācijai tā nemaz nav vajadzīga.
4. `.env.local` ir `.gitignore` — tas nekad nenonāk GitHub.

## Milestone 3 — Google ↔ Supabase

1. **Supabase → Authentication → Sign In / Providers → Google** → ieslēdz. Nokopē **Callback URL**
   (izskatās `https://<projekts>.supabase.co/auth/v1/callback`).
2. **Google Cloud Console** (console.cloud.google.com) → jauns projekts.
3. **APIs & Services → OAuth consent screen** (Google Auth Platform): External, app nosaukums, tavs e-pasts.
4. **Clients / Credentials → Create OAuth client ID → Web application**
   - *Authorized JavaScript origins*: `http://localhost:3000`
   - *Authorized redirect URIs*: **Supabase Callback URL** no 1. soļa (NEVIS localhost!)
5. Nokopē **Client ID** un **Client Secret** → ielīmē Supabase Google provider → Save.
6. **Lai komandas biedri var ielogoties:** OAuth consent screen → **Audience → Test users** → pievieno viņu Gmail
   (vai spied **Publish app**, lai var jebkurš).
7. **Supabase → Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**` (un vēlāk `https://tavs-projekts.vercel.app/**`)

> `redirect_uri_mismatch` = Google redirect URI nesakrīt ar Supabase callback URL. Salīdzini burtu pa burtam.

## Milestone 5 — Datubāze

**Supabase → SQL Editor** → ielīmē visu `supabase/schema.sql` → **Run**.
Tas izveido `waitlist` tabulu, ieslēdz RLS, politikas un bonus funkcijas.

Lai /admin strādātu tev: `insert into public.admins (email) values ('tavs@gmail.com');`

---

## 🔐 Kā strādā login (no klikšķa līdz "You're on the list")

1. **Klikšķis** uz *Join with Google* → `LoginButton.tsx` izsauc `supabase.auth.signInWithOAuth({ provider: "google", redirectTo: "/auth/callback" })`.
2. Pārlūks aiziet uz **Supabase**, tas pārsūta uz **Google** login lapu.
3. Lietotājs ielogojas Google → Google sūta atpakaļ uz **Supabase** (`…supabase.co/auth/v1/callback`), nevis uzreiz uz mūsu app.
   Supabase pārbauda Google atbildi ar *Client Secret* (kas dzīvo tikai Supabase serverī) un izveido lietotāju **Authentication → Users**.
4. Supabase sūta uz **mūsu** `/auth/callback?code=…`.
5. `src/app/auth/callback/route.ts` (serverī) izsauc `exchangeCodeForSession(code)` → sesija tiek saglabāta **cookies**.
6. Tas pats route ieraksta lietotāju tabulā `waitlist` ar `upsert(... ignoreDuplicates)`.
7. Redirect uz `/`. `page.tsx` (Server Component) nolasa lietotāju no cookies ar `getUser()` un rāda profila karti.
8. **Refresh?** Joprojām ielogots, jo sesija ir cookies un `middleware.ts` katrā pieprasījumā atjauno tokenu.
9. **Log out** → `/auth/signout` izdzēš sesiju → atpakaļ landing lapa.

---

## 🕵️ Find the five — atbildes

1. **Kur Google sūta lietotāju?** Uz **Supabase** (`/auth/v1/callback`), nevis uzreiz uz app. Supabase glabā Client Secret,
   pārbauda Google atbildi un izveido lietotāju; tikai tad sūta uz mūsu `/auth/callback` ar vienreizēju kodu.
   Tāpēc Google *Redirect URI* jābūt Supabase adresei.
2. **Kāpēc anon/publishable atslēga drīkst būt pārlūkā?** Tā pati par sevi neko neatļauj — tā tikai identificē projektu.
   Ko drīkst darīt, nosaka **Row Level Security** politikas un lietotāja login tokens. (`service_role` apiet RLS → tā ir slepena.)
3. **Ja RLS būtu izslēgts?** Jebkurš ar publisko atslēgu (tā ir redzama lapas kodā!) varētu nolasīt **visus e-pastus**,
   ievietot viltotus ierakstus, mainīt vai izdzēst visu sarakstu.
4. **Kāpēc pēc otrās ielogošanās tikai viena rinda?** `user_id` un `email` kolonnām ir **UNIQUE constraint**, un kods
   lieto `upsert(..., { onConflict: "user_id", ignoreDuplicates: true })` = `ON CONFLICT DO NOTHING`.
   Drošāk ir datubāzē, jo tā aizsargā arī tad, ja kods kļūdās vai divi pieprasījumi nāk vienlaicīgi.
5. **Kas salūza ar profila bildi?** `next/image` met kļūdu *"hostname lh3.googleusercontent.com is not configured"* —
   Next.js pēc noklusējuma neielādē bildes no svešiem domēniem. Labojums: `images.remotePatterns` failā `next.config.ts`.

## Kādus datus dod Google? (`user_metadata`)

`full_name`, `name`, `email`, `email_verified`, `avatar_url` / `picture`, `sub` (Google ID), `iss`, `provider_id`.
Lapā redzams viss JSON. **Glabājam** tikai `email` + `full_name` (+ `user_id`). Bildi un Google ID neglabājam — nav vajadzīgs.

---

## ⚡ Bonusi (jau iebūvēti)

| Bonuss | Kā |
|---|---|
| Go live | Vercel → Import repo → ieliec 2 env mainīgos → pievieno Vercel URL Supabase *Redirect URLs* |
| "You're #7" | `my_waitlist_position()` — SECURITY DEFINER funkcija atgriež tikai skaitli |
| /admin | `admins` tabula + `is_admin()` RLS politikā. Citiem — "Not allowed" |
| Referrals | `/?ref=<id>` saite → `referred_by` kolonna → "You invited N people" |
| Leave | "Leave the waitlist" poga → dzēš savu rindu (RLS: tikai savu) |
| Counter | "N people waiting" uz landing lapas (`waitlist_count()`) |

## 📁 Svarīgākie faili

```
src/app/page.tsx                 landing / "You're on the list"
src/components/LoginButton.tsx   signInWithOAuth (Client Component)
src/app/auth/callback/route.ts   code → sesija + ieraksts waitlist
src/app/auth/signout/route.ts    log out
src/app/leave/route.ts           leave the waitlist
src/app/admin/page.tsx           admin skats
src/lib/supabase/*               browser / server / middleware klienti
src/middleware.ts                sesijas atjaunošana
supabase/schema.sql              tabula + RLS + funkcijas
```
