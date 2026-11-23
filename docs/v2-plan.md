# SREI website v2: plan

Status: **approved.** Phases 1–3 are built and merged. Phases 4–5 (accounts, registration, dashboard) wait for the owner's service accounts (§7).

**Deviations from this plan, as built:**
- The `motion` library isn't used: CSS transitions/animations plus a single IntersectionObserver do the same with less JavaScript. GSAP is used only for the desktop map scene (lazy-loaded).
- Headline reveals rise word by word (a wave in reading order) in pure CSS, instead of JS-measured lines. This keeps the largest paint fast on phones.
- The first-visit intro is CSS-only and runs on desktop only, so phones never wait for it.
- Fonts: one variable Source Serif 4 (no optical-size axis, no italic) and Inter, Latin subset only, to stay within the speed budget. Add `latin-ext` when Uzbek-language pages are introduced.

Scope: the brief in `srei-redesign-prompt.md` (editorial redesign, rich motion, accounts and sign-up, forum registration, owner dashboard, extras). This document says *how*, in what order, and what the owner must do.

---

## 1. Design direction

### 1.1 Moodboard (in words)
- **A quarterly economics journal:** cream paper, a serif text face set with care, hairline rules, numbered sections, folios, footnotes in the margin, tables with tabular figures.
- **An exhibition catalogue:** generous margins, captions set like museum labels ("Fig. 2 · Illustration · Not to scale"), objects (maps, papers) given room on the page.
- **A long-form newspaper feature with scroll-driven graphics:** one strong pinned illustration that changes as you scroll, then a return to quiet reading.
- **Central Asian material culture, used with restraint:** the caravan route as a dotted line, waypoint markers like caravanserais on an old map, a compass-rose ornament. **No** ikat patterns, domes, camels or "oriental" clichés, and nothing that turns the region into decoration.

### 1.2 Type
- **Families (2):**
  - **Source Serif 4** (variable, with optical sizes) for headings and long reading text. It's kept because it has real optical sizes (display cuts at large sizes, text cuts at body sizes), old-style figures and small caps. Newsreader would be the alternative, but Source Serif's text optical size reads better on phones.
  - **Inter** (variable) for UI, labels, forms and the dashboard.
  - A Phase-1 check confirms that the Google-served files keep the `smcp`, `onum`, `tnum` and `opsz` features. If small caps are stripped, I'll use `font-variant-caps: all-small-caps` with letter-spacing as a fallback, and say so.
- **Fluid scale** (clamp, 375 → 1440px), on a ratio of about 1.25 (mobile) to 1.333 (desktop):

  | Token | Mobile | Desktop | Use |
  |---|---|---|---|
  | `display` | 44px | 104px | home statement only |
  | `h1` | 34px | 64px | page titles |
  | `h2` | 26px | 40px | section titles |
  | `h3` | 21px | 26px | card titles |
  | `lead` | 19px | 22px | intro paragraphs |
  | `body` | 17px | 19px | reading text (serif on brief/paper pages) |
  | `ui` | 15px | 15px | UI text (Inter) |
  | `label` | 12px | 12px | small caps / tracking 0.14em |

- **Details:**
  - `text-wrap: balance` on headings, `pretty` on paragraphs
  - `hanging-punctuation: first` (Safari)
  - drop cap on briefs (CSS `initial-letter` with a float fallback)
  - old-style figures in prose, tabular lining figures in tables and the dashboard
  - curly quotes and dashes via a small remark plugin (smartypants) for MDX

### 1.3 Grid and rhythm
- A 12-column grid, `max-width: 1320px`, gutters 20px (mobile) / 32px (desktop), outer margin 16px (mobile) / 6vw (desktop).
- **Marginalia column:** on ≥1024px, columns 1–2 hold section numbers ("§ 01"), datelines and captions; content sits in 3–10 or 4–12; sidenotes go in 11–12.
- **Section rhythm on the home page:**
  1. dense hero
  2. airy mission
  3. full-bleed map scene
  4. a narrow numbered list (pillars)
  5. asymmetric briefs
  6. table of contents (papers)
  7. a navy band (forum)
  8. footer

  No two consecutive sections share the same structure.

