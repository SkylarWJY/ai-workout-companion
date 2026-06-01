import React from 'react';
import { motion } from 'framer-motion';

// Real anatomical body map using Julien Bouglé's 1899 plates as the base.
// Each muscle shape below was calibrated against the actual pixel
// silhouette of /public/anatomy/{front,back}.png (202×600 / 199×600).
//
// Verified anatomical landmarks (image y-coordinate, both views):
//   head crown ............  0
//   chin / neck ........... 90
//   clavicle .............. 115
//   nipple line ........... 160
//   sternum bottom ........ 195
//   navel ................. 245
//   pubic crest ........... 305
//   hip widest ............ 320
//   legs separate ......... 360
//   patella (knee) ........ 470
//   ankle ................. 580

const FRONT_IMG = '/anatomy/front.png';
const BACK_IMG = '/anatomy/back.png';

const LEVEL_FILL = {
  1: '#FBBF24',
  2: '#F97316',
  3: '#EF4444',
  4: '#B91C1C',
};
const LEVEL_STROKE = {
  1: '#92400E',
  2: '#9A3412',
  3: '#7F1D1D',
  4: '#450A0A',
};
const LEVEL_OPACITY = {
  1: 0.6,
  2: 0.72,
  3: 0.82,
  4: 0.9,
};

const FRONT_REGIONS = {
  // Upper trapezius — narrow band visible between neck (x=82-118) and clavicles
  traps: [
    { d: 'M82 100 Q100 96 118 100 L114 116 Q100 114 86 116 Z' },
  ],

  // Anterior deltoid — front cap of shoulder, at the inner-upper corner of arms
  'delts-front': [
    {
      d:
        'M55 118 Q66 114 76 120 Q82 130 80 144 ' +
        'L 74 156 Q 58 156 50 144 Q 48 130 55 118 Z',
    },
    {
      d:
        'M145 118 Q134 114 124 120 Q118 130 120 144 ' +
        'L 126 156 Q 142 156 150 144 Q 152 130 145 118 Z',
    },
  ],

  // Lateral / middle deltoid — outermost top of shoulder, "cap" shape
  'delts-side': [
    {
      d: 'M24 122 Q34 114 50 124 Q56 138 54 152 Q44 158 30 152 Q18 138 24 122 Z',
    },
    {
      d: 'M176 122 Q166 114 150 124 Q144 138 146 152 Q156 158 170 152 Q182 138 176 122 Z',
    },
  ],

  // Pectoralis major — fan sweeping from sternum/clavicle to upper arm
  // Calibrated to nipple line at y=160, lower border at y=200 (sternum end)
  pecs: [
    {
      d:
        'M72 128 Q86 124 98 126 ' +
        'L 100 200 ' +
        'Q 86 202 74 194 ' +
        'Q 60 174 60 156 ' +
        'Q 62 140 72 128 Z',
    },
    {
      d:
        'M128 128 Q114 124 102 126 ' +
        'L 100 200 ' +
        'Q 114 202 126 194 ' +
        'Q 140 174 140 156 ' +
        'Q 138 140 128 128 Z',
    },
  ],

  // Biceps brachii — vertical bulge on front of upper arm, between delt & elbow
  biceps: [
    {
      d:
        'M30 156 Q42 152 52 162 L 54 214 ' +
        'Q 42 220 32 214 Q 26 192 28 168 Q 28 158 30 156 Z',
    },
    {
      d:
        'M170 156 Q158 152 148 162 L 146 214 ' +
        'Q 158 220 168 214 Q 174 192 172 168 Q 172 158 170 156 Z',
    },
  ],

  // Forearms — taper from elbow to wrist (wrist at y ~300)
  forearms: [
    {
      d:
        'M22 220 Q38 216 46 226 L 50 298 ' +
        'Q 36 306 20 300 Q 16 260 22 220 Z',
    },
    {
      d:
        'M178 220 Q162 216 154 226 L 150 298 ' +
        'Q 164 306 180 300 Q 184 260 178 220 Z',
    },
  ],

  // Rectus abdominis — six-pack block from sternum (y=200) down to navel/pubis area
  // Stops at y=288 (just above the pubic crest at 295) to avoid overflowing
  abs: [
    {
      d:
        'M84 202 Q92 198 100 200 Q108 198 116 202 ' +
        'L 116 286 Q 108 292 100 292 Q 92 292 84 286 Z',
    },
  ],

  // External obliques + iliopsoas peek — flanks of torso between ribs and hip
  obliques: [
    {
      d:
        'M62 204 Q72 224 78 256 L 82 290 ' +
        'Q 70 290 60 274 Q 54 240 62 204 Z',
    },
    {
      d:
        'M138 204 Q128 224 122 256 L 118 290 ' +
        'Q 130 290 140 274 Q 146 240 138 204 Z',
    },
  ],

  // Quadriceps — broad block from hip (y=320) to knee (y=465)
  quads: [
    {
      d:
        'M55 326 Q72 320 92 326 ' +
        'L 96 460 Q 78 466 58 458 ' +
        'Q 48 392 55 326 Z',
    },
    {
      d:
        'M108 326 Q128 320 145 326 ' +
        'Q 152 392 142 458 ' +
        'L 104 460 Z',
    },
  ],

  // Adductors — narrow inner thigh strip
  adductors: [
    { d: 'M84 332 L98 332 L96 442 L84 442 Z' },
    { d: 'M102 332 L116 332 L116 442 L104 442 Z' },
  ],

  // Tibialis anterior — shin muscle on front of lower leg (knee y=470, ankle y=580)
  calves: [
    {
      d:
        'M58 482 Q72 476 88 484 ' +
        'L 86 564 Q 72 572 58 564 ' +
        'Q 52 524 58 482 Z',
    },
    {
      d:
        'M112 484 Q128 476 142 482 ' +
        'Q 148 524 142 564 ' +
        'L 114 564 Z',
    },
  ],
};

