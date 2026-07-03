// v2 (neon) screenshot pass for the README — separate from the v0.8
// script so both walkthroughs can be regenerated independently.
//
//   npm run dev   (in another terminal)
//   node scripts/screenshots-v2.mjs
//
// Saves into docs/screenshots/v2/.

import puppeteer from 'puppeteer-core';
import { mkdirSync, existsSync } from 'fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'docs/screenshots/v2';
const BASE = 'http://localhost:5173';

const WIDTH = 390;
const HEIGHT = 844;

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
});

const page = await browser.newPage();

// Seed a deterministic neon + zh + skylar-plan state with a little
// history so charts and "last time" chips have something to show.
await page.goto(BASE, { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem('atlas.v2theme', JSON.stringify('neon'));
  localStorage.setItem('atlas.lang', JSON.stringify('zh'));
  localStorage.setItem('atlas.langMigratedV2', JSON.stringify(1));
  localStorage.setItem('atlas.weightUnit', JSON.stringify('kg'));
  localStorage.setItem(
    'atlas.overrides',
    JSON.stringify({ plan: { active: 'skylar' } }),
  );
  const now = Date.now();
  const day = 86400000;
  const sess = (type, daysAgo, sets) => ({
    type,
    startedAt: now - daysAgo * day - 3600000,
    completedAt: now - daysAgo * day,
    completedSets: sets,
  });
  localStorage.setItem(
    'atlas.history',
    JSON.stringify({
      h1: sess('push', 9, { 's-push-1': [{ weight: 4, reps: 14, difficulty: 'moderate', weightUnit: 'kg' }] }),
      h2: sess('pull', 8, { 's-pull-1': [{ weight: 35, reps: 10, difficulty: 'hard', weightUnit: 'kg' }] }),
      h3: sess('leg', 6, { 's-leg-1': [{ weight: 60, reps: 10, difficulty: 'moderate', weightUnit: 'kg' }] }),
      h4: sess('push', 4, { 's-push-1': [{ weight: 4.5, reps: 12, difficulty: 'moderate', weightUnit: 'kg' }] }),
      h5: sess('pull', 2, { 's-pull-1': [{ weight: 37.5, reps: 9, difficulty: 'hard', weightUnit: 'kg' }] }),
    }),
  );
});

async function shoot(name) {
  await sleep(600);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('✓', name);
}

// ── 01 dashboard (neon, zh, skylar plan, populated charts)
await page.goto(`${BASE}/?v=2`, { waitUntil: 'networkidle0' });
await sleep(2200);
await shoot('01-dashboard-neon');

// scroll to weekly split + volume chart
await page.evaluate(() => {
  document.querySelector('main')?.scrollTo({ top: 700, behavior: 'instant' });
});
await shoot('02-volume-split');

// ── 03 workout day — tap a training tile
const opened = await page.evaluate(() => {
  const tiles = [...document.querySelectorAll('button')];
  const t = tiles.find((b) => /拉/.test(b.textContent) && b.className.includes('aspect-'));
  if (t) { t.click(); return true; }
  const rec = tiles.find((b) => /拉日/.test(b.textContent) && b.className.includes('v2-card'));
  rec?.click();
  return !!rec;
});
if (opened) {
  await sleep(1800);
  await shoot('03-workout-day');

  // scroll to exercise list
  await page.evaluate(() => {
    document.querySelector('main')?.scrollTo({ top: 900, behavior: 'instant' });
  });
  await shoot('04-exercise-list');

  // ── 05 exercise modal — open first exercise card via its react handler
  await page.evaluate(() => {
    const card = [...document.querySelectorAll('button')].find(
      (b) => b.className.includes('w-full flex items-start gap-3 text-left'),
    );
    if (!card) return;
    const k = Object.keys(card).find((x) => x.startsWith('__reactProps'));
    card[k]?.onClick?.({ preventDefault() {}, stopPropagation() {} });
  });
  await sleep(1600);
  await shoot('05-exercise-modal');

  // scroll modal to the how-to / coach content
  await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const scroller = dialog?.querySelector('.overflow-y-auto') || dialog;
    scroller?.scrollTo({ top: 900, behavior: 'instant' });
  });
  await shoot('06-coach-content');
}

await browser.close();
console.log('done →', OUT);