### 1.4 Color and material
- Tokens stay: navy `#1B2A4A`, cream `#F5EFE3`, gold `#B8964F` (decorative), gold-text `#7A5F28`. New: ink-red `#8C3B2E` (errors and "deadline passed" only); `paper-50` `#FBF8F2` for raised surfaces.
- **Paper grain:** an inline SVG `feTurbulence` noise as a `background-image` data URI on `body::before`, `opacity: .045`, `pointer-events: none`, about 1 KB. No PNG needed.
- Rules: 1px gold hairlines; a 2px navy rule for section starts.
- Radius: 2px everywhere (buttons and cards). Shadows: none, except one soft shadow on the open mobile menu sheet and on popovers.

### 1.5 Illustration system (all hand-built SVG, in `components/ornaments/`)
- Line weight 1.25px at 1x, `vector-effect: non-scaling-stroke`, `stroke-linecap: round`, brand colors only.
- **Set:**
  - `RouteLine` (dotted caravan route; already exists, will be refined)
  - `Waypoint`
  - `CompassRose`
  - `SectionMark` (§ numeral plus rule)
  - pillar emblems:
    - Forum: a lectern with a small audience arc
    - Papers: a stacked folio with a numbered tab
    - Briefs: a single bar chart drawn as a ledger
  - glyphs: arrow, download, external, share, copy, menu, close, search, user, check-stamp
- Each glyph is one React component with `aria-hidden` by default. No icon library is installed.

### 1.6 Map
- **Source:** Natural Earth 1:50m Admin-0 countries (public domain), clipped to roughly lon 20°–135°, lat 15°–70°. Equirectangular projection, scaled ×cos(45°) on x for a natural look.
- **Simplified** with mapshaper (Visvalingam, about 3–5% retained) in a one-off script `scripts/build-map.mjs`. The generated `components/map/paths.ts` is committed, so builds don't need the network. Target: under 40 KB of path data. The source and licence are noted in a header comment.
- **Contents:**
  - Central Asian countries outlined in navy, neighbours in a lighter tone
  - origin cities (Tashkent, Samarkand, Bishkek, Dushanbe, Almaty, Ashgabat) as waypoints
  - destination labels (Russia: Moscow; South Korea: Seoul; the Gulf: Dubai; Europe: a generic "Europe" label near Berlin)
  - corridors as quadratic Bézier arcs, all the **same** stroke width
- **Caption, always visible:** "Illustration: main labor-migration corridors. Not to scale; not data."
- **Text alternative:** a visually hidden paragraph describing the corridors.

---

## 2. Motion system

### 2.1 Libraries (exact versions to pin)

| Package | Version | Why | Where loaded |
|---|---|---|---|
| `motion` | 14.11.x (pin the latest at least 2 weeks old at install time) | component, layout and `useScroll` animation | client islands only, via `LazyMotion` + `m` components to keep the bundle small |
| `lenis` | 1.3.27 | smooth scroll on desktop pointer devices | dynamically imported after idle; **not** started on touch devices or under reduced motion |
| `gsap` (+ ScrollTrigger) | 3.15.1 | the pinned map scene only | `next/dynamic`, loaded when the map section is within 1 viewport |
| React `<ViewTransition>` | built into React 19.3.1 | page transitions and shared elements | native; Phase 1 starts with a short check that Next 16.4 navigation triggers it; if not, Motion `AnimatePresence` in `app/template.tsx` is the fallback |

### 2.2 Tokens (`lib/motion.ts`)
```ts
export const ease = {
  out:   [0.22, 1, 0.36, 1],   // most entrances
  inOut: [0.65, 0, 0.35, 1],   // scroll-linked, page transitions
  in:    [0.55, 0, 1, 0.45],   // exits
};
export const dur = { fast: 0.18, base: 0.45, slow: 0.9, epic: 1.6 };
export const stagger = { lines: 0.08, items: 0.06, rows: 0.12 };
export const spring = { ui: { type: "spring", stiffness: 420, damping: 32 } }; // small controls only
```

