import React, { useEffect, useRef } from 'react';
import { BodyChart, INTENSITY_COLORS } from 'body-muscles';

// Modern fitness-app body map — wraps the `body-muscles` library
// (Apache 2.0, github.com/vulovix/body-muscles), which ships a
// production-grade SVG silhouette with 70+ anatomically calibrated
// muscle paths for both front + back views.
//
// Our app aggregates exercise intensity into 18 coarse region keys
// (traps, delts-front, lats, etc. — see utils/muscleMap.js); each
// region key maps to one or more body-muscles muscle IDs below. The
// library's intensity scale runs 0-10; our levels are 1-4 so we
// rescale to land cleanly inside the yellow → red gradient.

// 1-4 (our levels) → 0-10 (body-muscles intensity).
// 3 / 5 / 7 / 9 keeps the colors firmly inside the gradient and
// gives each level visible separation.
const LEVEL_TO_INTENSITY = { 1: 3, 2: 5, 3: 7, 4: 9 };

// Our region key → array of body-muscles muscle IDs. Both left/right
// sides + sub-divisions (e.g. lats upper/mid/lower) explode into the
// same intensity, since our scoring is symmetric and coarse-grained.
const FRONT_MAP = {
  // Upper traps — the library renders trap fibers on the back, but
  // the upper bundle wraps around to the front-of-neck area. Map to
  // back-view IDs so it lights up when you flip to BACK.
  traps: ['traps-upper-left', 'traps-upper-right'],

  // Shoulder front bundle (anterior delt)
  'delts-front': ['shoulder-front-left', 'shoulder-front-right'],

  // Shoulder side bundle (lateral / middle delt) — front view only
  'delts-side': ['shoulder-side-left', 'shoulder-side-right'],

  // Pec major — both clavicular (upper) and sternal (lower) heads
  pecs: [
    'chest-upper-left',
    'chest-upper-right',
    'chest-lower-left',
    'chest-lower-right',
  ],

  biceps: ['biceps-left', 'biceps-right'],

  // Front-view forearms — the library has separate flexor / extensor
  // groups on the back view; on the front it's a single forearm region.
  forearms: ['forearm-left', 'forearm-right'],

  // Six-pack — upper + lower halves of rectus abdominis
  abs: ['abs-upper-left', 'abs-upper-right', 'abs-lower-left', 'abs-lower-right'],

  obliques: ['obliques-left', 'obliques-right'],

  quads: ['quads-left', 'quads-right'],

  adductors: ['adductors-left', 'adductors-right'],

  // Front view of "calves" = shin (tibialis anterior) — the library
  // has separate gastroc + soleus paths on the back view, which is
  // anatomically correct (the bulky calf isn't visible from the front).
  calves: ['tibialis-anterior-left', 'tibialis-anterior-right'],
};

const BACK_MAP = {
  // Full trapezius — upper + middle + lower fibers
  traps: [
    'traps-upper-left',
    'traps-upper-right',
    'traps-mid-left',
    'traps-mid-right',
    'traps-lower-left',
    'traps-lower-right',
  ],

  // Posterior delt
  'delts-rear': ['deltoid-rear-left', 'deltoid-rear-right'],

  // Side delt is also visible from the back at the shoulder cap, but
  // the library only renders it in the front view. No back-view IDs —
  // the highlight will only show when the figure is on FRONT view.
  'delts-side': [],

  // Upper back — rhomboids + mid traps (which body-muscles bundles
  // into the trap-mid path) + infraspinatus area
  'upper-back': ['traps-mid-left', 'traps-mid-right'],

  // Latissimus dorsi — all three fiber heights
  lats: [
    'lats-upper-left',
    'lats-upper-right',
    'lats-mid-left',
    'lats-mid-right',
    'lats-lower-left',
    'lats-lower-right',
  ],

  // Triceps — long + lateral heads (medial is harder to see)
  triceps: [
    'triceps-long-left',
    'triceps-long-right',
    'triceps-lateral-left',
    'triceps-lateral-right',
  ],

  // Back-view forearms — flexors + extensors both light up
  forearms: [
    'forearm-extensors-left',
    'forearm-extensors-right',
    'forearm-flexors-left',
    'forearm-flexors-right',
  ],

  // Erector spinae — two thick columns next to the spine
  erectors: ['lower-back-erectors-left', 'lower-back-erectors-right'],

  // Glutes — maximus + medius for the rounded shape
  glutes: [
    'gluteus-maximus-left',
    'gluteus-maximus-right',
    'gluteus-medius-left',
    'gluteus-medius-right',
  ],

  // Hamstrings — both heads (biceps femoris + semi-tendinosus)
  hamstrings: [
    'hamstrings-lateral-left',
    'hamstrings-lateral-right',
    'hamstrings-medial-left',
    'hamstrings-medial-right',
  ],

  // Gastrocnemius (medial + lateral heads) + soleus underneath
  calves: [
    'calves-gastroc-lateral-left',
    'calves-gastroc-lateral-right',
    'calves-gastroc-medial-left',
    'calves-gastroc-medial-right',
    'calves-soleus-left',
    'calves-soleus-right',
  ],
};

// Translate our `{regionKey: level}` map into the body-muscles
// `{muscleId: {intensity, selected}}` shape expected by BodyChart.
function buildBodyState(levels, viewMap) {
  const state = {};
  for (const [regionKey, level] of Object.entries(levels)) {
    if (!level) continue;
    const intensity = LEVEL_TO_INTENSITY[level] || 0;
    const ids = viewMap[regionKey];
    if (!ids) continue;
    for (const id of ids) {
      state[id] = { intensity, selected: false };
    }
  }
  return state;
}

// React wrapper around a single BodyChart instance — manages lifecycle
// + updates when the levels map changes.
function ChartView({ view, levels, viewMap, label }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = new BodyChart(containerRef.current, {
      view,
      bodyState: buildBodyState(levels, viewMap),
      enableTransitions: true,
      ariaLabel: `${label} body view`,
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // Only build once per mount — subsequent prop changes are handled
    // by the update effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.update({
      bodyState: buildBodyState(levels, viewMap),
    });
  }, [levels, viewMap]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="block w-full body-muscles-wrapper"
        aria-hidden="true"
      />
      <div className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-ink-300">
        {label}
      </div>
    </div>
  );
}

export function IntensityLegend({ labels }) {
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-ink-300">
      {[1, 2, 3, 4].map((lvl) => (
        <div key={lvl} className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{
              backgroundColor: INTENSITY_COLORS[LEVEL_TO_INTENSITY[lvl]],
            }}
          />
          <span className="text-ink-500 dark:text-ink-100">
            {labels?.[lvl] || `L${lvl}`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BodyMap({ levels = {}, viewLabels }) {
  return (
    <div className="grid grid-cols-2 gap-3 body-map-root">
      <ChartView
        view="FRONT"
        levels={levels}
        viewMap={FRONT_MAP}
        label={viewLabels?.front || 'FRONT'}
      />
      <ChartView
        view="BACK"
        levels={levels}
        viewMap={BACK_MAP}
        label={viewLabels?.back || 'BACK'}
      />
    </div>
  );
}
