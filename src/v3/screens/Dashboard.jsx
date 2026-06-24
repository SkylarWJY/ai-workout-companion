import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import {
  getWorkoutsForPlan,
  getRecommendedSplit,
} from '../../data/workoutData.js';

// Split-aware day-type resolver (the data layer's getTodayWorkoutType
// hard-codes the legacy 4-day pattern). Monday-first index.
const dayTypeFromSplit = (date, split) => split[(date.getDay() + 6) % 7]?.type || 'rest';

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_ZH = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const DOW_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DOW_ZH = ['一','二','三','四','五','六','日'];

function buildCalendar(year, month) {
  // month is 0-indexed. Returns 6 rows × 7 cols of Date objects, monday-first.
  const first = new Date(year, month, 1);
  // JS getDay: 0=Sun, 1=Mon … shift so Monday=0
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function fmtSession(rec, lang) {
  const dt = new Date(rec.endedAt || rec.startedAt);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = String(dt.getFullYear());
  return `${dd}.${mm}.${yy}`;
}

export default function Dashboard({ onStart }) {
  const { lang } = useLang();
  const { overrides } = useOverrides();
  const activePlan = overrides.plan?.active || 'default';
  const workouts = getWorkoutsForPlan(activePlan);
  const split = overrides.weeklySplit || getRecommendedSplit(activePlan);

  const today = new Date();
  const todayType = dayTypeFromSplit(today, split);
  const workoutToday = todayType && todayType !== 'rest' ? workouts[todayType] : null;

  // Calendar
  const [calYear, setCalYear] = React.useState(today.getFullYear());
  const [calMonth, setCalMonth] = React.useState(today.getMonth());
  const days = buildCalendar(calYear, calMonth);
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Days with a scheduled workout this month per the split
  const scheduledDayKeys = new Set();
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    if (d.getMonth() !== calMonth) continue;
    const t = dayTypeFromSplit(d, split);
    if (t && t !== 'rest') scheduledDayKeys.add(d.toDateString());
  }

  // Pull recent sessions
  const history = (() => {
    try { return JSON.parse(localStorage.getItem('atlas.history') || '{}'); }
    catch { return {}; }
  })();
  const recent = Object.values(history)
    .flat()
    .sort((a, b) => (b.endedAt || b.startedAt || 0) - (a.endedAt || a.startedAt || 0))
    .slice(0, 3);

  // Progress: % of current week's training days completed
  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const trainingDays = split.filter(s => s.type !== 'rest').length;
  const completedThisWeek = Object.values(history).flat().filter(rec => {
    const t = new Date(rec.endedAt || rec.startedAt);
    const diff = (today - t) / (1000 * 60 * 60 * 24);
    return diff < 7;
  }).length;
  const progressPct = trainingDays > 0
    ? Math.min(100, Math.round((completedThisWeek / trainingDays) * 100))
    : 0;

  const monthLabel = (lang === 'zh' ? MONTHS_ZH : MONTHS_EN)[calMonth];
  const dowLabels = lang === 'zh' ? DOW_ZH : DOW_EN;

  return (
    <main style={{ padding: '20px 18px 110px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="v3-iconbtn" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12l6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
          {lang === 'zh' ? '计划' : 'Plan'}
        </div>
        <button className="v3-iconbtn" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Calendar */}
      <section className="v3-card" style={{ padding: '18px 16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ color: 'var(--c-accent)', fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>
            {monthLabel}
          </div>
          <button
            onClick={() => { setCalMonth(m => (m + 1) % 12); if (calMonth === 11) setCalYear(y => y + 1); }}
            style={{ background: 'none', border: 'none', color: 'var(--c-accent)', cursor: 'pointer', padding: 4 }}
            aria-label="Next month"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="v3-cal">
          {dowLabels.map((d) => (
            <div key={d} className="v3-cal-head">{d}</div>
          ))}
          {days.map((d, i) => {
            const inMonth = d.getMonth() === calMonth;
            const isToday = isSameDay(d, today);
            const scheduled = scheduledDayKeys.has(d.toDateString());
            const cls = [
              'v3-cal-day',
              !inMonth && 'dim',
              isToday && 'today',
              !isToday && scheduled && inMonth && 'scheduled',
            ].filter(Boolean).join(' ');
            return <div key={i} className={cls}>{d.getDate()}</div>;
          })}
        </div>
      </section>

      {/* Hero — today's plan */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="v3-accent"
        style={{ marginTop: 16, padding: '22px 22px', display: 'flex', alignItems: 'center', gap: 18 }}
      >
        <ProgressRing pct={progressPct} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--c-ink)', fontWeight: 800, fontSize: 19, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {workoutToday
              ? (lang === 'zh' ? workoutToday.titleZh || workoutToday.title : workoutToday.title)
              : (lang === 'zh' ? '今天是休息日' : 'Rest day today')}
          </div>
          <button
            onClick={() => workoutToday && onStart(workoutToday.id)}
            className="v3-pill"
            style={{ marginTop: 10 }}
            disabled={!workoutToday}
          >
            {workoutToday
              ? (lang === 'zh' ? '继续' : 'Continue')
              : (lang === 'zh' ? '查看本周' : 'See week')}
          </button>
        </div>
      </motion.section>

      {/* Recent workouts */}
      <section style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {lang === 'zh' ? '最近训练' : 'Recent Workouts'}
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--c-accent)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
            {lang === 'zh' ? '全部' : 'See All'}
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyRecent lang={lang} />
        ) : (
          recent.map((rec, i) => (
            <RecentCard key={i} rec={rec} lang={lang} />
          ))
        )}
      </section>

      <TabBar lang={lang} onStart={() => workoutToday && onStart(workoutToday.id)} />
    </main>
  );
}

