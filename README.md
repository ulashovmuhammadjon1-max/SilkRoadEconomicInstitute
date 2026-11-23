# Silk Road Economic Institute website

Source for **silkroadecon.asia**: Next.js (App Router) + TypeScript + Tailwind CSS. Every page is pre-rendered at build time from files in `/content`. There is no database or CMS.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # the same build Vercel runs; fails with a clear message if a content file is wrong
```

## Editing the site: the admin page (no code)

Go to **https://silkroadecon.asia/admin** and click **Login with GitHub**. You can:

- **Weekly Briefs**: write a brief, upload the cover image and chart, pick tags.
- **Working Papers**: fill in title, number, authors and abstract, then upload the PDF.
- **Settings & Pages**:
  - Contact links & About text (email, Instagram, Google Form link, founder's story)
  - Team (names, roles, bios, photos)
  - Judges & Advisors (hidden on the site while empty)
  - Forum (dates, timeline, themes, rubric, awards, past editions)

Clicking **Publish** saves a commit to GitHub. Vercel rebuilds the site and the change is live in about a minute. Anything still written in `[square brackets]` shows on the site with a gold dashed highlight, so unfinished text is easy to spot.

When the Winter 2026 forum is over, set the forum **Status** to `closed` (this hides the home-page banner) and add an entry under **Past editions**.

### One-time setup: admin login (about 5 minutes)

The admin page needs a GitHub "OAuth App" so it can log you in.

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App** (direct link: https://github.com/settings/applications/new) and fill in:
   - Application name: `SREI admin`
   - Homepage URL: `https://silkroadecon.asia`
   - Authorization callback URL: `https://silkroadecon.asia/api/callback`
2. Click **Register application**, then **Generate a new client secret**. Copy the **Client ID** and the **Client secret**.
3. In Vercel, go to Project → **Settings → Environment Variables** and add both:
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the Client secret
4. Go to **Deployments → ⋯ → Redeploy**. Then open https://silkroadecon.asia/admin and log in.

Only people with write access to the GitHub repository can save changes. To add an editor, invite them under GitHub repository → **Settings → Collaborators**. The admin login only works on `silkroadecon.asia`, so connect the domain first.

## Editing files directly (alternative)

Everything the admin page edits is a plain file, so you can also edit files on GitHub (open the file, click the pencil, commit) or locally.

| What | File |
| --- | --- |
| Briefs | `content/briefs/*.mdx`; images in `public/briefs/` |
| Working papers | `content/papers/*.mdx`; PDFs in `public/papers/` |
| Email, Instagram, Google Form, founder's story | `content/site.json` |
| Team / judges | `content/team.json`, `content/judges.json` |
| Forum | `content/forum.json` |
| Logo and favicon | `public/logo.png` (square PNG, at least 512×512; replace the placeholder) |

To add a brief or paper by hand, copy `templates/brief.mdx` or `templates/paper.mdx` into `content/briefs/` or `content/papers/`, rename it, fill it in, and push. The file name becomes the URL. If a required field is missing, or two papers share a number, the build fails with a message naming the file, and the live site keeps its previous version.

Example paper (`content/papers/srei-wp-001.mdx`, with the PDF at `public/papers/srei-wp-001.pdf`):

```mdx
---
title: "Remittances and School Enrolment in Rural Tajikistan"
paperNumber: 1
authors: ["First Author"]
date: "2026-12-20"
abstract: "The full abstract goes here."
pdfPath: "/papers/srei-wp-001.pdf"
keywords: ["remittances", "education", "Tajikistan"]
forumEdition: "Winter 2026 Research Forum"
---
```

In a brief you can show a chart with Markdown, `![description](/briefs/chart.png)`, or with the `<Chart src="..." alt="..." caption="..." source="..." />` component, which adds a caption and source line.

## Deploy

### 1. GitHub
The code lives at https://github.com/ulashovmuhammadjon1-max/SilkRoadEconomicInstitute (branch `main`).

### 2. Import into Vercel
vercel.com → **Add New… → Project** → pick the repository → framework preset **Next.js** (detected automatically) → **Deploy**. No environment variables are needed.

### 3. Connect silkroadecon.asia
Project → **Settings → Domains** → add `silkroadecon.asia`, and also `www.silkroadecon.asia` set to redirect to the apex domain. Because the domain was bought on Vercel, DNS is configured automatically; HTTPS follows within minutes.

### 4. Turn on Web Analytics
Project → **Analytics** tab → **Enable**, then redeploy once (Deployments → ⋯ → Redeploy). The `<Analytics />` component is already in `app/layout.tsx`. Page views per URL (e.g. `/briefs/...`, `/papers/...`) appear under **Analytics → Pages**. PDF downloads are files, not pages, so they are not counted separately.

### 5. Admin login
Follow "One-time setup: admin login" above.

### 6. Publishing later
Every save in /admin, and every push to `main`, deploys to production.
