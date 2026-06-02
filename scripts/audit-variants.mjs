// Audit every exercise's variant list and report which tabs collapse
// onto the same YouTube video. A tab without its own youtubeId falls
// back to the base meta — so two such tabs in the same exercise are
// effectively duplicates from the user's POV.

import { DEMO_VARIANTS } from '../src/data/demoMap.js';
import { resolveMeta } from '../src/data/exerciseMeta.js';

const issues = [];

for (const [exerciseId, variants] of Object.entries(DEMO_VARIANTS)) {
  if (!variants || variants.length <= 1) continue;
  const byVideo = new Map();
  for (const v of variants) {
    const meta = resolveMeta(exerciseId, v);
    const id = meta?.youtubeId ?? '_no_video';
    if (!byVideo.has(id)) byVideo.set(id, []);
    byVideo.get(id).push(v.label || v.key);
  }
  for (const [vid, keys] of byVideo) {
    if (keys.length > 1) {
      issues.push({ exerciseId, videoId: vid, sharedBy: keys });
    }
  }
}

if (issues.length === 0) {
  console.log('✓ Every variant within every exercise has a distinct video.');
  process.exit(0);
}

console.log(`✗ Found ${issues.length} duplicate-video group(s):\n`);
for (const { exerciseId, videoId, sharedBy } of issues) {
  console.log(`  [${exerciseId}]  video ${videoId}`);
  console.log(`     shared by: ${sharedBy.join(', ')}`);
}
process.exit(1);
