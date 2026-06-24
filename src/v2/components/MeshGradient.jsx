import React from 'react';

// Animated mesh-gradient blob. Sits behind a hero or any tall section.
// CSS-only — uses radial-gradient + a 26s drift keyframe.
// Pass `intensity` 0..1 to crossfade in/out.
export default function MeshGradient({ intensity = 1, className = '' }) {
  return (
    <div
      aria-hidden
      className={`v2-mesh ${className}`}
      style={{ opacity: 0.95 * intensity }}
    />
  );
}
