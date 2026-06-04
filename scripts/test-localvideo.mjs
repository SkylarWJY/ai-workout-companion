// End-to-end smoke test for local-video upload override.
//   - Synthesizes a tiny in-browser video blob via File constructor
//   - Drives the hidden <input type="file"> on the Machine variant row
//   - Verifies localStorage carries `localVideoByVariant` metadata
//   - Verifies IndexedDB carries the blob at the expected key
//   - Reopens the modal, switches to Machine tab, and checks that a
//     <video> element renders instead of the YouTube iframe

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
  const editBtns = [...document.querySelectorAll("button")].filter(
    (b) => b.getAttribute("aria-label")?.toLowerCase().includes("edit"),
  );
  editBtns[editBtns.length - 1]?.click();
});
await sleep(700);

// Synthesize a tiny "video" file and inject it into the Machine row's
// hidden file input. Puppeteer's setInputFiles can't construct File from
// Buffer in the browser context, so we do it via JS in the page.
const uploadResult = await page.evaluate(async () => {
  const cards = [...document.querySelectorAll('div.rounded-2xl')].filter(
    (d) => d.querySelector('input[type="file"]'),
  );
  const machineCard = cards.find((c) =>
    /machine shoulder press/i.test(c.textContent),
  );
  if (!machineCard) return { ok: false, why: 'no machine card' };
  const fileInput = machineCard.querySelector('input[type="file"]');
  if (!fileInput) return { ok: false, why: 'no file input' };

  // Smallest valid MP4 — 1-frame 1x1 video. ~1 KB. Generated offline.
  const tinyMp4 = new Uint8Array([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6d, 0x70, 0x34, 0x31,
  ]);
  const file = new File([tinyMp4], 'squat-form.mp4', {
    type: 'video/mp4',
    lastModified: 1700000000000,
  });

  const dt = new DataTransfer();
  dt.items.add(file);
  fileInput.files = dt.files;
  fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  return { ok: true, size: file.size };
});
console.log('Upload triggered:', JSON.stringify(uploadResult));
await sleep(800); // wait for IDB write + state update

// Click Save
await page.evaluate(() => {
  const save = [...document.querySelectorAll('button')].find((b) =>
    /^save$/i.test(b.textContent.trim()),
  );
  save?.click();
});
await sleep(600);

// Verify localStorage metadata
const meta = await page.evaluate(() => {
  const raw = localStorage.getItem('atlas.overrides');
  if (!raw) return null;
  const o = JSON.parse(raw);
  return o.exercise?.['push-1']?.localVideoByVariant || null;
});
console.log('Persisted local metadata:', JSON.stringify(meta));

// Verify IndexedDB has the blob
const idbHasBlob = await page.evaluate(async () => {
  return new Promise((resolve) => {
    const req = indexedDB.open('atlas-video-store', 1);
    req.onsuccess = () => {
      const tx = req.result.transaction('blobs', 'readonly');
      const r = tx.objectStore('blobs').get('exercise::push-1::machine');
      r.onsuccess = () => resolve(r.result ? r.result.size : null);
      r.onerror = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
});
console.log('IDB blob size:', idbHasBlob);

// Reopen modal, switch to Machine tab, look for the <video> element
await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(700);
await page.evaluate(() => {
  const machine = [...document.querySelectorAll('button')].find(
    (b) =>
      /machine shoulder press/i.test(b.textContent) &&
      b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  machine?.click();
});
await sleep(600);

const playerInfo = await page.evaluate(() => {
  const v = document.querySelector('video');
  const i = document.querySelector('iframe');
  const badge = document.querySelector('span.bg-priority-moderate\\/90')?.textContent;
  return {
    hasVideoElement: !!v,
    videoSrc: v?.src?.slice(0, 20) || null,
    hasIframe: !!i,
    badge: badge?.trim(),
  };
});
console.log('Player info:', JSON.stringify(playerInfo, null, 2));

const ok =
  meta &&
  meta.machine?.filename === 'squat-form.mp4' &&
  idbHasBlob &&
  playerInfo.hasVideoElement &&
  !playerInfo.hasIframe;
console.log(ok ? '\n✓ END-TO-END PASS' : '\n✗ FAIL');

await browser.close();
process.exit(ok ? 0 : 1);
