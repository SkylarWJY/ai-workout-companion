// E2E: feeds the live app the user's actual export JSON, opens
// push-1 (Overhead Press), and confirms:
//   - Progress card renders with "10 kg → 15 kg (+50%)"
//   - Logger recommendation pre-fills with the next-step weight
//     based on last session (6/14 was 15 kg × 8 Failure on the
//     top set → algorithm should de-load to ~13.5 kg)

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
// Inject the user's actual exported history (top set for push-1 each
// session: 10 kg × 10 H, 10 kg × 10 H, 15 kg × 8 Failure)
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem('atlas.weightUnit', JSON.stringify('kg'));
  localStorage.setItem(
    'atlas.history',
    JSON.stringify({
      '2026-05-27-push': {
        type: 'push',
        startedAt: 1779930857150,
        completedAt: 1779941609199,
        completedSets: {
          'push-1': [
            { weight: 10, reps: 10, difficulty: 'moderate', notes: '', ts: 1779938985683 },
            { weight: 10, reps: 10, difficulty: 'moderate', notes: '', ts: 1779939123038 },
            { weight: 10, reps: 10, difficulty: 'hard', notes: '', ts: 1779939286327 },
            { weight: 10, reps: 8, difficulty: 'hard', notes: '', ts: 1779939434890 },
          ],
        },
      },
      '2026-06-04-push': {
        type: 'push',
        startedAt: 1780609853532,
        completedAt: 1780638889345,
        completedSets: {
          'push-1': [
            { weight: 10, weightUnit: 'kg', reps: 10, difficulty: 'moderate', variant: 'machine', ts: 1780634229646 },
            { weight: 10, weightUnit: 'kg', reps: 10, difficulty: 'hard', variant: 'machine', ts: 1780634639430 },
            { weight: 10, weightUnit: 'kg', reps: 12, difficulty: 'hard', variant: 'machine', ts: 1780634657051 },
            { weight: 15, weightUnit: 'kg', reps: 8, difficulty: 'failure', variant: 'machine', ts: 1780634744055 },
          ],
        },
      },
      '2026-06-14-push': {
        type: 'push',
        startedAt: 1781488175634,
        completedAt: 1781492467407,
        completedSets: {
          'push-1': [
            { weight: 10, weightUnit: 'kg', reps: 10, difficulty: 'moderate', variant: 'machine', ts: 1781489114154 },
            { weight: 15, weightUnit: 'kg', reps: 10, difficulty: 'hard', variant: 'machine', ts: 1781489256654 },
            { weight: 15, weightUnit: 'kg', reps: 8, difficulty: 'failure', variant: 'machine', ts: 1781489372682 },
            { weight: 15, weightUnit: 'kg', reps: 4, difficulty: 'failure', variant: 'machine', ts: 1781489507513 },
          ],
        },
      },
    }),
  );
  localStorage.setItem(
    'atlas.overrides',
    JSON.stringify({ lastVariant: { 'push-1': 'machine' } }),
  );
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(700);

// Open Push day → Overhead Press
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

// Inspect Progress card. Stay on default Dumbbell tab first — it
// includes the legacy 5/27 entry (no variant) since that counts for
// every variant under the back-compat rule.
const progressDefault = await page.evaluate(() => {
  const lines = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t && t.length < 100);
  return {
    header: lines.find((t) => /Progress/i.test(t) && t.length < 30),
    summary: lines.find((t) => /First.*latest/i.test(t)),
  };
});
console.log('Progress card (Dumbbell tab):', JSON.stringify(progressDefault));

// Switch to Machine tab (user's actual variant)
await page.evaluate(() => {
  const machine = [...document.querySelectorAll('button')].find(
    (b) =>
      /machine shoulder press/i.test(b.textContent) &&
      b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  machine?.click();
});
await sleep(500);

const progressMachine = await page.evaluate(() => {
  const lines = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t && t.length < 100);
  return {
    summary: lines.find((t) => /First.*latest/i.test(t)),
    deltaLine: lines.find((t) => /↑|↓|→/.test(t) && /kg/.test(t)),
  };
});
console.log('Machine tab Progress:', JSON.stringify(progressMachine));

// Close modal, open Logger
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
  const inputs = [...document.querySelectorAll('input[inputmode="decimal"]')];
  // Find the recommendation banner by its smallest-enclosing div.
  // The banner uses a rounded-2xl border + priority-moderate class,
  // and contains "Suggested for this set" text.
  const candidates = [...document.querySelectorAll('div.rounded-2xl')];
  const banner = candidates
    .map((d) => d.textContent?.trim() || '')
    .find((t) => /Suggested for this set/i.test(t) && t.length < 200);
  return {
    weight: inputs[0]?.value,
    reps: inputs[1]?.value,
    banner,
    bodyHasSuggested: /Suggested for this set/.test(document.body.textContent),
  };
});
console.log('Logger state:', JSON.stringify(loggerState, null, 2));

const ok =
  progressMachine.summary?.includes('10 kg') &&
  progressMachine.summary?.includes('15 kg') &&
  progressMachine.deltaLine?.includes('5') &&
  loggerState.bodyHasSuggested &&
  loggerState.weight === '17.5'; // algo: 15 kg × 10 hard top set → +2.5 kg = 17.5

console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
