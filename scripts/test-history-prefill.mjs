// E2E: seed a fake history, then verify the Logger pre-fills + the
// modal's "Your last" line both reflect it.

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

// Seed history before the React app reads it
await page.evaluate(() => {
  const history = {
    '2026-05-31-push': {
      type: 'push',
      startedAt: 1748800000000,
      completedAt: 1748803600000,
      dayIdx: 5,
      completedSets: {
        'push-1': [
          { weight: 22, weightUnit: 'lb', reps: 10, difficulty: 'moderate', notes: '', variant: 'dumbbell', ts: 1748801000000 },
          { weight: 25, weightUnit: 'lb', reps: 8, difficulty: 'hard', notes: '', variant: 'dumbbell', ts: 1748801600000 },
        ],
      },
    },
    '2026-06-02-push': {
      type: 'push',
      startedAt: 1749000000000,
      completedAt: 1749003600000,
      dayIdx: 0,
      completedSets: {
        'push-1': [
          { weight: 35, weightUnit: 'lb', reps: 8, difficulty: 'hard', notes: '', variant: 'machine', ts: 1749001000000 },
        ],
      },
    },
  };
  localStorage.setItem('atlas.history', JSON.stringify(history));
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(500);

// open Push day → Overhead Press modal
await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) =>
    /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
  );
  day?.click();
});
await sleep(800);
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);

// Modal stats: check "Your last" line shows the dumbbell entry (default tab)
const modalLast = await page.evaluate(() => {
  const lines = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t.length < 100);
  return lines.find((t) => /your last/i.test(t));
});
console.log('Modal "Your last" line:', modalLast);

// Switch to Machine tab
await page.evaluate(() => {
  const machine = [...document.querySelectorAll('button')].find(
    (b) =>
      /machine shoulder press/i.test(b.textContent) &&
      b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  machine?.click();
});
await sleep(500);
const modalLastMachine = await page.evaluate(() => {
  const lines = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t.length < 100);
  return lines.find((t) => /your last/i.test(t));
});
console.log('Modal "Your last" after Machine switch:', modalLastMachine);

// Close modal, open Logger via "Complete set" button
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

const loggerState = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input')];
  const weight = inputs.find((i) => i.inputMode === 'decimal' && i.parentElement?.querySelector('span.text-ink-300'));
  const all = inputs.filter((i) => i.inputMode === 'decimal');
  // Find selected difficulty button
  const diff = [...document.querySelectorAll('button')]
    .find((b) => /^(easy|moderate|hard|failure)$/i.test(b.textContent.trim()) && /bg-ink-900/.test(b.className));
  // Find selected variant chip
  const variant = [...document.querySelectorAll('button')]
    .find((b) => /^(dumbbell|machine|barbell)/i.test(b.textContent.trim()) && /bg-ink-900/.test(b.className));
  // Find the "Last time" reference line
  const lastTime = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .find((t) => /last time/i.test(t) && t.length < 100);
  return {
    weight: all[0]?.value,
    reps: all[1]?.value,
    difficulty: diff?.textContent?.trim(),
    variant: variant?.textContent?.trim(),
    lastTime,
  };
});
console.log('Logger state:', JSON.stringify(loggerState, null, 2));

// Pre-fill should be the most-recent dumbbell entry (25 lb × 8 hard),
// since we haven't switched variant inside the Logger yet (default
// comes from history's most-recent variant — that's the machine entry
// at 35 lb × 8 hard since 2026-06-02 is more recent than 2026-05-31).
// Actually `defaultVariantKey` is `overrides.lastVariant?.[id]` which
// we never set, so it falls back to demoVariants[0].key === 'dumbbell'.
// So pre-fill should be dumbbell entry: 25 × 8 · Hard.
// Helper iterates each session's logs newest-first, so the LAST entry
// in the array wins — that's 25 lb × 8 hard for dumbbells and the
// single 35 × 8 hard for machine. All four signals should agree.
const ok =
  loggerState.weight === '25' &&
  loggerState.reps === '8' &&
  /hard/i.test(loggerState.difficulty || '') &&
  /dumbbell/i.test(loggerState.variant || '') &&
  /25/.test(loggerState.lastTime || '') &&
  /your last.*25 lb × 8 · Hard/i.test(modalLast || '') &&
  /your last.*35 lb × 8 · Hard/i.test(modalLastMachine || '');
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
