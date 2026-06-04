// End-to-end smoke test for per-variant video override.
//   - Open push-1 (Overhead Press) modal
//   - Tap the edit pencil
//   - Verify the editor shows 4 variant rows (Dumbbell / Machine / Barbell / ★ Best Pick locked)
//   - Type a new YouTube link in the Machine row
//   - Save
//   - Reopen modal → switch to Machine tab → verify the new video ID is used

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.TEST_URL || 'http://localhost:5173/';
const TEST_VIDEO_URL = 'https://youtube.com/shorts/9bZkp7q19f0'; // PSY Gangnam Style — works as a stable oembed target

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

// open Overhead Press
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);

// click the pencil edit button
await page.evaluate(() => {
  const editBtn = [...document.querySelectorAll('button')].find(
    (b) => b.getAttribute('aria-label')?.toLowerCase().includes('edit'),
  );
  editBtn?.click();
});
await sleep(700);

// Inspect editor rows
const rows = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('div.rounded-2xl')].filter(
    (d) => d.querySelector('input') || d.textContent.includes('Editorial'),
  );
  return cards.map((c) => {
    const label = c.querySelector('span.font-medium, span.text-priority-veryhigh')?.textContent.trim();
    const locked = /locked|editorial/i.test(c.textContent);
    const hasInput = !!c.querySelector('input');
    return { label, locked, hasInput };
  });
});
console.log('Editor rows:');
rows.forEach((r) => console.log(`  ${r.locked ? '🔒' : '✏️'}  ${r.label}${r.hasInput ? '' : ' (no input)'}`));

// Find the MACHINE row's input and type a YouTube link
const typed = await page.evaluate((url) => {
  const cards = [...document.querySelectorAll('div.rounded-2xl')].filter(
    (d) => d.querySelector('input'),
  );
  const machine = cards.find((c) =>
    /machine shoulder press/i.test(c.textContent),
  );
  if (!machine) return false;
  const input = machine.querySelector('input');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, url);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}, TEST_VIDEO_URL);
console.log(`Typed into MACHINE row: ${typed}`);
await sleep(2200); // wait for oembed verification

// Click save
await page.evaluate(() => {
  const save = [...document.querySelectorAll('button')].find((b) =>
    /^save$/i.test(b.textContent.trim()),
  );
  save?.click();
});
await sleep(800);

// Reopen the editor to confirm the override stuck
const storedOverride = await page.evaluate(() => {
  const raw = localStorage.getItem('atlas.overrides');
  if (!raw) return null;
  const o = JSON.parse(raw);
  return o.exercise?.['push-1']?.youtubeIdByVariant || null;
});
console.log('Persisted override map:', JSON.stringify(storedOverride));

// Switch to Machine tab and check the iframe URL
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const machine = btns.find(
    (b) =>
      /machine shoulder press/i.test(b.textContent) &&
      b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  machine?.click();
});
await sleep(500);
const machineThumbSrc = await page.evaluate(() => {
  return document.querySelector('img[src*="ytimg"]')?.src || null;
});
console.log('Machine tab thumb src:', machineThumbSrc);
const idInThumb = machineThumbSrc?.match(/\/vi\/([A-Za-z0-9_-]{11})/)?.[1];
console.log(idInThumb === '9bZkp7q19f0' ? '✓ Machine tab now uses the user-overridden video' : '✗ override did NOT apply');

await browser.close();
