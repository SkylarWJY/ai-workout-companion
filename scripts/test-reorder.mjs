// Verify the reorder fix end-to-end against a local dev build.
// Tests BOTH the desktop mouse path (which already worked) AND the
// mobile-touch path (which was broken before this fix).

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.TEST_URL || 'http://localhost:5173/';

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
  page.on('pageerror', (err) => console.log(`  [browser error]`, err.message));

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
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.trim().toLowerCase() === 'reorder',
    );
    btn?.click();
  });
  await sleep(400);

  await page.evaluate(() => {
    document.querySelector('ul > li')?.scrollIntoView({ block: 'center' });
  });
  await sleep(300);

  // Find handles (the drag affordance) on items 0 and 1
  const handles = await page.evaluate(() => {
    const lis = [...document.querySelectorAll('ul > li')];
    return lis.slice(0, 3).map((li, i) => {
      // first child is the drag handle (per ReorderRow's render)
      const handle = li.firstElementChild;
      const r = handle.getBoundingClientRect();
      const liRect = li.getBoundingClientRect();
      return {
        i,
        text: li.textContent.replace(/\s+/g, ' ').slice(0, 40),
        handleX: r.x + r.width / 2,
        handleY: r.y + r.height / 2,
        liY: liRect.y + liRect.height / 2,
        liH: liRect.height,
      };
    });
  });
  console.log(`  Items found: ${handles.length}, first handle at (${handles[0]?.handleX}, ${handles[0]?.handleY})`);

  const before = handles.map((h) => h.text);

  const src = handles[1];
  const dst = handles[0];
  const targetY = dst.liY - dst.liH * 0.6;

  if (mobile) {
    // Use CDP to dispatch a real touch sequence
    const client = await page.target().createCDPSession();
    async function touch(type, x, y) {
      await client.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: type === 'touchEnd' ? [] : [{ x, y }],
      });
    }
    await touch('touchStart', src.handleX, src.handleY);
    await sleep(150);
    const steps = 25;
    for (let s = 1; s <= steps; s++) {
      const y = src.handleY + (targetY - src.handleY) * (s / steps);
      await touch('touchMove', src.handleX, y);
      await sleep(15);
    }
    await sleep(150);
    await touch('touchEnd', src.handleX, targetY);
  } else {
    const client = await page.target().createCDPSession();
    async function mouse(type, x, y) {
      await client.send('Input.dispatchMouseEvent', {
        type, x, y,
        button: 'left',
        buttons: type === 'mouseReleased' ? 0 : 1,
        clickCount: type === 'mousePressed' ? 1 : 0,
        pointerType: 'mouse',
      });
    }
    await mouse('mousePressed', src.handleX, src.handleY);
    await sleep(120);
    const steps = 25;
    for (let s = 1; s <= steps; s++) {
      const y = src.handleY + (targetY - src.handleY) * (s / steps);
      await mouse('mouseMoved', src.handleX, y);
      await sleep(15);
    }
    await sleep(200);
    await mouse('mouseReleased', src.handleX, targetY);
  }
  await sleep(400);

  const after = await page.evaluate(() =>
    [...document.querySelectorAll('ul > li')].map((li) =>
      li.textContent.replace(/\s+/g, ' ').slice(0, 40),
    ),
  );

  const swapped = before[0] !== after[0];
  console.log(`  BEFORE: ${before[0]}`);
  console.log(`  AFTER:  ${after[0]}`);
  console.log(`  ${swapped ? '✓ SWAP' : '✗ NO SWAP'}`);

  await page.screenshot({ path: `docs/screenshots/diag-reorder-${mobile ? 'mobile' : 'desktop'}.png` });
  await browser.close();
  return swapped;
}

console.log('--- Desktop mouse ---');
const desktopOk = await runOnce({ mobile: false });
console.log('--- Mobile touch ---');
const mobileOk = await runOnce({ mobile: true });

console.log(`\nResult: desktop=${desktopOk ? '✓' : '✗'} mobile=${mobileOk ? '✓' : '✗'}`);
process.exit(desktopOk && mobileOk ? 0 : 1);
