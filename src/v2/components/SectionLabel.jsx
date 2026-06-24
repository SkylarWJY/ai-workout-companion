import React from 'react';

// Section heading row. The trailing slot holds inline actions ("See all").
export default function SectionLabel({ children, trailing = null, className = '' }) {
  return (
    <div className={`flex items-end justify-between px-1 mb-2.5 ${className}`}>
      <h2 className="v2-caption">{children}</h2>
      {trailing}
    </div>
  );
}
