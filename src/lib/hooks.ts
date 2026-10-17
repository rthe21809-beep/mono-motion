import { useCallback, useEffect, useRef, useState } from 'react';

export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return fine;
}

export function useHover() {
  const [hovered, setHovered] = useState(false);
  const fine = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    fine.current = mq.matches;
    const sync = () => {
      fine.current = mq.matches;
      if (!mq.matches) setHovered(false);
    };
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const onPointerEnter = useCallback(() => {
    if (fine.current) setHovered(true);
  }, []);
  const onPointerLeave = useCallback(() => {
    if (fine.current) setHovered(false);
  }, []);
  return { hovered, handlers: { onPointerEnter, onPointerLeave } };
}

export function usePlay(ms = 800) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const play = useCallback(() => {
    window.clearTimeout(timer.current);
    setPlaying(true);
    timer.current = window.setTimeout(() => setPlaying(false), ms);
  }, [ms]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { playing, play };
}

export function useActive(ms = 800) {
  const hover = useHover();
  const tap = usePlay(ms);
  return {
    active: hover.hovered || tap.playing,
    handlers: { ...hover.handlers, onPointerDown: tap.play }
  };
}

export function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void
) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const start = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [draw]);
  return ref;
}