const BACK_REGIONS = {
  // Trapezius — large kite from base of skull spreading to shoulders + down to mid-back
  traps: [
    {
      d:
        'M82 98 Q100 92 118 98 ' +
        'L 138 122 L 146 144 ' +
        'Q 100 156 54 144 ' +
        'L 62 122 Z',
    },
    {
      d:
        'M88 156 Q100 160 112 156 ' +
        'L 108 206 Q 100 210 92 206 Z',
    },
  ],

  // Posterior deltoid — back of shoulder cap
  'delts-rear': [
    {
      d:
        'M40 122 Q56 116 72 124 ' +
        'Q 76 156 60 162 ' +
        'Q 42 158 36 142 Q 36 128 40 122 Z',
    },
    {
      d:
        'M160 122 Q144 116 128 124 ' +
        'Q 124 156 140 162 ' +
        'Q 158 158 164 142 Q 164 128 160 122 Z',
    },
  ],

  // Lateral deltoid (also visible from back, edge of shoulder)
  'delts-side': [
    { d: 'M26 128 Q40 122 50 134 L 50 160 Q 38 164 24 154 Q 20 142 26 128 Z' },
    { d: 'M174 128 Q160 122 150 134 L 150 160 Q 162 164 176 154 Q 180 142 174 128 Z' },
  ],

  // Upper back (rhomboids + infraspinatus) — between scapulae
  'upper-back': [
    {
      d:
        'M72 144 Q88 152 96 156 ' +
        'L 96 206 Q 84 206 72 196 ' +
        'Q 66 174 72 144 Z',
    },
    {
      d:
        'M128 144 Q112 152 104 156 ' +
        'L 104 206 Q 116 206 128 196 ' +
        'Q 134 174 128 144 Z',
    },
  ],

  // Latissimus dorsi — V wing tapering from mid-back to waist
  lats: [
    {
      d:
        'M48 196 Q70 200 92 214 ' +
        'L 96 296 Q 76 300 56 294 ' +
        'Q 42 250 48 196 Z',
    },
    {
      d:
        'M152 196 Q130 200 108 214 ' +
        'L 104 296 Q 124 300 144 294 ' +
        'Q 158 250 152 196 Z',
    },
  ],

  // Triceps brachii — horseshoe on back of upper arm
  triceps: [
    {
      d:
        'M30 150 Q44 146 56 160 ' +
        'L 60 222 Q 46 230 32 222 ' +
        'Q 24 188 28 162 Q 28 152 30 150 Z',
    },
    {
      d:
        'M170 150 Q156 146 144 160 ' +
        'L 140 222 Q 154 230 168 222 ' +
        'Q 176 188 172 162 Q 172 152 170 150 Z',
    },
  ],

  // Forearms (back of lower arm)
  forearms: [
    {
      d:
        'M20 226 Q36 222 46 232 L 48 300 ' +
        'Q 34 308 18 302 Q 14 262 20 226 Z',
    },
    {
      d:
        'M180 226 Q164 222 154 232 L 152 300 ' +
        'Q 166 308 182 302 Q 186 262 180 226 Z',
    },
  ],

  // Erector spinae — two thick vertical columns next to the spine
  erectors: [
    { d: 'M85 218 Q94 216 98 220 L 98 302 Q 90 304 84 302 Z' },
    { d: 'M102 220 Q106 216 115 218 L 116 302 Q 110 304 102 302 Z' },
  ],

  // Gluteus maximus — buttocks (sit between y=305 and y=388)
  glutes: [
    {
      d:
        'M52 312 Q74 304 100 308 ' +
        'L 100 386 Q 78 394 60 386 ' +
        'Q 42 350 52 312 Z',
    },
    {
      d:
        'M148 312 Q126 304 100 308 ' +
        'L 100 386 Q 122 394 140 386 ' +
        'Q 158 350 148 312 Z',
    },
  ],

  // Hamstrings — back of thigh (gluteal fold y=388 → knee y=478)
  hamstrings: [
    {
      d:
        'M54 396 Q76 390 96 396 ' +
        'L 98 482 Q 78 488 60 482 ' +
        'Q 50 440 54 396 Z',
    },
    {
      d:
        'M104 396 Q124 390 146 396 ' +
        'Q 150 440 140 482 ' +
        'L 102 482 Z',
    },
  ],

  // Gastrocnemius — bulky calf muscle (knee y=478 → ankle y=580)
  calves: [
    {
      d:
        'M56 500 Q74 494 92 502 ' +
        'L 90 572 Q 76 580 60 572 ' +
        'Q 50 538 56 500 Z',
    },
    {
      d:
        'M108 502 Q126 494 144 500 ' +
        'Q 150 538 140 572 ' +
        'L 110 572 Z',
    },
  ],
};

