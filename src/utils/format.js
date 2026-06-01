export const fmtTime = (s) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const dayShort = () => {
  const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return d[new Date().getDay()];
};

// Compact rest formatter — "45s" / "1m" / "1m 30s" / "2m"
export const fmtRest = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
};

// Weight unit conversion (1 kg ≈ 2.2046 lb)
export const lbToKg = (lb) => lb / 2.2046;
export const kgToLb = (kg) => kg * 2.2046;

// Detects unilateral exercises by repRange wording — "each", "per side",
// "per leg", "ea" all count.
export const isUnilateral = (repRange) => {
  if (!repRange) return false;
  return /\b(each|per\s*(side|leg|arm)|ea)\b/i.test(repRange);
};

export const parseRepRange = (rangeStr) => {
  // "8–12" or "6–10" or "10–15 / 20–40s" → return top number for first segment
  const first = (rangeStr || '').split('/')[0].trim();
  const match = first.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!match) return { low: null, high: null };
  return { low: parseInt(match[1], 10), high: parseInt(match[2], 10) };
};
