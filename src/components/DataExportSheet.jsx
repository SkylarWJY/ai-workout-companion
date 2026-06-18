import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';

// Dumps every ATLAS-relevant storage location into a single JSON payload
// the user can copy + paste back. Built for forensic data recovery — the
// user reported losing pre-v0.8 sessions to the activeSession-overwrite
// bug; this lets them share their raw storage so we can dig in.
//
// Keys collected:
//   localStorage  atlas.*                     (history, activeSession, overrides, weightUnit, bodyStats)
//   IndexedDB     atlas-video-store/blobs     (keys + blob sizes only — blobs themselves are huge)
//
// Designed to be safe to share: no auth tokens, no PII beyond the user's
// own training records and config.
async function collectStorage() {
  const out = {
    exportedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    localStorage: {},
    indexedDB: { blobs: [] },
  };

  // Pull every atlas.* key, parse the JSON if it looks like one.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith('atlas.')) continue;
    const raw = localStorage.getItem(key);
    try {
      out.localStorage[key] = JSON.parse(raw);
    } catch {
      out.localStorage[key] = raw;
    }
  }

  // IndexedDB blob catalog — keys + sizes only. The blobs themselves
  // would balloon the export to MBs, and the user can re-upload videos
  // from the source anyway.
  try {
    const blobs = await new Promise((resolve, reject) => {
      const req = indexedDB.open('atlas-video-store', 1);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('blobs')) {
          resolve([]);
          return;
        }
        const tx = db.transaction('blobs', 'readonly');
        const store = tx.objectStore('blobs');
        const keysReq = store.getAllKeys();
        keysReq.onsuccess = async () => {
          const keys = keysReq.result || [];
          const list = [];
          for (const k of keys) {
            const v = await new Promise((res, rej) => {
              const r = store.get(k);
              r.onsuccess = () => res(r.result);
              r.onerror = () => rej(r.error);
            });
            list.push({ key: k, size: v?.size ?? null, type: v?.type ?? null });
          }
          resolve(list);
        };
        keysReq.onerror = () => reject(keysReq.error);
      };
      req.onerror = () => reject(req.error);
    });
    out.indexedDB.blobs = blobs;
  } catch (err) {
    out.indexedDB.error = String(err?.message || err);
  }

  // Surface a quick summary so the user can sanity-check what they're sharing.
  const history = out.localStorage['atlas.history'] || {};
  const sessions = Object.values(history).filter((s) => s?.completedAt);
  const allSets = sessions.reduce((acc, s) => {
    return (
      acc +
      Object.values(s.completedSets || {}).reduce(
        (a, arr) => a + (Array.isArray(arr) ? arr.length : 0),
        0,
      )
    );
  }, 0);
  out.summary = {
    sessionCount: sessions.length,
    totalLoggedSets: allSets,
    earliestSession:
      sessions.length > 0
        ? new Date(Math.min(...sessions.map((s) => s.completedAt || 0))).toISOString()
        : null,
    latestSession:
      sessions.length > 0
        ? new Date(Math.max(...sessions.map((s) => s.completedAt || 0))).toISOString()
        : null,
    activeSessionPresent: !!out.localStorage['atlas.activeSession'],
    customExercisesCount: Object.keys(
      out.localStorage['atlas.overrides']?.customExercises || {},
    ).length,
    localVideoBlobs: out.indexedDB.blobs?.length || 0,
  };

  return out;
}

export default function DataExportSheet({ open, onClose }) {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setData(null);
    setCopied(false);
    collectStorage().then((d) => setData(d));
  }, [open]);

  const json = data ? JSON.stringify(data, null, 2) : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select the text area so the user can copy manually
      const ta = document.getElementById('atlas-export-textarea');
      ta?.select();
    }
  };

  const downloadFile = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `atlas-export-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="pt-3 text-[13px] font-semibold text-ink-900 dark:text-bone-100">
                {t('export.title')}
              </div>
              <button
                onClick={onClose}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('settings.done')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-4">
              <div className="text-[12px] text-ink-400 dark:text-ink-200 leading-relaxed">
                {t('export.help')}
              </div>

              {!data && (
                <div className="text-[12px] text-ink-300">{t('export.loading')}</div>
              )}

              {data && (
                <>
                  <div className="rounded-2xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-4 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-ink-300">
                      {t('export.summary')}
                    </div>
                    <SummaryRow label="Completed sessions" value={data.summary.sessionCount} />
                    <SummaryRow label="Total logged sets" value={data.summary.totalLoggedSets} />
                    <SummaryRow label="Earliest" value={fmtDate(data.summary.earliestSession)} />
                    <SummaryRow label="Latest" value={fmtDate(data.summary.latestSession)} />
                    <SummaryRow
                      label="Unfinished session in storage"
                      value={data.summary.activeSessionPresent ? 'YES' : 'no'}
                      hot={data.summary.activeSessionPresent}
                    />
                    <SummaryRow
                      label="Custom exercises"
                      value={data.summary.customExercisesCount}
                    />
                    <SummaryRow
                      label="Local video blobs (IDB)"
                      value={data.summary.localVideoBlobs}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copy}
                      className="flex-1 py-3 rounded-2xl bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900 text-[12px] uppercase tracking-wider font-semibold active:scale-[0.98]"
                    >
                      {copied ? `✓ ${t('export.copied')}` : t('export.copy')}
                    </button>
                    <button
                      onClick={downloadFile}
                      className="flex-1 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-ink-700 dark:text-bone-100 text-[12px] uppercase tracking-wider font-medium active:scale-[0.98]"
                    >
                      {t('export.download')}
                    </button>
                  </div>

                  {/* Raw JSON — read-only, scrollable. Lets the user
                      eyeball what they're about to share before they
                      copy or send the file. */}
                  <textarea
                    id="atlas-export-textarea"
                    value={json}
                    readOnly
                    className="w-full h-[40vh] font-mono text-[10px] bg-bone-100 dark:bg-ink-800 rounded-2xl p-3 text-ink-700 dark:text-bone-100 border border-black/5 dark:border-white/5 outline-none"
                  />
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value, hot }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-ink-500 dark:text-ink-100">{label}</span>
      <span
        className={`tabular font-medium ${
          hot ? 'text-priority-extreme' : 'text-ink-900 dark:text-bone-100'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return '—';
  return iso.slice(0, 10);
}
