// IndexedDB-backed storage for user-uploaded video blobs.
//
// localStorage caps out at ~5-10 MB and refuses anything bigger; even one
// 20-MB phone video exceeds that. IndexedDB has ~unlimited quota for our
// purposes (browsers will warn the user before evicting) and supports
// Blob storage directly, so it's the right primitive here.
//
// The store key format is `{scope}::{id}::{variantKey}` (e.g.
// `exercise::push-1::dumbbell`). Keys are flat strings so a single
// objectStore covers exercise videos, warm-up videos, and any future
// scope without schema migrations.
//
// Caveat — iOS Safari has a "7-day eviction" rule for PWAs installed to
// the home screen: if the user doesn't open the app for a week, all
// IndexedDB / localStorage data may be cleared. The editor surfaces a
// warning when the user uploads a local video so they're not surprised.

const DB_NAME = 'atlas-video-store';
const DB_VERSION = 1;
const STORE = 'blobs';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable in this browser'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode) {
  return openDB().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

// Build a storage key from (scope, id, variantKey). All three parts are
// required; missing parts become the literal string 'null' so keys stay
// well-formed even if a caller forgets one.
export function videoKey(scope, id, variantKey) {
  return `${scope || 'null'}::${id || 'null'}::${variantKey || 'null'}`;
}

// Saves a Blob (typically from a file input) under the given key.
// Resolves once the write is durable.
export async function putVideo(key, blob) {
  const store = await tx('readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put(blob, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Returns the Blob for `key`, or null if not stored.
export async function getVideo(key) {
  const store = await tx('readonly');
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// Removes the Blob for `key`. Resolves either way (no-op if missing).
export async function deleteVideo(key) {
  const store = await tx('readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Convenience: wraps getVideo + URL.createObjectURL. Caller is
// responsible for revoking the URL with `URL.revokeObjectURL()` once the
// video element no longer needs it.
export async function getVideoObjectUrl(key) {
  const blob = await getVideo(key);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

// Format a byte count as a human-readable size ("18.4 MB").
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '?';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
