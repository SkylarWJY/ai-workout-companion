import React, { useEffect, useState } from 'react';
import { useLang } from '../../i18n/index.jsx';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';

// Forensic data dump — same logic as v0.8 DataExportSheet but rendered
// inside the v2 sheet. Skips the IndexedDB blob bytes (only sizes); the
// localStorage payload is plain JSON.
async function collectStorage() {
  const out = {
    exportedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    localStorage: {},
    indexedDB: { blobs: [] },
  };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('atlas.')) continue;
    try { out.localStorage[key] = JSON.parse(localStorage.getItem(key)); }
    catch { out.localStorage[key] = localStorage.getItem(key); }
  }
  try {
    const blobs = await new Promise((resolve) => {
      const req = indexedDB.open('atlas-video-store', 1);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('blobs')) return resolve([]);
        const tx = db.transaction('blobs', 'readonly');
        const keysReq = tx.objectStore('blobs').getAllKeys();
        keysReq.onsuccess = async () => {
          const keys = keysReq.result || [];
          const list = [];
          for (const k of keys) {
            const v = await new Promise((res) => {
              const r = tx.objectStore('blobs').get(k);
              r.onsuccess = () => res(r.result);
              r.onerror = () => res(null);
            });
            if (v) list.push({ key: k, sizeBytes: v.size, type: v.type });
          }
          resolve(list);
        };
        keysReq.onerror = () => resolve([]);
      };
      req.onerror = () => resolve([]);
    });
    out.indexedDB.blobs = blobs;
  } catch { /* no IDB */ }
  return out;
}

export default function DataExportSheet({ open, onClose }) {
  const { lang } = useLang();
  const [payload, setPayload] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) collectStorage().then(setPayload);
    else { setPayload(null); setCopied(false); }
  }, [open]);

  const json = payload ? JSON.stringify(payload, null, 2) : '';
  const sessionCount = Object.values(payload?.localStorage?.['atlas.history'] || {}).length;
  const totalSets = Object.values(payload?.localStorage?.['atlas.history'] || {})
    .reduce((acc, s) => acc + Object.values(s?.completedSets || {})
      .reduce((a, arr) => a + arr.length, 0), 0);

  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { /* ignore */ }
  };

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={lang === 'zh' ? '导出数据' : 'Export data'}
      height="tall"
    >
      <div className="px-5 pt-1 pb-8 space-y-4">
        <div className="v2-card p-4 grid grid-cols-3 gap-3 text-center">
          <Stat label={lang === 'zh' ? '历史训练' : 'Sessions'} value={sessionCount} />
          <Stat label={lang === 'zh' ? '总组数' : 'Total sets'} value={totalSets} />
          <Stat label={lang === 'zh' ? '存储项' : 'Storage keys'} value={Object.keys(payload?.localStorage || {}).length} />
        </div>

        <div className="flex gap-3">
          <PrimaryButton size="lg" fullWidth onClick={copy} tint={copied ? tints.green : null}>
            {copied
              ? (lang === 'zh' ? '已复制 ✓' : 'Copied ✓')
              : (lang === 'zh' ? '复制 JSON' : 'Copy JSON')}
          </PrimaryButton>
          <PrimaryButton size="lg" fullWidth variant="tinted" onClick={download}>
            {lang === 'zh' ? '下载 .json' : 'Download .json'}
          </PrimaryButton>
        </div>

        {payload && (
          <div className="v2-card-flat p-3 max-h-[42dvh] overflow-auto">
            <pre className="v2-num text-[10px] v2-t2 leading-relaxed whitespace-pre-wrap break-all">
              {json.slice(0, 4000)}{json.length > 4000 ? '\n…' : ''}
            </pre>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="v2-display v2-numeric text-[22px] v2-t1">{value}</div>
      <div className="v2-caption v2-t3 text-[9px] mt-1">{label}</div>
    </div>
  );
}
