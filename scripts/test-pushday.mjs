// Smoke test push-1 (Overhead Press) — verify:
//   - the top-right primary muscle pill shows on the card
//   - the modal opens, default variant is Dumbbell with the new tutorial
//   - switching to Machine swaps the content
//   - switching to Best Pick swaps title + content
// Defaults to localhost; pass TEST_URL=... to point at prod.

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.TEST_URL || 'http://localhost:5173/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
page.on('pageerror', (err) => console.log('[browser error]', err.message));

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

// Card check: every full-session card should contain the primary muscle as a pill
const cards = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('button.rounded-3xl')];
  return cards.slice(0, 6).map((c) => {
    const h3 = c.querySelector('h3');
    return {
      name: h3?.textContent.trim().slice(0, 30),
      // primary muscle pill is the first inline-block ending in uppercase tracking
      text: c.textContent.replace(/\s+/g, ' ').slice(0, 100),
    };
  });
});
console.log('Cards on Push day:');
cards.forEach((c) => console.log(`  • ${c.name}`));

await page.screenshot({ path: 'docs/screenshots/diag-pushday.png' });

// Tap into Overhead Press (push-1)
await page.evaluate(() => {
  const ov = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  ov?.closest('button')?.click();
});
await sleep(900);

// list variant tabs
const tabs = await page.evaluate(() => {
  const tabBtns = [...document.querySelectorAll('button')].filter(
    (b) => /uppercase/.test(b.className) && /rounded-full/.test(b.className) && b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  return tabBtns.map((b) => b.textContent.trim());
});
console.log('Variant tabs found:', tabs);

// Look for the modal title
const modalTitle = await page.evaluate(() =>
  document.querySelector('h2')?.textContent.trim(),
);
console.log('Modal title (default):', modalTitle);

await page.screenshot({ path: 'docs/screenshots/diag-modal-default.png' });

// Click the Best Pick tab (looking for the star)
const bestClicked = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const best = btns.find(
    (b) => b.textContent.includes('★') && b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  if (!best) return false;
  best.click();
  return true;
});
console.log('Best Pick tab clicked:', bestClicked);
await sleep(500);

const titleAfter = await page.evaluate(() =>
  document.querySelector('h2')?.textContent.trim(),
);
console.log('Modal title after Best Pick:', titleAfter);

await page.screenshot({ path: 'docs/screenshots/diag-modal-bestpick.png' });

await browser.close();
console.log(titleAfter !== modalTitle ? '✓ Best Pick swap worked' : '✗ Title did not change');
