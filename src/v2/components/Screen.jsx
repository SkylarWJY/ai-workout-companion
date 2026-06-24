import React from 'react';

// Full-viewport screen with safe-area insets. Every v2 screen wraps in this.
export default function Screen({ children, className = '' }) {
  return (
    <div
      className={`v2-screen relative w-full overflow-x-hidden ${className}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {children}
    </div>
  );
}