### 2.3 Rules as implemented
- **`<html class="no-js">`** is replaced by `js` in a tiny inline script before paint. Hidden initial states only exist under `.js` (CSS) or inside client components that render content visibly on the server and animate after mount. Result: crawlers, link previews and no-JS readers see everything.
- A **`MotionProvider`** wraps the app: `MotionConfig reducedMotion="user"`, `LazyMotion features={domAnimation}`. It also exposes a `useMotionOK()` hook that is false under reduced motion, on save-data connections, or before hydration.
- A **reveal primitive set** in `components/motion/`, which all sections use instead of ad-hoc animation:
  - `RevealLines` (masked line slide-up)
  - `RevealWipe` (clip-path wipe)
  - `DrawPath` (stroke-dashoffset)
  - `CountThrough` (typographic numeral roll)
  - `Marquee` (pausable)
  - `Stagger`

  Each primitive has a reduced-motion branch: at most a 150ms opacity fade, or nothing.
- **Off-screen work stops:** `useInView({ margin: "-10% 0px" })` gates everything; the marquee pauses on `visibilitychange`.
- **CLS = 0:** reserved boxes (aspect-ratio on images, fixed heights for the header auth island and the countdown); only transform/opacity/clip-path/stroke-dashoffset are animated.

### 2.4 The moments (brief §3.3), how each is built

| # | Moment | Implementation | Reduced motion |
|---|---|---|---|
| 1 | Intro + hero | Client `Intro` overlay: if `sessionStorage.sreiIntro` is unset, the RouteLine draws for 600ms and the logo mark scales from 0.96 to 1, then the overlay lifts with clip-path (total ≤1.2s; click/Esc/any key skips it). The headline uses `RevealLines`: the text is split into lines at runtime from the rendered layout and re-split on resize, so reading order stays intact. The hero is a 12-col grid: statement in cols 1–8, a dateline column in 10–12 (forum edition, forum dates, latest WP number, from content files) and a drifting map fragment (`translate` loop, 40s, paused off-screen). Buttons: an underline draws from the left, the arrow moves 3px, and a magnetic pull (max 4px) on `(hover:hover) and (pointer:fine)` only. | No intro; static hero |
| 2 | Map scene | Desktop (≥1024px and fine pointer): GSAP ScrollTrigger pins a 300vh section. One timeline: country outlines draw, then cities fade/scale in, then 4 outward corridors draw with captions swapping, then 4 return lines draw in gold. Mobile: 4 stacked frames (outline / cities / corridors out / return), each animating with `useInView`; no pinning. Keyboard: the section has no focusable elements, so Tab passes through it. A "Skip illustration" link before it jumps to the pillars. | Final composed static SVG |
| 3 | Pillars | 3 full-width rows (not cards): a big serif numeral (`CountThrough` rolls 0→1, 0→2, 0→3 as a typographic flourish), title, paragraph, the emblem (`DrawPath`). On hover, a gold hairline extends to full width with `scaleX`. | Static |
| 4 | Latest briefs | Mobile: a `scroll-snap-type: x mandatory` rail with peeking cards. Desktop: lead brief across 7 columns plus two stacked in 5. Covers use `RevealWipe` (cream panel `clip-path: inset(0 0 0 100%)`) and the image scales from 1.06 to 1 over `slow`. | Static |
| 5 | Latest papers | A table-of-contents list: WP number in the margin column, serif title, authors in small caps. On hover/focus, a gold leader (`scaleX`) runs from the number to the title and a "PDF" tab slides out 8px. | Leader shown statically on hover |
| 6 | Forum band | A navy full-bleed band. `Marquee` of the themes from forum.json (CSS transform loop; the duplicate copy is `aria-hidden`; pauses on hover, focus-within and tab hidden; a visible pause button for WCAG 2.2.2). The countdown renders only if `submissionDeadline` is a valid ISO date (a new forum.json field, §6). | No marquee: themes as a static list |
| 7 | Page transitions | React `<ViewTransition>` around page content; a CSS `::view-transition-old/new(root)` cream ink-wipe (clip-path, 380ms). Shared names: `brief-title-{slug}`, `paper-number-{n}`. Unsupported browsers get an instant swap. | Instant |
| 8 | Reading pages | A progress line (`scaleX` from `useScroll`), a drop cap, `<Chart>` wrapped in `RevealWipe`, MDX footnotes (remark-gfm) rendered as **sidenotes** on ≥1280px and as tap-to-expand `<details>` on mobile. Share/Copy buttons with an ink-stamp check (an SVG stamp scales from 1.3 to 1 with a slight rotation, 250ms). Next/prev links reveal the title on hover. | Static, no wipes |
| 9 | Forum page | Timeline as a vertical `DrawPath` dotted route; a "you are here" marker positioned between real dates (hidden if any date is a placeholder). Rubric bars use `scaleX` to points/30 (labels always visible as text). Themes list ↔ mini map: hover/focus/tap on a theme highlights a corridor with a stroke-color change. | Static bars, no draw |
| 10 | About | Team photos with a duotone (`filter: grayscale + sepia + hue` approximation, or an SVG `feColorMatrix` duotone) and a museum-label caption strip. Placeholder frames are clearly marked. Founder's story in a pull-quote layout with a large opening quote mark. | Same, no motion |
| 11 | Micro-interactions | Focus rings animate `outline-offset` from 6 to 2px (still visible at all times). Nav underlines use `scaleX` from the left. Mobile menu: a full-screen cream sheet that slides in, items staggered, a RouteLine drawing along the bottom; focus is trapped inside while open; Esc closes it. 404: a small caravan (waypoint glyph) walks along a dotted line in a loop that stops after 3 cycles. | Static |
| 12 | Cursor | Native cursor. Map waypoints get a hover ring on desktop only. | n/a |

