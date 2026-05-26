import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/index.jsx';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  const isZh = lang === 'zh';

  return (
    <button
      aria-label={t('toggleLanguage')}
      onClick={() => setLang(isZh ? 'en' : 'zh')}
      className="relative h-7 w-[58px] rounded-full bg-bone-200 dark:bg-ink-600 border border-black/5 dark:border-white/10 flex items-center px-0.5 active:scale-95 transition-transform"
    >
      <motion.span
        layout
        className="absolute top-0.5 bottom-0.5 w-[26px] rounded-full bg-white dark:bg-bone-100"
        animate={{ left: isZh ? 30 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[10px] font-semibold tracking-wider ${
          !isZh ? 'text-ink-900' : 'text-ink-400 dark:text-ink-200'
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[11px] font-semibold ${
          isZh ? 'text-ink-900' : 'text-ink-400 dark:text-ink-200'
        }`}
      >
        中
      </span>
    </button>
  );
}
