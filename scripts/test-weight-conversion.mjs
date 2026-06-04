// E2E for the kg/lb conversion + last-actual display fix.
//   Seed: history says push-1 was last logged at 25 lb × 8 (dumbbell)
//   Then: flip kg/lb to kg, open the card → 11.5 kg should show
//   Open modal → "11.5 kg × 8 · Hard" in green
//   Open Logger → weight input pre-fills 11.5

import puppeteer from 'puppeteer-core';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const URL = process.env.TEST_URL || 'http://localhost:5173/';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
page.on('pageerror', (err) => console.log('[browser error]', err.message));

await page.goto(`${URL}?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });

// Seed: history (25 lb) + weight unit set to kg
await page.evaluate(() => {
  localStorage.setItem('atlas.history', JSON.stringify({
    '2026-06-02-push': {
      type: 'push',
      startedAt: 1748800000000,
      completedAt: 1748803600000,
      dayIdx: 0,
      completedSets: {
        'push-1': [
          { weight: 25, weightUnit: 'lb', reps: 8, difficulty: 'hard', notes: '', variant: 'dumbbell', ts: 1748801000000 },
        ],
      },
    },
  }));
  localStorage.setItem('atlas.weightUnit', JSON.stringify('kg'));
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(500);

// Open Push day
await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) =>
    /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
  );
  day?.click();
});
await sleep(900);

// Find the Overhead Press card and inspect its weight cell
const cardWeight = await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  const card = h3?.closest('button');
  // The footer weight line is the first text node containing kg or lb
  const text = card?.textContent || '';
  const m = text.match(/(\d+(?:\.\d+)?)\s*(kg|lb)/);
  return m ? `${m[1]} ${m[2]}` : null;
});
console.log('Card weight:', cardWeight);

// Open the modal and check the stats line
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);

const modalStats = await page.evaluate(() => {
  const lines = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t.length < 100 && /\d+\s*kg/.test(t));
  return lines[0];
});
console.log('Modal stats with kg:', modalStats);

// Find the modal's edit pencil → open Logger via Complete Set instead
// Actually open Logger by closing modal first and tapping COMPLETE SET
await page.evaluate(() => {
  const done = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Done',
  );
  done?.click();
});
await sleep(500);
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim().toUpperCase() === 'COMPLETE SET',
  );
  btn?.click();
});
await sleep(700);

const loggerWeight = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input[inputmode="decimal"]')];
  // The unit suffix should also be present
  const suffix = [...document.querySelectorAll('span')]
    .map((s) => s.textContent?.trim())
    .find((t) => /^(kg|lb)$/i.test(t || ''));
  return { weight: inputs[0]?.value, suffix };
});
console.log('Logger pre-fill:', JSON.stringify(loggerWeight));

const ok =
  /11\.5\s*kg/.test(cardWeight || '') &&
  /11\.5\s*kg/.test(modalStats || '') &&
  loggerWeight?.weight === '11.5' &&
  loggerWeight?.suffix === 'kg';
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