### 2.5 Performance plan
- Public pages stay SSG. Animations live in small client islands; the page shell stays a Server Component.
- JS budget for `/`: Next/React runtime (~95 KB gz) + motion (LazyMotion `domAnimation` ~18 KB) + our islands (~20 KB) + Lenis (~6 KB, after idle) ≈ **~140 KB** initial. GSAP (~45 KB) loads only near the map. Checked with `@next/bundle-analyzer` in every phase.
- Fonts: `next/font` subsets `latin` + `latin-ext` (needed for Uzbek Latin later); variable axes instead of multiple weights.
- Images: `next/image` for photos and covers once real ones exist; SVG placeholders stay `<img>`.
- **Measurement caveat:** Vercel preview URLs on this team are behind Vercel Authentication, so Lighthouse and Playwright run against `next start` locally (same build output), plus a manual production check after merge. Testing previews directly would need a "Protection Bypass for Automation" secret; I can set that up if wanted.

---

## 3. Accounts, sign-up, registration, dashboard

### 3.1 Services
- **Supabase** (Auth + Postgres + Storage), free tier, added through the **Vercel Marketplace** so `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected into the project automatically. Library: `@supabase/ssr` 0.12.x + `@supabase/supabase-js` 2.119.x.
- **Resend** 6.37.x + `@react-email/components` 1.0.x for email.
  - Sender: `SREI <hello@silkroadecon.asia>`. **Assumption:** the reply-to is the owner's Gmail until a real mailbox exists.
  - Supabase Auth's own emails (magic links) are sent **through Resend SMTP**, so they come from the SREI domain and aren't rate-limited by Supabase's default mailer.
- **Cloudflare Turnstile** via `@marsidev/react-turnstile` 1.6.x, verified server-side.
- **Rate limiting:** a Postgres-based limiter, a `rate_limits` table plus a SQL function called from Server Actions. This avoids adding Upstash as a 4th service, and the volume is tiny. If it ever matters, swapping in Upstash is a one-file change. *(Deviation from the brief's suggestion, chosen for fewer accounts to manage.)*
- **Validation:** `zod` 4.6.x, schemas in `lib/schemas/` shared by client and server.

### 3.2 Database schema (`supabase/migrations/0001_init.sql`)
```sql
-- profiles: 1:1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  country text not null,                 -- ISO 3166-1 alpha-2
  institution text not null check (char_length(institution) <= 160),
  education_level text not null check (education_level in ('high_school','undergraduate','graduate')),
  birth_year int not null check (birth_year between 1900 and extract(year from now())::int - 13),
  telegram text check (telegram ~ '^@?[A-Za-z0-9_]{5,32}$'),
  bio text check (char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guardian_consents (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  confirmed boolean not null check (confirmed),
  guardian_email text,
  confirmed_at timestamptz not null default now()
);

create type registration_status as enum ('submitted','under_review','finalist','not_selected','winner');

create table public.forum_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  edition text not null,                 -- forum.json current.name at submission time
  title text not null check (char_length(title) between 5 and 250),
  abstract text not null check (char_length(abstract) between 100 and 2500),
  theme text not null,
  file_path text not null,               -- storage key in private bucket
  original_work boolean not null check (original_work),
  publication_consent boolean not null,
  conduct_agreed boolean not null check (conduct_agreed),
  status registration_status not null default 'submitted',
  status_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, edition)              -- one entry per person per edition (question for owner)
);
create index on public.forum_registrations (edition, status);
create index on public.forum_registrations (theme);

