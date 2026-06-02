// Smoke test the variant content across Push / Pull / Leg days.
// Verifies that Best Pick tabs render and clicking them swaps the modal
// title (i.e. variant.content actually wires through).

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

async function openWorkout(label) {
  await page.goto(`${URL}?fresh=${Date.now()}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(500);
  await page.evaluate((wanted) => {
    const day = [...document.querySelectorAll('button')].find((b) =>
      new RegExp(wanted, 'i').test(b.textContent.replace(/\s+/g, '')),
    );
    day?.click();
  }, label);
  await sleep(800);
}

async function testExercise(workoutLabel, exerciseTitleRegex, expectBest) {
  await openWorkout(workoutLabel);
  await page.evaluate((rx) => {
    const h3 = [...document.querySelectorAll('h3')].find((h) => new RegExp(rx, 'i').test(h.textContent));
    h3?.closest('button')?.click();
  }, exerciseTitleRegex);
  await sleep(700);

  const data = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('button')].filter(
      (b) => b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
    ).map((b) => b.textContent.trim());
    const title = document.querySelector('h2')?.textContent.trim();
    return { tabs, title };
  });
  console.log(`\n[${workoutLabel} → ${exerciseTitleRegex}]`);
  console.log('  tabs:', JSON.stringify(data.tabs));
  console.log('  default title:', data.title);

  if (!data.tabs.some((t) => t.includes('★'))) {
    console.log(`  ✗ no Best Pick tab found`);
    return;
  }
  if (!expectBest) return;

  await page.evaluate(() => {
    const best = [...document.querySelectorAll('button')].find(
      (b) => b.textContent.includes('★') && b.closest('div.flex.items-center.gap-1.overflow-x-auto'),
    );
    best?.click();
  });
  await sleep(400);
  const after = await page.evaluate(() => document.querySelector('h2')?.textContent.trim());
  console.log('  after Best Pick:', after);
  console.log(after !== data.title ? '  ✓ SWAP' : '  ✗ NO SWAP');
}

await testExercise('MonPUSH', 'Overhead Press', 'Cable Front Raise');
await testExercise('MonPUSH', 'Tricep Pushdowns', null);
await testExercise('MonPUSH', 'Hanging Leg Raises', null);
await testExercise('WedPULL', 'Pull-Up', null);
await testExercise('WedPULL', 'Rear Delt', null);
await testExercise('WedPULL', 'Bicep Curl', null);
await testExercise('FriLEG', 'Goblet Squat', null);
await testExercise('FriLEG', 'Hip Thrust', null);

await browser.close();
console.log('\nDone.');
