# ATLAS — AI Workout Companion · Agent guide

## Auto-ship workflow

**Every code change in this project ships end-to-end automatically.** When the
user asks for a change, the agent runs this pipeline without asking:

1. **Edit** the source files.
2. **`npm run build`** — verify the change compiles. If the build fails, stop
   here. Report the error, fix it, re-build. Do NOT commit broken code.
3. **`git add` + `git commit`** — one commit per logical change. Follow the
   repo's commit style (`feat:` / `fix:` / `docs:` / `vX.Y.Z:` prefix + concise
   subject + body explaining *why*). Always sign with the Co-Authored-By
   trailer Claude Code uses.
4. **`git push origin main`** — straight to main. This repo doesn't use PRs.
5. **`npx vercel --prod --yes`** — push to production. The alias
   `ai-workout-companion.vercel.app` is the single source of truth for what's
   live.
6. **Report** the final URL + commit hash to the user. If anything in steps
   2–5 failed, stop and surface the failure — don't silently skip a step.

### When NOT to ship automatically

- The user explicitly says **"先不要 commit / 先不要 push / 先不要 deploy"** —
  any of those scopes the pipeline down accordingly.
- The change is purely investigative (reading code, running diagnostics) with
  no source edits.
- The change touches `LICENSE`, `.env*`, secrets, or anything that would
  expose private data — pause and confirm even if just renaming.

### Safety rails (never bypass)

- Never `git push --force` to main.
- Never `git commit --amend` after a push has gone out.
- Never `--no-verify` to skip hooks. If a hook fails, fix the underlying issue.
- Never `git add -A` / `git add .` — list files explicitly so accidental
  artifacts don't leak in.
- Never commit `.env`, credential files, or anything matching `*-secret.*`.

## Project facts

- **Stack:** React 18 + Vite + Tailwind + Framer Motion. No backend.
  Everything is localStorage + a single overrides doc.
- **State:** `OverridesProvider` (in `src/hooks/useOverrides.jsx`) owns every
  user-editable knob — profile, per-exercise weight, warm-up videos, exercise
  order (`overrides.order.{workoutId}`), weight unit. One "Reset all" wipes
  the lot.
- **i18n:** Hand-curated EN + ZH in `src/i18n/strings.js` plus per-exercise
  content in `src/i18n/exercisesZh.js` and `warmCoolZh.js`. When adding a UI
  string, add BOTH languages in the same commit — partial translations are a
  bug.
- **Data:** Push / Pull / Leg programs in `src/data/workoutData.js`. Tempo +
  default YouTube IDs in `exerciseMeta.js`. Warm-up + cool-down content in
  `warmCoolData.js`.
- **Body map:** Real 1899 Bouglé anatomical plates (public domain) under
  `public/anatomy/`. Hand-calibrated SVG path overlays in
  `src/components/BodyMap.jsx`. Intensity scoring in `src/utils/muscleMap.js`.
- **Personal data is sanitized.** The repo is public — no real BF %, weights,
  or names belong in source. Use placeholders ("Athlete", `currentBodyFat: 20`,
  `'Assisted'`, etc.).

## Screenshots for README

`scripts/screenshots.mjs` drives headless Chrome to capture every walkthrough
shot. Re-run after meaningful UI changes:

```bash
npm run dev &           # in one terminal
node scripts/screenshots.mjs
```

Outputs to `docs/screenshots/`. The script clears localStorage between flows
so screenshots reflect the cold-start experience.

## Deploy notes

- Vercel project is already linked (`.vercel/project.json` is committed).
  `npx vercel --prod --yes` is one-shot — no login prompt expected.
- The `ai-workout-companion.vercel.app` alias updates within ~20 seconds of a
  prod deploy completing.
- Vercel keeps every prior deploy. To roll back fast:
  `vercel rollback <previous-url>` or use the Vercel dashboard.
- There is no service worker / PWA cache, so a hard refresh on the phone
  picks up the new bundle immediately. (Installed-to-home-screen instances
  may need a delete + reinstall if the manifest changes.)
