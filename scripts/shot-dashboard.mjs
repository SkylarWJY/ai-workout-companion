// Visual snapshot of the dashboard on a Thursday rest day with
// the user's actual exported history loaded — should mirror what
// they see on their phone.
import puppeteer from 'puppeteer-core';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  defaultViewport: { width: 390, height: 1100, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();

// Pin Thursday rest day + Chinese locale
await page.evaluateOnNewDocument(() => {
  const RealDate = Date;
  const fixed = new RealDate('2026-06-18T13:00:00').getTime();
  const offset = fixed - RealDate.now();
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + offset);
      else super(...args);
    }
    static now() { return RealDate.now() + offset; }
  };
  globalThis.Date.UTC = RealDate.UTC;
  globalThis.Date.parse = RealDate.parse;
});

await page.goto('http://localhost:5173/?fresh=' + Date.now(), { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem('atlas.weightUnit', JSON.stringify('kg'));
  localStorage.setItem('atlas.lang', JSON.stringify('zh'));
  localStorage.setItem(
    'atlas.history',
    JSON.stringify({
      '2026-06-14-push': {
        type: 'push',
        startedAt: 1781488175634,
        completedAt: 1781492467407,
        completedSets: {
          'push-1': [{ weight: 15, weightUnit: 'kg', reps: 10, difficulty: 'hard', variant: 'machine', ts: 1 }],
          'push-2': [{ weight: 4.5, weightUnit: 'kg', reps: 12, difficulty: 'moderate', variant: 'machine', ts: 2 }],
        },
      },
    }),
  );
  localStorage.setItem('atlas.overrides', JSON.stringify({ lastVariant: { 'push-1': 'machine' } }));
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(1000);

await page.screenshot({ path: 'docs/screenshots/diag-dashboard-zh-rest.png', fullPage: false });
console.log('✓ shot');
await browser.close();
