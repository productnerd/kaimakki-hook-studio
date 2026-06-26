# Kaimakki Hook Studio

An internal tool for [Kaimakki](https://kaimakki.com) to turn any client brief into scroll-stopping short-form video hooks, drawn from a curated library of **262 proven, universal hook formats**.

## How it works

- **Studio** — describe a brief (client, audience, platform, goal). An AI strategist (Claude) picks the best-fitting formats from the catalogue and writes a set of tailored, ready-to-say hooks, each tagged with its format and a one-line rationale.
- **Library** — browse, search, and filter all 262 hook formats by family, with templates, why-it-works notes, and real example lines (plus niche-specific applied examples).

## Architecture

- **Frontend**: Vite + React + TypeScript + Tailwind, brand-matched to kaimakki.com. Deployed to GitHub Pages.
- **Backend**: Supabase (project `SeeHer`, `knftyqkhampkqchoncel`)
  - `public.kaimakki_hook_formats` — the format library (public read).
  - Edge function `kaimakki-hook-generator` — loads the catalogue and calls the Anthropic API (`ANTHROPIC_API_KEY` secret). Open access.

## The hook library

Built by researching classic direct-response copywriting, short-form video swipe files, curiosity-gap / viral-title theory, storytelling/psychology, and paid-ad/UGC hooks, then deduping into universal formats. Source pipeline:

```
data/raw/*.json         # raw research per source domain
scripts/consolidate.mjs # dedupe + merge -> data/hooks.json
scripts/seed.mjs        # upsert data/hooks.json into Supabase
```

## Develop

```bash
npm install
npm run dev
npm run build
```
