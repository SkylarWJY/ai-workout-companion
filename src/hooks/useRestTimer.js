import { useEffect, useRef, useState, useCallback } from 'react';

export function useRestTimer() {
  const [duration, setDuration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tickRef = useRef(null);
  const endAtRef = useRef(0);

  const clear = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const start = useCallback((seconds) => {
    clear();
    setDone(false);
    setDuration(seconds);
    setRemaining(seconds);
    endAtRef.current = Date.now() + seconds * 1000;
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (!running) return;
    clear();
    setRunning(false);
  }, [running]);

  const resume = useCallback(() => {
    if (running || remaining <= 0) return;
    endAtRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  }, [running, remaining]);

  const skip = useCallback(() => {
    clear();
    setRemaining(0);
    setRunning(false);
    setDone(true);
  }, []);

  const reset = useCallback(() => {
    clear();
    setRemaining(duration);
    endAtRef.current = Date.now() + duration * 1000;
    setRunning(true);
    setDone(false);
  }, [duration]);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setRemaining(0);
    setDuration(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clear();
        setRunning(false);
        setDone(true);
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
      }
    }, 200);
    return clear;
  }, [running]);

  useEffect(() => () => clear(), []);

  return {
    duration,
    remaining,
    running,
    done,
    active: duration > 0,
    start,
    pause,
    resume,
    skip,
    reset,
    stop,
  };
}
