// Smoke test: enter Reorder mode → tap the "move up" button on row 2 →
// verify row 2 is now row 1. Run via:
//
//   TEST_URL=http://localhost:5173 node scripts/test-reorder.mjs
//
// Defaults to the live production URL if TEST_URL is not set.

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.TEST_URL || 'https://ai-workout-companion.vercel.app/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runOnce({ mobile }) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: mobile
      ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { width: 480, height: 900, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  if (mobile) {
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    );
  }
  page.on('pageerror', (err) => console.log('  [browser error]', err.message));

  await page.goto(`${URL}?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(500);

  // open Push day
  await page.evaluate(() => {
    const day = [...document.querySelectorAll('button')].find((b) =>
      /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
    );
    day?.click();
  });
  await sleep(800);

  // tap Reorder
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.trim().toLowerCase() === 'reorder',
    );
    btn?.click();
  });
  await sleep(400);

  // grab the order of rows before
  const before = await page.evaluate(() => {
    const rows = document.querySelectorAll('[aria-label="Move up"]');
    return [...rows].map((upBtn) =>
      upBtn
        .closest('div.rounded-2xl')
        .textContent.replace(/\s+/g, ' ')
        .slice(0, 40),
    );
  });
  console.log('  BEFORE:', JSON.stringify(before.slice(0, 3)));

  // tap "Move up" on row 2 (index 1)
  const tapped = await page.evaluate(() => {
    const upBtns = [...document.querySelectorAll('[aria-label="Move up"]')];
    const row2Up = upBtns[1];
    if (!row2Up) return { ok: false };
    row2Up.click();
    return { ok: true };
  });
  console.log('  Tapped row-2 up:', tapped.ok);
  await sleep(400);

  const after = await page.evaluate(() => {
    const rows = document.querySelectorAll('[aria-label="Move up"]');
    return [...rows].map((upBtn) =>
      upBtn
        .closest('div.rounded-2xl')
        .textContent.replace(/\s+/g, ' ')
        .slice(0, 40),
    );
  });
  console.log('  AFTER: ', JSON.stringify(after.slice(0, 3)));

  const swapped = before[0] !== after[0] && before[1] === after[0];
  console.log(`  ${swapped ? '✓ SWAP' : '✗ NO SWAP'}`);

  await page.screenshot({
    path: `docs/screenshots/diag-reorder-${mobile ? 'mobile' : 'desktop'}.png`,
  });
  await browser.close();
  return swapped;
}

console.log('--- Desktop ---');
const desktopOk = await runOnce({ mobile: false });
console.log('--- Mobile (touch) ---');
const mobileOk = await runOnce({ mobile: true });

console.log(`\nResult: desktop=${desktopOk ? '✓' : '✗'}  mobile=${mobileOk ? '✓' : '✗'}`);
process.exit(desktopOk && mobileOk ? 0 : 1);
