# Silk Road Economic Institute website

Source for **silkroadecon.asia**: Next.js (App Router) + TypeScript + Tailwind CSS. Every page is pre-rendered at build time from files in `/content`. There is no database or CMS.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # the same build Vercel runs; fails with a clear message if a content file is wrong
```

## Add a new brief (one file)

1. Copy `content/briefs/_template.mdx` to a new file, e.g. `content/briefs/2026-12-05-som-exchange-rate.mdx`. The file name becomes the URL: `/briefs/2026-12-05-som-exchange-rate`.
2. Fill in the frontmatter (`title`, `date`, `author`, `summary`, `tags`, optional `coverImage`) and write the text in Markdown.
3. Images and charts go in `public/briefs/`. Reference them as `/briefs/file.png`, either with Markdown (`![alt text](/briefs/file.png)`) or the `<Chart />` component for a caption and source line.
4. Commit and push. Vercel rebuilds and the brief is live in about a minute, on the home page, `/briefs`, its tag pages and the sitemap.

Tags with filter pages: `Remittances`, `Exchange Rates`, `Labor Migration`, `Policy` (edit `lib/tags.ts` to add one).

## Add a new working paper (one file + the PDF)

1. Put the PDF in `public/papers/`, e.g. `public/papers/srei-wp-001.pdf`.
2. Copy `content/papers/_template.mdx` to `content/papers/srei-wp-001.mdx` and fill in the fields. `paperNumber` must be unique.
3. Commit and push. The paper page gets the PDF viewer, download button, citation and Google Scholar meta tags. If the PDF file is missing, the page shows "PDF coming soon" instead of a broken link.

Example (`content/papers/srei-wp-001.mdx`):

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

Commands to publish it:

```bash
git add content/papers/srei-wp-001.mdx public/papers/srei-wp-001.pdf
git commit -m "Add Working Paper No. 1"
git push
```

## Other content you can edit

| What | File |
| --- | --- |
| Email, Instagram, Google Form link | `lib/site.ts` |
| Forum dates, timeline, themes, rubric, awards, past editions | `content/forum.json` |
| Team members | `content/team.json` |
| Judges & advisors (section hidden while empty) | `content/judges.json` |
| Founder's story | `app/about/page.tsx` |
| Logo and favicon | `public/logo.png` (square PNG, at least 512×512; replace the placeholder) |

Person format for `team.json` / `judges.json`:

```json
{ "name": "Full Name", "role": "Judge", "affiliation": "University", "bio": "One sentence.", "photo": "/team/name.jpg" }
```

Anything still written in `[square brackets]` shows on the site with a gold dashed highlight, so unfinished text is easy to spot. Search the repo for `[` before launch.

When the Winter 2026 forum is over, set `"status": "closed"` in `content/forum.json` (this hides the home-page banner) and add an entry to `pastEditions`.

## Deploy

### 1. Push to GitHub
Create an empty repository on github.com (no README), then from this folder:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/silkroadecon.git
git push -u origin main
```

### 2. Import into Vercel
vercel.com → **Add New… → Project** → pick the repository → framework preset **Next.js** (detected automatically) → **Deploy**. No environment variables are needed.

### 3. Connect silkroadecon.asia
Project → **Settings → Domains** → add `silkroadecon.asia`, and also `www.silkroadecon.asia` set to redirect to the apex domain. Because the domain was bought on Vercel, DNS is configured automatically; HTTPS follows within minutes.

### 4. Turn on Web Analytics
Project → **Analytics** tab → **Enable**, then redeploy once (Deployments → ⋯ → Redeploy). The `<Analytics />` component is already in `app/layout.tsx`. Page views per URL (e.g. `/briefs/...`, `/papers/...`) appear under **Analytics → Pages**. PDF downloads are files, not pages, so they are not counted separately.

### 5. Publishing later
Every `git push` to `main` deploys to production. Pushes to other branches get preview URLs.
