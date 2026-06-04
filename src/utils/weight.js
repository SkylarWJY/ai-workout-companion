// kg/lb conversion + display helpers.
//
// Stored log entries carry their own `weightUnit` because that's what
// the user typed at log time. The display unit is the live setting
// (`useOverrides().weightUnit`). When they disagree we convert.

export const LB_PER_KG = 2.20462262185;

// Round kg to 0.5-kg precision (matches plate increments at most gyms),
// lb to whole numbers (5-lb plates are the standard).
function round(value, toUnit) {
  if (toUnit === 'kg') return Math.round(value * 2) / 2;
  if (toUnit === 'lb') return Math.round(value);
  return value;
}

// Convert a numeric weight from one unit to another. Pass-throughs when
// the units match (no rounding) so a freshly-typed `25 lb` displayed in
// lb stays `25 lb` exactly.
export function convertWeight(value, fromUnit, toUnit) {
  if (value == null || value === '') return value;
  if (!fromUnit || !toUnit || fromUnit === toUnit) return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  if (fromUnit === 'lb' && toUnit === 'kg') return round(n / LB_PER_KG, 'kg');
  if (fromUnit === 'kg' && toUnit === 'lb') return round(n * LB_PER_KG, 'lb');
  return value;
}

// "25 lb" / "11.5 kg" — short formatted weight string.
export function formatWeight(value, unit) {
  if (value == null || value === '') return null;
  return `${value} ${unit || ''}`.trim();
}
