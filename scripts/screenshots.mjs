// One-shot script that drives a headless Chrome session through the
// dev server and saves screenshots for the README into docs/screenshots/.
//
//   node scripts/screenshots.mjs
//
// Requires the dev server running on http://localhost:5173.

import puppeteer from 'puppeteer-core';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'docs/screenshots';
const URL = 'http://localhost:5173';

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
await page.setUserAgent(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
);

async function shot(name, options = {}) {
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    type: 'png',
    ...options,
  });
  console.log(`✓ ${name}`);
}

async function clickByText(selector, text) {
  await page.evaluate(
    ({ sel, txt }) => {
      const btn = [...document.querySelectorAll(sel)].find((b) =>
        new RegExp(txt, 'i').test(b.textContent || ''),
      );
      btn?.click();
    },
    { sel: selector, txt: text },
  );
}

// -------- 1. Dashboard (English) --------
await page.goto(`${URL}/?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  localStorage.clear();
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(800);
await shot('01-dashboard');

// -------- 2. Workout Day --------
await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) =>
    /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
  );
  day?.click();
});
await sleep(1200);
// Wait for poster image to load
await page.waitForSelector('video[poster]', { timeout: 4000 }).catch(() => {});
await sleep(800);
await shot('02-workout-day');

// -------- 3. Body Map close-up --------
await page.evaluate(() => {
  // Body map is rendered by the body-muscles library — find by the
  // library's wrapper class. Scroll the parent grid into view so both
  // front + back charts land centered.
  (document.querySelector('.body-map-root') ||
    document.querySelector('.body-chart-container'))?.scrollIntoView({
    block: 'center',
  });
});
await sleep(800);
await shot('03-body-map');

// -------- 4. Exercise Modal --------
await page.evaluate(() => {
  const overhead = [...document.querySelectorAll('button')].find((b) =>
    /Overhead Press/.test(b.textContent),
  );
  overhead?.click();
});
await sleep(1600);
await shot('04-exercise-modal');

// -------- 5. Tempo + tutorial deeper --------
await page.evaluate(() => {
  const modal = document.querySelector('[class*="max-h-\\[90vh\\]"]');
  if (modal) modal.scrollTop = 240;
});
await sleep(600);
await shot('05-tempo-tutorial');

// -------- 5b. Logger sheet (record a set) --------
// First close the open exercise modal so we're back on the workout day
await page.evaluate(() => {
  const done = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Done',
  );
  done?.click();
});
await sleep(500);
await page.evaluate(() => {
  window.scrollTo(0, 0);
});
await sleep(300);
// Tap "Complete Set" on the Up Next active focus card
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim().toUpperCase() === 'COMPLETE SET',
  );
  btn?.click();
});
await sleep(900);
await shot('05b-logger');

// Close logger
await page.evaluate(() => {
  const cancel = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Cancel',
  );
  cancel?.click();
});
await sleep(500);

// -------- 6. Cool-down active --------
await page.evaluate(() => {
  const done = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Done',
  );
  done?.click();
});
await sleep(500);
await page.evaluate(() => {
  window.scrollTo(0, 99999);
});
await sleep(400);
await page.evaluate(() => {
  const start = [...document.querySelectorAll('button')].find((b) =>
    /START COOL-DOWN/i.test(b.textContent),
  );
  start?.click();
});
await sleep(1400);
await page.evaluate(() => {
  document.querySelector('[class*="aspect-square"]')?.scrollIntoView({
    block: 'center',
  });
});
await sleep(500);
await shot('06-cooldown-timer');

// -------- 7. Settings sheet --------
await page.evaluate(() => {
  document.querySelector('[aria-label="Settings"]')?.click();
});
await sleep(900);
await shot('07-settings');

// -------- 8. History sheet --------
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    /View past sessions/i.test(b.textContent),
  );
  btn?.click();
});
await sleep(900);
await shot('08-history-empty');

// -------- 9. Chinese mode --------
await page.evaluate(() => {
  document.querySelectorAll('button').forEach((b) => {
    if (b.textContent.trim() === 'Done') b.click();
  });
});
await sleep(500);
await page.evaluate(() => {
  // open settings
  document.querySelector('[aria-label="Settings"]')?.click();
});
await sleep(800);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const zh = btns.find((b) => b.textContent.trim() === '中');
  zh?.click();
});
await sleep(400);
await page.evaluate(() => {
  // close settings
  const done = [...document.querySelectorAll('button')].find(
    (b) => /Done|完成/.test(b.textContent.trim()),
  );
  done?.click();
});
await sleep(700);
await shot('09-dashboard-zh');

// Open Push Day in ZH
await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) => {
    const t = b.textContent.replace(/\s+/g, '');
    return /周一/.test(t) && /推日/.test(t);
  });
  day?.click();
});
await sleep(1200);
await page.evaluate(() => {
  // Body map is rendered by the body-muscles library — find by the
  // library's wrapper class. Scroll the parent grid into view so both
  // front + back charts land centered.
  (document.querySelector('.body-map-root') ||
    document.querySelector('.body-chart-container'))?.scrollIntoView({
    block: 'center',
  });
});
await sleep(700);
await shot('10-body-map-zh');

await browser.close();
console.log('\nAll screenshots saved to docs/screenshots/');
