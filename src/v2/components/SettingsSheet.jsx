import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { useTheme as useV2Theme } from '../useTheme.js';
import { USER_PROFILE, PLANS } from '../../data/workoutData.js';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import SessionHistorySheet from './SessionHistorySheet.jsx';
import DataExportSheet from './DataExportSheet.jsx';

export default function SettingsSheet({ open, onClose, onReopenSession }) {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useV2Theme();
  const {
    overrides,
    weightUnit,
    setWeightUnit,
    setProfileField,
    setActivePlan: setActivePlanTyped,
    resetAll,
  } = useOverrides();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const o = overrides.profile || {};
  const currentBF = o.bf ?? USER_PROFILE.currentBodyFat;
  const targetBF  = o.targetBf ?? USER_PROFILE.targetBodyFat;
  const pullUpCurrent = o.pullUpCurrent ?? USER_PROFILE.pullUpProgression.current;
  const pullUpTarget  = o.pullUpTarget  ?? USER_PROFILE.pullUpProgression.target;
  const activePlan = overrides.plan?.active || 'default';
  const setActivePlan = (id) => setActivePlanTyped(id);

  const handleReset = () => {
    if (window.confirm(
      lang === 'zh' ? '清空所有数据? 此操作不可撤销。' : 'Reset all data? This cannot be undone.',
    )) resetAll();
  };

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={lang === 'zh' ? '设置' : 'Settings'}
        height="tall"
      >
        <div className="px-5 pt-1 pb-8 space-y-6">

          {/* Training plan picker — top of the list because it's the
              most consequential setting for what the rest of the app
              shows (Dashboard → today's plan, body map, recommendations). */}
          <Section title={lang === 'zh' ? '训练计划' : 'TRAINING PLAN'}>
            {Object.values(PLANS).map((p, i) => {
              const selected = activePlan === p.id;
              const isCoach = p.id !== 'default';
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  transition={springs.press}
                  onClick={() => setActivePlan(p.id)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                  style={i > 0 ? { borderTop: '0.5px solid var(--hairline)' } : undefined}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full mt-1 grid place-items-center"
                    style={
                      selected
                        ? { background: isCoach ? tints.orange : tints.mint, color: '#000' }
                        : { boxShadow: 'inset 0 0 0 1.5px var(--hairline-strong)' }
                    }
                  >
                    {selected && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="v2-title text-[14px] v2-t1">
                        {lang === 'zh' && p.labelZh ? p.labelZh : p.label}
                      </span>
                      {isCoach && (
                        <span
                          className="v2-caption text-[9px] tracking-wide px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,159,10,0.18)', color: tints.orange }}
                        >
                          {lang === 'zh' ? '教练' : 'COACH'}
                        </span>
                      )}
                    </div>
                    <div className="v2-body text-[12px] v2-t2 mt-0.5">
                      {lang === 'zh' && p.summaryZh ? p.summaryZh : p.summary}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </Section>

          {/* Display preferences */}
          <Section title={lang === 'zh' ? '显示偏好' : 'DISPLAY'}>
            <Row label={lang === 'zh' ? '语言' : 'Language'}>
              <Segment
                options={[{ id: 'en', label: 'EN' }, { id: 'zh', label: '中' }]}
                value={lang}
                onChange={setLang}
              />
            </Row>
            <Row label={lang === 'zh' ? '主题' : 'Theme'}>
              <Segment
                options={[
                  { id: 'dark',  label: lang === 'zh' ? '黑' : 'Dark' },
                  { id: 'light', label: lang === 'zh' ? '白' : 'Light' },
                ]}
                value={theme}
                onChange={setTheme}
              />
            </Row>
            <Row label={lang === 'zh' ? '重量单位' : 'Weight unit'}>
              <Segment
                options={[{ id: 'kg', label: 'kg' }, { id: 'lb', label: 'lb' }]}
                value={weightUnit}
                onChange={setWeightUnit}
              />
            </Row>
          </Section>

          {/* Body composition */}
          <Section title={lang === 'zh' ? '身体目标' : 'BODY COMPOSITION'}>
            <NumberRow
              label={lang === 'zh' ? '当前体脂' : 'Current body fat'}
              suffix="%"
              value={currentBF}
              onChange={(v) => setProfileField('bf', Number(v) || 0)}
            />
            <NumberRow
              label={lang === 'zh' ? '目标体脂' : 'Target body fat'}
              suffix="%"
              value={targetBF}
              onChange={(v) => setProfileField('targetBf', Number(v) || 0)}
            />
          </Section>

          {/* Pull-up goal */}
          <Section title={lang === 'zh' ? '引体向上目标' : 'PULL-UP GOAL'}>
            <TextRow
              label={lang === 'zh' ? '当前能力' : 'Currently'}
              value={pullUpCurrent}
              onChange={(v) => setProfileField('pullUpCurrent', v)}
            />
            <TextRow
              label={lang === 'zh' ? '目标' : 'Target'}
              value={pullUpTarget}
              onChange={(v) => setProfileField('pullUpTarget', v)}
            />
          </Section>

          {/* Data actions */}
          <Section title={lang === 'zh' ? '数据' : 'DATA'}>
            <ActionRow
              label={lang === 'zh' ? '查看历史训练' : 'Past sessions'}
              onClick={() => setHistoryOpen(true)}
              chevron
            />
            <ActionRow
              label={lang === 'zh' ? '导出所有数据' : 'Export all data'}
              onClick={() => setExportOpen(true)}
              chevron
            />
            <ActionRow
              label={lang === 'zh' ? '清空所有数据' : 'Reset everything'}
              onClick={handleReset}
              destructive
            />
          </Section>

          <div className="text-center v2-caption v2-t3 text-[10px] tracking-wider">
            ATLAS · v2 — Apple-grade preview
          </div>
        </div>
      </Sheet>

      <SessionHistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onReopen={onReopenSession
          ? (type) => { setHistoryOpen(false); onClose?.(); onReopenSession(type); }
          : undefined}
      />
      <DataExportSheet open={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <div className="v2-caption v2-t2 mb-2 px-1">{title}</div>
      <div className="v2-card-flat divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--hairline)' }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5"
      style={{ borderTop: '0.5px solid var(--hairline)' }}>
      <span className="v2-body text-[14px] v2-t1">{label}</span>
      {children}
    </div>
  );
}

function NumberRow({ label, value, suffix, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5"
      style={{ borderTop: '0.5px solid var(--hairline)' }}>
      <span className="v2-body text-[14px] v2-t1">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
          className="w-14 text-right bg-transparent border-0 outline-none v2-num text-[15px] font-semibold v2-t1"
        />
        {suffix && <span className="v2-body text-[12px] v2-t3">{suffix}</span>}
      </div>
    </div>
  );
}

function TextRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5"
      style={{ borderTop: '0.5px solid var(--hairline)' }}>
      <span className="v2-body text-[14px] v2-t1 shrink-0">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-right bg-transparent border-0 outline-none v2-body text-[14px] v2-t1"
      />
    </div>
  );
}

function ActionRow({ label, onClick, destructive = false, chevron = false }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      transition={springs.press}
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
      style={{ borderTop: '0.5px solid var(--hairline)' }}
    >
      <span
        className="v2-body text-[14px]"
        style={{ color: destructive ? tints.red : 'var(--label-1)' }}
      >
        {label}
      </span>
      {chevron && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="v2-t3">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  );
}

function Segment({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center v2-bg-soft rounded-full p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="v2-num text-[12px] font-semibold px-3 py-1.5 rounded-full transition"
          style={
            value === o.id
              ? { background: 'var(--accent)', color: 'var(--canvas)' }
              : { color: 'var(--label-2)' }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
