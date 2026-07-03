import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/index.jsx';
import { tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import {
  exportAll,
  downloadBackup,
  importAll,
  SCHEMA,
} from '../../utils/dataBackup.js';

// Backup + restore. All ATLAS state is localStorage; if iOS clears
// the PWA sandbox or the domain changes, everything is gone. This
// sheet is the safety net — download all state as one JSON, and
// re-import on any device that speaks the same schema.
//
// Import routes through the versioned migration ladder in dataBackup.js
// so a snapshot from an older schema replays through the upgrades
// instead of silently corrupting the current install.

export default function DataExportSheet({ open, onClose }) {
  const { lang } = useLang();
  const [snapshot, setSnapshot] = useState(null);
  const [copied, setCopied] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) setSnapshot(exportAll());
    else {
      setSnapshot(null);
      setCopied(false);
      setImportResult(null);
      setImportError(null);
    }
  }, [open]);

  const json = snapshot ? JSON.stringify(snapshot, null, 2) : '';
  const history = snapshot?.data?.['atlas.history'] || {};
  const sessionCount = Object.values(history).length;
  const totalSets = Object.values(history).reduce(
    (acc, s) =>
      acc +
      Object.values(s?.completedSets || {}).reduce(
        (a, arr) => a + arr.length,
        0,
      ),
    0,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleImportFile = (e) => {
    setImportError(null);
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = importAll(String(reader.result));
        setImportResult(result);
        // Refresh the visible snapshot so the stats reflect the imported data
        setSnapshot(exportAll());
      } catch (err) {
        setImportError(err.message || String(err));
      }
    };
    reader.readAsText(file);
    // Reset the file input so picking the same file again re-triggers.
    e.target.value = '';
  };

  const reloadPage = () => window.location.reload();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={lang === 'zh' ? '备份 / 恢复' : 'Backup / Restore'}
      height="tall"
    >
      <div className="px-5 pt-1 pb-8 space-y-4">
        <div className="v2-card p-4 grid grid-cols-3 gap-3 text-center">
          <Stat
            label={lang === 'zh' ? '历史训练' : 'Sessions'}
            value={sessionCount}
          />
          <Stat
            label={lang === 'zh' ? '总组数' : 'Total sets'}
            value={totalSets}
          />
          <Stat
            label={lang === 'zh' ? '存储项' : 'Storage keys'}
            value={Object.keys(snapshot?.data || {}).length}
          />
        </div>

        {/* Export row */}
        <div>
          <div className="v2-caption v2-t2 mb-2 text-[11px]">
            {lang === 'zh' ? '导出' : 'Export'} · v{SCHEMA.current}
          </div>
          <div className="flex gap-3">
            <PrimaryButton
              size="lg"
              fullWidth
              onClick={copy}
              tint={copied ? tints.green : null}
            >
              {copied
                ? lang === 'zh'
                  ? '已复制 ✓'
                  : 'Copied ✓'
                : lang === 'zh'
                ? '复制 JSON'
                : 'Copy JSON'}
            </PrimaryButton>
            <PrimaryButton
              size="lg"
              fullWidth
              variant="tinted"
              onClick={() => downloadBackup('atlas-backup.json')}
            >
              {lang === 'zh' ? '下载 .json' : 'Download .json'}
            </PrimaryButton>
          </div>
        </div>

        {/* Import row */}
        <div>
          <div className="v2-caption v2-t2 mb-2 text-[11px]">
            {lang === 'zh' ? '恢复' : 'Restore'}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
          <PrimaryButton
            size="lg"
            fullWidth
            variant="tinted"
            onClick={() => fileInputRef.current?.click()}
          >
            {lang === 'zh' ? '上传 .json 备份' : 'Upload .json backup'}
          </PrimaryButton>

          {importError && (
            <div
              className="mt-3 p-3 rounded-2xl text-[12px] leading-relaxed"
              style={{
                background: 'rgba(255, 69, 58, 0.10)',
                border: '1px solid rgba(255, 69, 58, 0.30)',
                color: '#FFB4AE',
              }}
            >
              {lang === 'zh' ? '导入失败：' : 'Import failed: '}
              {importError}
            </div>
          )}

          {importResult && (
            <div
              className="mt-3 p-3 rounded-2xl v2-card-flat text-[12px] leading-relaxed"
              style={{
                borderColor: 'var(--tint-green)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <div className="v2-t1 mb-1">
                {lang === 'zh' ? '导入完成 ✓' : 'Imported ✓'} (schema v
                {importResult.version})
              </div>
              <div className="v2-t2 text-[11px]">
                {lang === 'zh' ? '写入' : 'Wrote'}:{' '}
                {importResult.written.length}{' '}
                {lang === 'zh' ? '项' : 'keys'}
                {importResult.skipped.length > 0 && (
                  <>
                    {' · '}
                    {lang === 'zh' ? '跳过' : 'Skipped'}:{' '}
                    {importResult.skipped.length}
                  </>
                )}
              </div>
              <button
                onClick={reloadPage}
                className="mt-2 v2-pill"
                style={{ fontSize: 12 }}
              >
                {lang === 'zh' ? '刷新页面看效果' : 'Reload to see changes'}
              </button>
            </div>
          )}
        </div>

        {/* Raw JSON preview */}
        {snapshot && (
          <div className="v2-card-flat p-3 max-h-[36dvh] overflow-auto">
            <pre className="v2-num text-[10px] v2-t2 leading-relaxed whitespace-pre-wrap break-all">
              {json.slice(0, 4000)}
              {json.length > 4000 ? '\n…' : ''}
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
