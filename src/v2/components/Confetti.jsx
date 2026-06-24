import React, { useEffect, useMemo } from 'react';

// Fixed-position confetti burst. Renders nothing when active=false.
// Mount + unmount on a flag — the keyframe animates each piece downwards
// with rotation, then the parent unmounts after ~3s.
//
// Lives outside the React tree's normal flow via fixed position so it
// doesn't shove other layout.
export default function Confetti({ active, pieces = 80 }) {
  // Stable random distribution per mount so the burst doesn't reshuffle
  // on re-render. useMemo with `active` resets when the burst restarts.
  const dots = useMemo(() => {
    if (!active) return [];
    const palette = ['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#0A84FF', '#5E5CE6', '#FF375F', '#66D4CF'];
    return Array.from({ length: pieces }, (_, i) => {
      const left = Math.random() * 100;          // 0..100 %
      const cx = (Math.random() - 0.5) * 60;     // horizontal drift, vw
      const dur = 2.2 + Math.random() * 1.4;     // 2.2..3.6s
      const delay = Math.random() * 0.6;
      const color = palette[i % palette.length];
      const rot0 = Math.random() * 360;
      const w = 6 + Math.random() * 5;
      const h = 12 + Math.random() * 8;
      return { left, cx, dur, delay, color, rot0, w, h, i };
    });
  }, [active, pieces]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.i}
          className="v2-confetto"
          style={{
            left: `${d.left}%`,
            background: d.color,
            width: d.w,
            height: d.h,
            transform: `rotate(${d.rot0}deg)`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
            // eslint-disable-next-line
            // CSS custom props read by the keyframe
            '--cx': `${d.cx}vw`,
            '--dur': `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
