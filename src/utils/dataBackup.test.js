import { describe, it, expect, beforeEach } from 'vitest';
import { migrate, importAll, exportAll } from './dataBackup.js';

// Node has no localStorage — stub the minimal surface the module uses.
function installStorageStub() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
  return store;
}

beforeEach(() => installStorageStub());

// The exact shape of the v0.8 prod site's export button — verified
// against the user's real atlas-export-2026-07-03.json off her iPhone.
const LEGACY_V0 = {
  exportedAt: '2026-07-03T20:37:33.109Z',
  userAgent: 'Mozilla/5.0 (iPhone...)',
  localStorage: {
    'atlas.bodyStats': { bf: 25, weight: null },
    'atlas.activeSession': null,
    'atlas.weightUnit': 'kg',
    'atlas.overrides': { order: { pull: ['pull-1', 'pull-2'] } },
    'atlas.history': {
      s1: { type: 'push', completedAt: 1748385180000, completedSets: { 'push-1': [{ weight: 20, reps: 12 }] } },
    },
    'atlas.lang': 'zh',
  },
};

describe('migrate — v0 legacy shape', () => {
  it('detects the versionless localStorage wrapper as v0 and lifts it to v1', () => {
    const out = migrate(structuredClone(LEGACY_V0));
    expect(out.version).toBe(1);
    expect(out.data['atlas.history'].s1.type).toBe('push');
    expect(out.localStorage).toBeUndefined();
  });

  it('leaves a modern v1 snapshot untouched', () => {
    const v1 = { version: 1, data: { 'atlas.lang': 'zh' } };
    const out = migrate(structuredClone(v1));
    expect(out.version).toBe(1);
    expect(out.data['atlas.lang']).toBe('zh');
  });

  it('versionless file WITH a data block is treated as v1, not v0', () => {
    const out = migrate({ data: { 'atlas.lang': 'en' } });
    expect(out.version).toBe(1);
    expect(out.data['atlas.lang']).toBe('en');
  });
});

describe('importAll — legacy file end to end', () => {
  it('imports the user\'s v0.8 backup: history, weightUnit, bodyStats all land', () => {
    const result = importAll(JSON.stringify(LEGACY_V0));
    expect(result.version).toBe(1);
    expect(result.written).toContain('atlas.history');
    expect(result.written).toContain('atlas.weightUnit');
    expect(result.written).toContain('atlas.bodyStats');
    expect(result.skipped).toEqual([]);

    // Values must be readable through the storage layer's JSON.parse.
    expect(JSON.parse(localStorage.getItem('atlas.weightUnit'))).toBe('kg');
    const history = JSON.parse(localStorage.getItem('atlas.history'));
    expect(history.s1.completedSets['push-1'][0].weight).toBe(20);
  });

  it('round-trips: import v0 → export → import again → identical storage', () => {
    importAll(JSON.stringify(LEGACY_V0));
    const snap = exportAll();
    expect(snap.version).toBe(1);
    const before = localStorage.getItem('atlas.history');
    importAll(JSON.stringify(snap));
    expect(localStorage.getItem('atlas.history')).toBe(before);
  });

  it('rejects garbage with a readable error', () => {
    expect(() => importAll('not json')).toThrow(/Not valid JSON/);
    expect(() => importAll('{"random":"file"}')).toThrow(/no `data` block/);
  });
});
