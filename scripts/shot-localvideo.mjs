// Capture the editor sheet with a local upload active on one variant.

import puppeteer from 'puppeteer-core';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();

await page.goto(`http://localhost:5173/?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
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

await page.evaluate(() => {
  const editBtn = [...document.querySelectorAll('button')].find(
    (b) => b.getAttribute('aria-label')?.toLowerCase().includes('edit'),
  );
  editBtn?.click();
});
await sleep(700);

// Inject a fake local upload into the Machine row
await page.evaluate(async () => {
  const cards = [...document.querySelectorAll('div.rounded-2xl')].filter(
    (d) => d.querySelector('input[type="file"]'),
  );
  const machineCard = cards.find((c) =>
    /machine shoulder press/i.test(c.textContent),
  );
  const fileInput = machineCard.querySelector('input[type="file"]');
  const tinyMp4 = new Uint8Array(32);
  const file = new File([tinyMp4], 'my-squat-form-2026-06.mov', {
    type: 'video/quicktime',
    lastModified: 1700000000000,
  });
  Object.defineProperty(file, 'size', { value: 18_400_000 }); // fake 18.4 MB display
  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;
  fileInput.dispatchEvent(new Event('change', { bubbles: true }));
});
await sleep(1200);

await page.evaluate(() => {
  const heading = [...document.querySelectorAll('div')].find((d) =>
    /Tutorial videos/i.test(d.textContent.trim()),
  );
  heading?.scrollIntoView({ block: 'start' });
});
await sleep(800);

await page.screenshot({ path: 'docs/screenshots/04d-localvideo.png' });
console.log('✓ local video screenshot');
await browser.close();