function Overlay({ regions, levels, viewLabel, imgSrc }) {
  return (
    <div className="relative w-full">
      <img
        src={imgSrc}
        alt={viewLabel}
        className="block w-full h-auto select-none pointer-events-none"
        draggable={false}
      />
      <svg
        viewBox="0 0 200 600"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {Object.entries(regions).map(([id, shapes]) => {
          const level = levels[id] || 0;
          if (level === 0) return null;
          return (
            <g key={id}>
              {shapes.map((s, i) => (
                <motion.path
                  key={i}
                  d={s.d}
                  initial={false}
                  animate={{
                    fill: LEVEL_FILL[level],
                    stroke: LEVEL_STROKE[level],
                    opacity: LEVEL_OPACITY[level],
                  }}
                  transition={{ duration: 0.4 }}
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-ink-300">
        {viewLabel}
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
            style={{ backgroundColor: LEVEL_FILL[lvl], opacity: 0.95 }}
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
    <div className="grid grid-cols-2 gap-3">
      <Overlay
        regions={FRONT_REGIONS}
        levels={levels}
        viewLabel={viewLabels?.front || 'FRONT'}
        imgSrc={FRONT_IMG}
      />
      <Overlay
        regions={BACK_REGIONS}
        levels={levels}
        viewLabel={viewLabels?.back || 'BACK'}
        imgSrc={BACK_IMG}
      />
    </div>
  );
}
