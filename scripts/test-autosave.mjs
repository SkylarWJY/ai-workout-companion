// E2E: prove that a logged set hits atlas.history immediately, even if
// the user never taps Complete Workout. Also covers the recovery path —
// any pre-existing atlas.activeSession with completed sets gets
// auto-mirrored to history on first render.

import puppeteer from 'puppeteer-core';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const URL = process.env.TEST_URL || 'http://localhost:5173/';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});

// PART A — Recovery test.
// Seed atlas.activeSession with unsaved completed sets BEFORE the React
// app reads it. Open the app — auto-save should mirror it to history
// without us tapping anything.
{
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.log('[browser error]', err.message));
  await page.goto(`${URL}?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      'atlas.activeSession',
      JSON.stringify({
        type: 'push',
        startedAt: 1748800000000, // 2026-06-02
        completedSets: {
          'push-1': [
            { weight: 25, weightUnit: 'lb', reps: 8, difficulty: 'hard', notes: '', variant: 'dumbbell', ts: 1748801000000 },
          ],
        },
      }),
    );
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(800); // give the auto-save effect time to fire

  const recovered = await page.evaluate(() => {
    const raw = localStorage.getItem('atlas.history');
    if (!raw) return null;
    const h = JSON.parse(raw);
    // Look for any -push entry containing our one logged set (date key
    // is derived from startedAt, which is 1748800000000 → 2025-06-02).
    for (const [key, entry] of Object.entries(h)) {
      if (!key.endsWith('-push')) continue;
      const w = entry?.completedSets?.['push-1']?.[0]?.weight;
      if (w != null) return { key, weight: w };
    }
    return { keys: Object.keys(h) };
  });
  console.log('Recovered:', JSON.stringify(recovered));
  await page.close();
  if (recovered?.weight !== 25) {
    console.log('✗ PART A FAIL');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PART A: recovery works');
}

// PART B — Auto-save during a fresh session.
// Start a new Push day, log one set, EXIT WITHOUT clicking Complete,
// and confirm the set is already in history.
{
  const page = await browser.newPage();
  page.on('pageerror', (err) => console.log('[browser error]', err.message));
  await page.goto(`${URL}?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(500);

  await page.evaluate(() => {
    const day = [...document.querySelectorAll('button')].find((b) =>
      /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
    );
    day?.click();
  });
  await sleep(800);

  // Tap "Complete set" on the Up Next focus card
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.trim().toUpperCase() === 'COMPLETE SET',
    );
    btn?.click();
  });
  await sleep(600);

  // Enter weight 32, reps 9, click Complete in the logger
  await page.evaluate(() => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set;
    const inputs = [...document.querySelectorAll('input[inputmode="decimal"]')];
    setter.call(inputs[0], '32');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(inputs[1], '9');
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  });
  await sleep(200);
  await page.evaluate(() => {
    // bottom-right "Complete set" in the logger sheet
    const btns = [...document.querySelectorAll('button')];
    const completeBtn = btns
      .reverse()
      .find((b) => /complete\s*set/i.test(b.textContent.trim()));
    completeBtn?.click();
  });
  await sleep(600);

  // Tap BACK — explicitly do NOT go through the Complete Workout flow
  await page.evaluate(() => {
    const back = [...document.querySelectorAll('button')].find((b) =>
      /^back$/i.test(b.textContent.trim()),
    );
    back?.click();
  });
  await sleep(500);

  // Check that history already has the set, without us ever tapping
  // "Complete Workout"
  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem('atlas.history');
    if (!raw) return null;
    const h = JSON.parse(raw);
    const todays = Object.entries(h).find(([k]) => k.endsWith('-push'));
    if (!todays) return null;
    const [key, entry] = todays;
    const set = entry?.completedSets?.['push-1']?.[0];
    return {
      key,
      weight: set?.weight,
      hasCompletedAt: !!entry?.completedAt,
    };
  });
  console.log('Auto-saved entry:', JSON.stringify(stored));

  if (
    stored?.weight !== 32 ||
    !stored?.hasCompletedAt
  ) {
    console.log('✗ PART B FAIL');
    await page.close();
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PART B: a logged set lands in history WITHOUT clicking Complete');
  await page.close();
}

await browser.close();
console.log('\n✓ END-TO-END PASS — data loss bug fixed, prior sessions recovered');
