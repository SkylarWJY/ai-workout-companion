import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useLang, locEx } from '../../i18n/index.jsx';
import { useOverrides } from '../../hooks/useOverrides.jsx';
import { springs, tints } from '../theme.js';
import Sheet from './Sheet.jsx';
import PrimaryButton from './PrimaryButton.jsx';

// Drag-to-reorder sheet. Uses framer-motion Reorder which gives us
// smooth FLIP animations + touch-drag for free. Persists to
// overrides.order.{workoutId}.
export default function ReorderSheet({ open, onClose, workout, exercises = [] }) {
  const { lang } = useLang();
  const { setOverride, clearOverride } = useOverrides();
  const [order, setOrder] = useState(exercises);

  // Sync when sheet reopens with a new list.
  React.useEffect(() => {
    if (open) setOrder(exercises);
  }, [open, exercises]);

  const save = () => {
    setOverride('order', null, workout.id, order.map((e) => e.id));
    onClose();
  };

  const reset = () => {
    clearOverride('order', null, workout.id);
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={lang === 'zh' ? '调整动作顺序' : 'Reorder exercises'}
      trailing={
        <PrimaryButton size="sm" variant="plain" onClick={save}>
          {lang === 'zh' ? '保存' : 'Save'}
        </PrimaryButton>
      }
      height="tall"
    >
      <div className="px-5 pt-1 pb-8 space-y-4">
        <div className="v2-caption v2-t2">
          {lang === 'zh' ? '长按拖动 — 自动保存到本次顺序' : 'Long-press to drag. Order persists per day.'}
        </div>

        <Reorder.Group
          axis="y"
          values={order}
          onReorder={setOrder}
          className="space-y-2"
        >
          {order.map((ex, i) => (
            <Reorder.Item
              key={ex.id}
              value={ex}
              whileDrag={{
                scale: 1.04,
                boxShadow: '0 22px 44px -8px rgba(0,0,0,0.45)',
                zIndex: 10,
              }}
              className="v2-card p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
            >
              <span className="v2-num text-[12px] v2-t3 w-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="v2-body text-[15px] v2-t1 truncate">
                  {locEx(ex, 'name', lang)}
                </div>
                <div className="v2-caption v2-t3 text-[10px] mt-0.5">
                  {ex.sets} × {ex.repRange}
                </div>
              </div>
              <span className="v2-t3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <PrimaryButton
          size="md"
          variant="plain"
          fullWidth
          onClick={reset}
          tint={tints.red}
        >
          {lang === 'zh' ? '恢复默认顺序' : 'Reset to default order'}
        </PrimaryButton>
      </div>
    </Sheet>
  );
}
