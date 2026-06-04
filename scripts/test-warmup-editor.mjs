// E2E smoke for the warm-up video editor.
//   1. Open Push day → tap the warm-up tile's edit pencil → editor opens
//   2. Paste a YouTube link → ✓ oembed verification appears
//   3. Save → assert overrides.warmup.push.youtubeId persisted
//   4. The warm-up tile now shows an iframe (not <video>) with our ID

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.TEST_URL || 'http://localhost:5173/';
const TEST_LINK = 'https://youtube.com/shorts/9bZkp7q19f0';

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

await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) =>
    /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
  );
  day?.click();
});
await sleep(800);

// scroll to warm-up section
await page.evaluate(() => {
  const wuHeading = [...document.querySelectorAll('span')].find((s) =>
    /warm/i.test(s.textContent.trim()),
  );
  wuHeading?.scrollIntoView({ block: 'start' });
});
await sleep(400);

// Click the edit pencil on the warm-up section header
const editClicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(
    (b) =>
      b.getAttribute('aria-label')?.toLowerCase().includes('edit') &&
      // the warm-up edit button is the one not inside a modal/exercise
      !b.closest('h2'),
  );
  if (!btn) return false;
  btn.click();
  return true;
});
console.log('Edit clicked:', editClicked);
await sleep(700);

// Verify the editor opened with the warm-up title
const editorTitle = await page.evaluate(() => {
  const titles = [...document.querySelectorAll('div')]
    .map((d) => d.textContent?.trim())
    .filter((t) => t && /warm-up/i.test(t) && t.length < 50);
  return titles[0];
});
console.log('Editor title visible:', editorTitle);

// Type a YouTube link
await page.evaluate((url) => {
  const inputs = [...document.querySelectorAll('input')];
  const yt = inputs.find((i) => i.placeholder?.includes('youtube.com'));
  if (!yt) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(yt, url);
  yt.dispatchEvent(new Event('input', { bubbles: true }));
}, TEST_LINK);
await sleep(2200); // give oembed time

// Click Save
await page.evaluate(() => {
  const save = [...document.querySelectorAll('button')].find((b) =>
    /^save$/i.test(b.textContent.trim()),
  );
  save?.click();
});
await sleep(800);

// Verify persistence
const ov = await page.evaluate(() => {
  const raw = localStorage.getItem('atlas.overrides');
  return raw ? JSON.parse(raw).warmup?.push : null;
});
console.log('Persisted warmup.push override:', JSON.stringify(ov));

// Verify the tile now renders an iframe with our ID
const tileInfo = await page.evaluate(() => {
  const iframe = document.querySelector('iframe[src*="youtube.com/embed"]');
  const video = document.querySelector('section video');
  return {
    iframeSrc: iframe?.src || null,
    hasVideoElement: !!video,
  };
});
console.log('Tile info:', JSON.stringify(tileInfo, null, 2));

const ok =
  ov?.youtubeId === '9bZkp7q19f0' &&
  tileInfo.iframeSrc?.includes('9bZkp7q19f0');
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