function ProgressRing({ pct }) {
  // Inner ring on the lime hero card.
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
      <svg viewBox="0 0 84 84" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(7,9,10,0.18)" strokeWidth="6" />
        <motion.circle
          cx="42" cy="42" r={r}
          fill="none"
          stroke="var(--c-ink)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--c-ink)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em',
      }}>
        {pct}%
      </div>
    </div>
  );
}

function RecentCard({ rec, lang }) {
  const setCount = Object.values(rec.completedSets || {}).flat().length;
  const volume = Object.values(rec.completedSets || {})
    .flat()
    .reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0);
  return (
    <div className="v3-card" style={{ padding: '16px 18px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {lang === 'zh' ? sessionTitleZh(rec.type) : sessionTitleEn(rec.type)}
        </div>
        <div style={{ color: 'var(--c-text-2)', fontSize: 12 }}>{fmtSession(rec, lang)}</div>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        <Stat label={lang === 'zh' ? '组数' : 'Sets'} value={setCount} unit="" />
        <Stat label={lang === 'zh' ? '总量' : 'Volume'} value={Math.round(volume)} unit="kg" />
      </div>
    </div>
  );
}

function EmptyRecent({ lang }) {
  return (
    <div className="v3-card" style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--c-text-2)', fontSize: 13 }}>
      {lang === 'zh' ? '还没有完成的训练 — 今天就开始吧。' : 'No sessions yet — start today.'}
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div>
      <div className="v3-label" style={{ fontSize: 10 }}>{label}</div>
      <div className="v3-num" style={{ fontSize: 18, marginTop: 4 }}>
        {value}<span style={{ fontSize: 11, color: 'var(--c-text-2)', marginLeft: 4, fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  );
}

function TabBar({ lang, onStart }) {
  const items = [
    { id: 'home',    icon: <IconHome />,    label: lang === 'zh' ? '主页' : 'Home',     active: true },
    { id: 'status',  icon: <IconStatus />,  label: lang === 'zh' ? '状态' : 'Status',   active: false },
    { id: 'fab',     fab: true },
    { id: 'plan',    icon: <IconPlan />,    label: lang === 'zh' ? '计划' : 'Program',  active: false },
    { id: 'account', icon: <IconAccount />, label: lang === 'zh' ? '我的' : 'Account',  active: false },
  ];
  return (
    <nav className="v3-tabbar" aria-label="Bottom navigation">
      {items.map((it) => it.fab ? (
        <div key="fab" style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="v3-tabbar-fab" onClick={onStart} aria-label="Start workout">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2.4" />
              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <button key={it.id} className={`v3-tabbar-item ${it.active ? 'is-active' : ''}`}>
          {it.icon}
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconStatus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19V9M10 19V5M16 19v-8M22 19H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconPlan = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M7 3v4M17 3v4M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconAccount = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 21a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function sessionTitleEn(type) {
  if (type === 'push') return 'Push';
  if (type === 'pull') return 'Pull';
  if (type === 'leg') return 'Leg';
  return type;
}
function sessionTitleZh(type) {
  if (type === 'push') return '推日';
  if (type === 'pull') return '拉日';
  if (type === 'leg') return '腿日';
  return type;
}