create table public.coauthors (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.forum_registrations(id) on delete cascade,
  name text not null, email text not null
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  confirm_token_hash text,               -- sha256 of token; raw token only in the email
  unsubscribe_token_hash text not null,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table public.admin_users (email citext primary key);

create table public.rate_limits (key text, window_start timestamptz, count int, primary key (key, window_start));
```

**RLS** (enabled on every table; no table is readable by `anon`):
- `profiles`: select/insert/update where `id = auth.uid()`; delete only via the server (account deletion uses the service role, after re-auth).
- `guardian_consents`: select/insert where `user_id = auth.uid()`.
- `forum_registrations`:
  - select where `user_id = auth.uid()`
  - insert with check `user_id = auth.uid() and status = 'submitted'`
  - **no update by users** (the status can only change server-side)
- `coauthors`: select/insert through an `exists` check on the parent registration's owner.
- `newsletter_subscribers`, `admin_users`, `rate_limits`: **no policies** (service role only, through Server Actions).
- **Storage** bucket `submissions`: private; `insert` allowed when the object path starts with `auth.uid()/`, the MIME type is `application/pdf` and the size is ≤10 MB; `select` only for the owner of the path prefix. Admins get **signed URLs** (60s) generated server-side.
- **Under-13 enforcement** happens in three places: the client form, the server Zod schema, and the `birth_year` check constraint above.

### 3.3 Routes

| Route | Type | Access |
|---|---|---|
| `/signin` | dynamic | public; magic link + Google; Turnstile |
| `/auth/callback` | route handler | exchanges the code, then `/account/setup` if no profile, else `/account` |
| `/account/setup` | dynamic | logged in, no profile yet (age gate, guardian consent if 13–17) |
| `/account` | dynamic | logged in: profile edit, my registrations, delete account |
| `/forum/register` | dynamic | logged in + profile + forum `status: open` + `registrationOpen: true` |
| `/newsletter/confirm`, `/newsletter/unsubscribe` | route handlers | token-based, one click |
| `/dashboard`, `/dashboard/registrations/[id]` | dynamic | session email in `admin_users` |
| `/privacy`, `/terms` | static | public; with `[placeholder: legal review]` sections |

- `proxy.ts` (Next 16) refreshes the Supabase session cookie and redirects anonymous visitors away from `/account*`, `/forum/register` and `/dashboard*`. Each page **also** checks the session server-side.
- The header auth island (`components/auth/HeaderAccount.tsx`) has a reserved fixed width, fetches `/api/session` after load, and shows "Sign in" or an initials menu. Static pages stay static.

### 3.4 Emails (React Email, brand-styled)
- newsletter confirm
- newsletter welcome
- registration received
- status changed (one template, the copy varies by status)
- account deleted
- Supabase magic link, through a custom SMTP template

Every email has a plain-text part and an unsubscribe link (the newsletter ones also carry a `List-Unsubscribe` header).

### 3.5 Dashboard
- **Table:** registrations with filters (edition, theme, status, country, level), sorting and a text search on title.
- **Detail view:** the abstract, co-authors, the PDF in an `<iframe>` from a signed URL, and a status select. Changing the status sends the email in the same Server Action, with a confirmation step first.
- **CSV exports:** registrations and confirmed newsletter subscribers.
- **Counts:** total registrations, per theme, per country, confirmed subscribers. All are live `count(*)` queries.
- Links to `/admin` (Decap), and Decap gets a link back through its `site_url`/`display_url` settings.

### 3.6 Analytics events
`track('newsletter_signup')`, `track('account_created')`, `track('forum_registration_submitted', { theme })`. Theme is not personal data; no other properties are sent.

---

## 4. Extras (brief §5), decisions
- **Search:**
  - A build-time `public/search-index.json` (title, summary/abstract, tags, authors, keywords, URL) plus `minisearch` (~7 KB), loaded when the search dialog opens.
  - Pagefind was considered, but it needs a post-build step on Vercel's output; for ~dozens of documents minisearch is simpler.
  - The `/` shortcut opens it, except while typing in an input.
- **Feeds:** `app/briefs/feed.xml/route.ts` and `app/papers/feed.xml/route.ts` as static route handlers (Atom).
- **Citations:**
  - `lib/cite.ts` generates APA, Chicago, BibTeX and RIS
  - downloads via static route handlers `app/papers/[slug]/cite.bib` and `.ris`
  - a popover with tabs and copy buttons
- **OG images:** restyled to the editorial look (serif title, section mark, route line).
- **Print:** `@media print` rules (no header/footer/motion, `a[href]::after` shows URLs, figure breaks avoided).
- **i18n readiness:** `lib/i18n.ts` with an `en` dictionary for UI strings; content untouched.
- **Empty and error states:** designed components with a waypoint ornament; `app/error.tsx` and `global-error.tsx`.
- **Sharing:** `navigator.share` on supporting devices, falling back to the Telegram share link and copy-link.

---

## 5. CMS changes (`public/admin/config.yml` + `lib/content.ts`, same commit)
New optional fields in `content/forum.json` → `current`:
- `submissionDeadline` (ISO datetime or empty): drives the countdown and the timeline "you are here"
- `registrationOpen` (boolean): turns the on-site registration form on or off
- `registrationMode` (`"google_form"` | `"site"`): which "Submit your research" target is used; defaults to `google_form`, so nothing changes until the owner switches it
- `forumDateStart` / `forumDateEnd` (ISO, optional): machine-readable versions of the free-text dates, for the timeline marker and the event JSON-LD

Old files stay valid: every new field is optional, and the validator treats missing values as "not set".

---

## 6. Phases (one PR each, merged only on the owner's go-ahead)

| Phase | Contents | Owner action needed before it? |
|---|---|---|
| **1. Foundations** | type scale, grid, tokens, grain, ornament set, `lib/motion.ts`, primitives, MotionProvider, Lenis, view transitions, header/nav/mobile menu/footer redesign, focus styles | none |
| **2. Home** | intro, hero, map scene (+ map build script), pillars, briefs, papers TOC, forum band | none |
| **3. Inner pages** | briefs list and reading experience (sidenotes, drop cap, progress), papers + citation tools, forum page, about, contact, 404/error, search, feeds, print, OG restyle, CMS fields | none |
| **4. Accounts** | Supabase migrations, auth (magic link + Google), profile setup with age gate and guardian consent, `/account`, newsletter double opt-in, Turnstile, rate limits, privacy/terms, email templates | **yes:** Supabase, Resend, Turnstile, Google OAuth (§7) |
| **5. Registration + dashboard** | `/forum/register` with upload, status workflow and emails, `/dashboard`, CSV, counts, `registrationMode` switch | admin email confirmation |
| **6. Hardening** | axe on all pages/states, Lighthouse tuning to budget, complete e2e suite (incl. two-user RLS test), README rewrite | none |

Phases 1–3 need nothing from the owner and can start immediately after approval. Phase 4 can't be tested end-to-end until the accounts exist.

---

## 7. What the owner must do (Phase 4), step by step

I'll handle everything I can through the Vercel connection: environment variables, Resend's DNS records in Vercel DNS, and redeploys. These steps need the owner's own logins:

1. **Supabase (≈5 min):**
   1. Vercel → project `silk-road-economic-institute` → **Storage** (or **Integrations → Marketplace**) → **Supabase** → **Create** → region **Frankfurt (eu-central-1)**, the closest to Central Asia → plan **Free** → connect it to this project for **Production and Preview**.
   2. Tell me when it's done. I'll then run the migrations and give you one SQL line to make yourself an admin (`insert into admin_users values ('ulashovmuhammadjon1@gmail.com')`), or I'll include it in a migration if you prefer.
2. **Resend (≈5 min):**
   1. Sign up at resend.com with the owner's email.
   2. **Domains → Add domain →** `silkroadecon.asia`. Resend shows 3–4 DNS records; tell me when you see them and I'll add them in Vercel DNS for you.
   3. **API Keys → Create** ("Sending access", domain `silkroadecon.asia`). Paste it **directly into Vercel** as `RESEND_API_KEY` (Settings → Environment Variables → Sensitive), not in chat.
3. **Cloudflare Turnstile (≈3 min):** create a free Cloudflare account → **Turnstile → Add site** → hostname `silkroadecon.asia` → widget mode **Managed**. Put the **Site Key** in Vercel as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Config) and the **Secret Key** as `TURNSTILE_SECRET_KEY` (Sensitive).
4. **Google sign-in (≈10 min):** Google Cloud Console → create the project "SREI" → **APIs & Services → OAuth consent screen** (External; app name SREI; support email; authorized domain `silkroadecon.asia`) → **Credentials → Create OAuth client ID → Web application**. Authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`; I'll give you the exact value once Supabase exists. Then in Supabase → **Authentication → Providers → Google**, paste the Client ID and Secret.
5. **Supabase Auth settings (I'll give exact values):** Site URL `https://silkroadecon.asia`; redirect URLs `https://silkroadecon.asia/auth/callback` and `http://localhost:3000/auth/callback`; SMTP set to Resend (`smtp.resend.com`, port 465, user `resend`, password = the Resend API key).

**New environment variables (summary):**

| Variable | Set by | Type |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase integration (automatic) | — |
| `RESEND_API_KEY` | owner | Sensitive |
| `EMAIL_FROM` (`SREI <hello@silkroadecon.asia>`), `EMAIL_REPLY_TO` | me | Config |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | owner | Config |
| `TURNSTILE_SECRET_KEY` | owner | Sensitive |
| `NEWSLETTER_TOKEN_SECRET` (random, for hashing tokens) | me (generated, never shown) | Sensitive |

`.env.example` will document all of them.

---

## 8. Risks and how they're handled

| Risk | Mitigation |
|---|---|
| Heavy motion hurts phones (most readers arrive from Telegram/Instagram on mobile) | Mobile gets simplified scenes; GSAP desktop-only; strict budget measured each phase; `save-data` disables extras |
| "Extremely animated" vs accessibility and reading | Reduced-motion path for every primitive; nothing auto-plays indefinitely except the pausable marquee; reading pages stay calm |
| Collecting minors' data | Minimal fields, under-13 block, guardian confirmation, private profiles, real deletion, privacy page flagged for legal review. **The owner should get the privacy/terms text checked by someone qualified before opening registration**; I can't give legal advice |
| Vendor accounts not created → Phase 4 blocked | Phases 1–3 don't depend on them; registration stays on the Google Form until `registrationMode` is switched |
| View Transitions + Next 16 integration edge cases | Phase 1 starts with a short check; fallback to Motion `AnimatePresence` in `template.tsx` |
| Map geography looks wrong or politically contentious | Natural Earth admin-0 (the standard neutral dataset), no disputed-border emphasis, decorative label |
| Decap CMS breaks from schema changes | Only optional fields are added; `config.yml` updated in the same commit; an e2e test loads `/admin` and validates the config |
| Preview URLs are behind Vercel login | Tests run locally on the production build; optional automation-bypass secret |
| Spam sign-ups | Turnstile + rate limits + double opt-in |

---

## 9. Questions for the owner (answer when approving; defaults in brackets)
1. **One forum entry per person per edition?** [Yes, one; co-authors are listed inside it.]
2. **Sender address:** `hello@silkroadecon.asia` OK? Replies go to your Gmail until you set up a mailbox. [Yes.]
3. **Postgres rate limiting instead of Upstash** (one fewer account)? [Yes.]
4. **Supabase region Frankfurt?** [Yes.]
5. **Should the newsletter send automatically when a new brief is published,** or will you send it manually from Resend? [Manual for now; automation can come later.]
6. **Keep the Google Form as the active submission method** until you switch `registrationMode` in /admin? [Yes.]
