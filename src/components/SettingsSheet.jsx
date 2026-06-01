import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useOverrides } from '../hooks/useOverrides.jsx';

export default function SettingsSheet({ open, onClose }) {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { weightUnit, setWeightUnit, resetAll } = useOverrides();

  const handleReset = () => {
    if (window.confirm(t('settings.resetConfirm'))) {
      resetAll();
    }
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
            className="fixed inset-0 z-30 bg-ink-900/40 dark:bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-[28px] bg-bone-50 dark:bg-ink-900 border-t border-black/5 dark:border-white/5 pb-safe"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-bone-50/85 dark:bg-ink-900/85 backdrop-blur-xl px-5 pt-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="w-9 h-1 mx-auto bg-ink-200 dark:bg-ink-600 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="pt-3 text-[15px] font-semibold tracking-tight text-ink-900 dark:text-bone-100">
                {t('settings.title')}
              </div>
              <button
                onClick={onClose}
                className="pt-3 text-ink-400 dark:text-ink-200 text-sm font-medium"
              >
                {t('settings.done')}
              </button>
            </div>

            <div className="px-5 pt-4 pb-10 space-y-3">
              <Row label={t('settings.language')}>
                <SegmentToggle
                  options={[
                    { id: 'en', label: 'EN' },
                    { id: 'zh', label: '中' },
                  ]}
                  value={lang}
                  onChange={setLang}
                />
              </Row>

              <Row label={t('settings.theme')}>
                <SegmentToggle
                  options={[
                    { id: 'light', label: t('settings.theme.light') },
                    { id: 'dark', label: t('settings.theme.dark') },
                  ]}
                  value={theme}
                  onChange={setTheme}
                />
              </Row>

              <Row label={t('settings.unit')}>
                <SegmentToggle
                  options={[
                    { id: 'lb', label: 'lb' },
                    { id: 'kg', label: 'kg' },
                  ]}
                  value={weightUnit}
                  onChange={setWeightUnit}
                />
              </Row>

              <button
                onClick={handleReset}
                className="w-full mt-4 py-3 rounded-2xl border border-priority-extreme/30 text-priority-extreme text-[12px] uppercase tracking-wider font-medium active:scale-[0.98]"
              >
                {t('settings.reset')}
              </button>

              <div className="pt-4 text-center text-[11px] text-ink-300">
                ATLAS · {t('settings.aboutVersion')} 0.5.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-ink-800 border border-black/5 dark:border-white/5 p-4 flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink-700 dark:text-bone-100">{label}</span>
      {children}
    </div>
  );
}

function SegmentToggle({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center bg-bone-100 dark:bg-ink-700 rounded-full p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`text-[11px] uppercase tracking-wider font-medium px-3 py-1.5 rounded-full transition
            ${
              value === o.id
                ? 'bg-ink-900 dark:bg-bone-100 text-bone-50 dark:text-ink-900'
                : 'text-ink-500 dark:text-ink-200'
            }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
