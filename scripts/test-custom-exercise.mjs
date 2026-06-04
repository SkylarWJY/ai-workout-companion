// E2E: add a custom exercise to Push day, verify it appears as a card
// and persists to localStorage with the correct shape.

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

// Scroll to the bottom of the Full Session list and find the + Add button
await page.evaluate(() => {
  window.scrollTo(0, 99999);
});
await sleep(400);

const addClicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(
    (b) => /\+\s*add\s*exercise/i.test(b.textContent.trim()),
  );
  if (!btn) return false;
  btn.click();
  return true;
});
console.log('+ Add Exercise clicked:', addClicked);
await sleep(700);

// Fill in the form
await page.evaluate(() => {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set;
  const inputs = [...document.querySelectorAll('input')];
  // Name is the first text input that doesn't have a placeholder of "8-12"
  // or a type of number — find by placeholder match
  const nameInput = inputs.find((i) =>
    /Cable Tricep|绳索三头/.test(i.placeholder),
  );
  setter.call(nameInput, 'Cable Tricep Pushdown');
  nameInput.dispatchEvent(new Event('input', { bubbles: true }));

  // Pick a primary muscle (Triceps)
  const muscleBtn = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Triceps',
  );
  muscleBtn?.click();
});
await sleep(300);

// Click the rightmost button in the editor's sticky header — that's
// always "Add exercise" / "Save". Use the red text class as the marker.
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button.text-priority-extreme')];
  // last one is the "Add" in the custom editor's sticky header
  btns[btns.length - 1]?.click();
});
await sleep(700);

// Verify persistence
const stored = await page.evaluate(() => {
  const raw = localStorage.getItem('atlas.overrides');
  if (!raw) return null;
  const o = JSON.parse(raw);
  const list = o.customExercises ? Object.values(o.customExercises) : [];
  return list[0];
});
console.log('Persisted custom:', JSON.stringify(stored, null, 2));

// Verify it shows up in the day's list (scroll back up)
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(300);

const card = await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Cable Tricep Pushdown/i.test(h.textContent),
  );
  if (!h3) return null;
  const card = h3.closest('button');
  return {
    name: h3.textContent.trim(),
    text: card?.textContent.slice(0, 100),
  };
});
console.log('Custom card on day:', JSON.stringify(card));

const ok =
  stored?.name === 'Cable Tricep Pushdown' &&
  stored?.primaryMuscles?.[0] === 'Triceps' &&
  stored?.workoutId === 'push' &&
  card?.name === 'Cable Tricep Pushdown';
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
