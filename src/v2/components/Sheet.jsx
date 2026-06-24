import React, { useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { springs, eases } from '../theme.js';

// Apple-style bottom sheet. Drag-down dismiss with rubber-band, scrim
// fades with the drag, content is glass over OLED black. Locks body
// scroll while open.
export default function Sheet({
  open,
  onClose,
  children,
  title = null,
  trailing = null,
  height = 'auto',  // 'auto' | 'tall' (90vh) | 'full' (100vh)
  scroll = true,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const y = useMotionValue(0);
  const scrimOpacity = useTransform(y, [0, 400], [1, 0]);

  const heightClass = {
    auto: 'max-h-[88dvh]',
    tall: 'h-[90dvh]',
    full: 'h-[100dvh] rounded-none',
  }[height];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: eases.out }}
            style={{ opacity: scrimOpacity }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/65"
          />
          <motion.div
            role="dialog"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={springs.sheet}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 500) onClose?.();
            }}
            style={{ y }}
            className={`fixed inset-x-0 bottom-0 z-50 ${heightClass}
              v2-glass-strong rounded-t-[28px] overflow-hidden
              border-t border-l border-r border-white/[0.08]`}
          >
            <div className="flex flex-col h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {/* Grabber */}
              <div className="pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
                <div className="w-9 h-[5px] rounded-full bg-white/25" />
              </div>
              {(title || trailing) && (
                <div className="px-5 pt-1 pb-3 flex items-center justify-between">
                  <h3 className="v2-title text-[20px]">{title}</h3>
                  {trailing}
                </div>
              )}
              <div className={`flex-1 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
