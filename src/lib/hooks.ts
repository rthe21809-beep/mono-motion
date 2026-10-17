import { useCallback, useEffect, useRef, useState } from 'react';

export const isFinePointer = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

type Bind = { onPointerEnter: () => void; onPointerLeave: () => void; onPointerDown: () => void };

export function useActive(): { active: boolean; bind: Bind } {
  const [active, setActive] = useState(false);
  const fine = useRef(isFinePointer());

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => {
      fine.current = mq.matches;
      setActive(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const onPointerEnter = useCallback(() => {
    if (fine.current) setActive(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    if (fine.current) setActive(false);
  }, []);

  const onPointerDown = useCallback(() => {
    if (!fine.current) setActive((v) => !v);
  }, []);

  return { active, bind: { onPointerEnter, onPointerLeave, onPointerDown } };
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);

  return ref;
}
