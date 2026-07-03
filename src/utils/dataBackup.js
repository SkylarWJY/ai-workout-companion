// Export/import/migrate ATLAS localStorage state.
//
// ATLAS has no backend. Everything lives in a handful of localStorage
// keys under the origin — history, overrides, theme, language. If iOS
// clears the PWA storage under memory pressure, or the user moves to
// a new domain, everything is gone.
//
// This module is the safety net: one JSON blob you can download, take
// anywhere, and re-import. It also owns the schemaVersion + migration
// table so future breaking changes to the storage layout don't
// silently corrupt existing installs.

const KEYS = [
  'atlas.history',
  'atlas.overrides',
  'atlas.bodyStats',
  'atlas.weightUnit',
  'atlas.v2theme',
  'atlas.theme',
  'atlas.lang',
  'atlas.langMigratedV2',
  'atlas.activeSession',
];

const CURRENT_SCHEMA_VERSION = 1;

// Migration ladder. Each entry runs when the exported snapshot's
// version is BELOW `to`. Keep them idempotent — the same snapshot
// may replay through the chain on multiple imports.
//
//   { from, to, apply: (snapshot) => nextSnapshot }
//
// v0 → v1: the v0.8-era export (the old prod site's "Export data"
// button) wrapped everything in `localStorage` with no version field.
// Detected by shape rather than version so those files import as-is.
const MIGRATIONS = [
  {
    from: 0,
    to: 1,
    apply: (s) => ({
      version: 1,
      exportedAt: s.exportedAt ?? null,
      origin: s.origin ?? null,
      data: s.localStorage,
    }),
  },
];

// Reads every ATLAS key and returns a single snapshot object.
export function exportAll() {
  const data = {};
  for (const k of KEYS) {
    const raw = localStorage.getItem(k);
    if (raw == null) continue;
    try {
      data[k] = JSON.parse(raw);
    } catch {
      data[k] = raw;
    }
  }
  return {
    version: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    origin: typeof window !== 'undefined' ? window.location.origin : null,
    data,
  };
}

// Triggers a browser download of the snapshot.
export function downloadBackup(filename = 'atlas-backup.json') {
  const snapshot = exportAll();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(
    /\.json$/,
    `-${new Date().toISOString().slice(0, 10)}.json`,
  );
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Runs the migration ladder against a raw imported snapshot.
export function migrate(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Backup file is empty or malformed.');
  }
  // Versionless files: v0.8 exports carry `localStorage` instead of
  // `data` — that shape IS version 0. Anything else versionless is a
  // v1 file written before the field existed.
  const inferred = snapshot.localStorage && !snapshot.data ? 0 : 1;
  let v = snapshot.version ?? inferred;
  let cur = snapshot;
  for (const step of MIGRATIONS) {
    if (v >= step.to) continue;
    if (v !== step.from) continue;
    cur = step.apply(cur);
    v = step.to;
  }
  return { ...cur, version: v };
}

// Writes every key from the (migrated) snapshot back into localStorage.
// Returns a summary the UI can show.
export function importAll(rawText) {
  let snapshot;
  try {
    snapshot = JSON.parse(rawText);
  } catch (err) {
    throw new Error(`Not valid JSON: ${err.message}`);
  }

  const migrated = migrate(snapshot);
  if (!migrated.data || typeof migrated.data !== 'object') {
    throw new Error('Backup has no `data` block. Is this the right file?');
  }

  const written = [];
  const skipped = [];
  for (const [key, value] of Object.entries(migrated.data)) {
    if (!KEYS.includes(key)) {
      skipped.push(key);
      continue;
    }
    // Always JSON-encode: exportAll() parsed every value, and the
    // storage layer (useLocalStorage) JSON.parses on read. Writing a
    // bare string here (e.g. zh instead of "zh") corrupts the key for
    // the next read — caught by the round-trip test in preview.
    localStorage.setItem(key, JSON.stringify(value));
    written.push(key);
  }

  return {
    version: migrated.version,
    written,
    skipped,
    exportedAt: migrated.exportedAt,
  };
}

export const SCHEMA = { current: CURRENT_SCHEMA_VERSION, keys: KEYS };
