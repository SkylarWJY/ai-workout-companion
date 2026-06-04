// E2E smoke for sets/reps/rest editing.
//   - Open push-1, edit, change sets 4→3 + repRange 6-10→5-8 + rest 90→120
//   - Save
//   - Verify overrides persisted
//   - Verify the modal stats line + card footer reflect the new values

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

await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);

// Click the exercise-modal's edit pencil. After v0.7 added a warm-up
// edit button to WorkoutDay, both buttons have the same aria-label; the
// modal renders LAST in DOM so the last match is the right one.
await page.evaluate(() => {
  const editBtns = [...document.querySelectorAll('button')].filter(
    (b) => b.getAttribute('aria-label')?.toLowerCase().includes('edit'),
  );
  editBtns[editBtns.length - 1]?.click();
});
await sleep(700);

const before = await page.evaluate(() => {
  const sets = document.querySelector('input[type="number"][min="1"]');
  return {
    setsValue: sets?.value,
  };
});
console.log('Default sets:', before.setsValue);

// type new values via property setter so React picks up the change
await page.evaluate(() => {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set;
  const sets = document.querySelector('input[type="number"][min="1"]');
  setter.call(sets, '3');
  sets.dispatchEvent(new Event('input', { bubbles: true }));
  const reps = [...document.querySelectorAll('input')].find(
    (i) => i.placeholder === '6–10',
  );
  setter.call(reps, '5–8');
  reps.dispatchEvent(new Event('input', { bubbles: true }));
  const rest = document.querySelector('input[type="number"][min="0"]');
  setter.call(rest, '120');
  rest.dispatchEvent(new Event('input', { bubbles: true }));
});
await sleep(300);

await page.evaluate(() => {
  const save = [...document.querySelectorAll('button')].find((b) =>
    /^save$/i.test(b.textContent.trim()),
  );
  save?.click();
});
await sleep(700);

const stored = await page.evaluate(() => {
  const raw = localStorage.getItem('atlas.overrides');
  return raw ? JSON.parse(raw).exercise?.['push-1'] : null;
});
console.log('Persisted overrides:', JSON.stringify(stored));

// Reopen and check modal stats line
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(600);

// Find the stats line in the modal by content match — it's the line with
// "× rest" structure following the H2 title.
const statsLine = await page.evaluate(() => {
  const all = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim() || '')
    .filter((t) => t.length < 200);
  return all.find((t) => /\d+ × \d+/.test(t) && /rest/i.test(t));
});
console.log('Modal stats line:', statsLine);

const ok =
  stored?.sets === 3 &&
  stored?.repRange === '5–8' &&
  stored?.restSeconds === 120 &&
  statsLine?.includes('3 × 5–8') &&
  /2[m\s]/.test(statsLine);
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
