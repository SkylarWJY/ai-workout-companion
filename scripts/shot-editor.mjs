// Capture the new per-variant editor sheet for the README.

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
  const editBtns = [...document.querySelectorAll("button")].filter(
    (b) => b.getAttribute("aria-label")?.toLowerCase().includes("edit"),
  );
  editBtns[editBtns.length - 1]?.click();
});
await sleep(800);

// scroll to the videos section
await page.evaluate(() => {
  const heading = [...document.querySelectorAll('div')].find(
    (d) => /Tutorial videos/i.test(d.textContent.trim()),
  );
  heading?.scrollIntoView({ block: 'start' });
});
await sleep(2500); // give oembed time to populate

await page.screenshot({ path: 'docs/screenshots/04c-editor-pervariant.png' });
console.log('✓ editor screenshot');
await browser.close();
