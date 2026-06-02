// One-shot — capture a Best Pick view for the README walkthrough.

import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:5173';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
});

const page = await browser.newPage();
await page.setUserAgent(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
);

await page.goto(`${URL}/?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
await sleep(600);

// Push day → Overhead Press → Best Pick (Cable Front Raise)
await page.evaluate(() => {
  const day = [...document.querySelectorAll('button')].find((b) =>
    /MonPUSH/i.test(b.textContent.replace(/\s+/g, '')),
  );
  day?.click();
});
await sleep(900);

await page.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) =>
    /Overhead Press/i.test(h.textContent),
  );
  h3?.closest('button')?.click();
});
await sleep(1100);

// click ★ Best Pick tab
await page.evaluate(() => {
  const best = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.includes('★') && b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
  );
  best?.click();
});
await sleep(700);

await page.screenshot({
  path: 'docs/screenshots/04b-bestpick.png',
  type: 'png',
});
console.log('✓ 04b-bestpick');

await browser.close();
