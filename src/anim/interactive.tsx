import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { isFinePointer, useActive, useCanvas } from '../lib/hooks';

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 280, damping: 24, mass: 0.7 } as const;

/* 26 - Tilt Card */
export function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING);
  const sry = useSpring(ry, SPRING);
  const glareX = useTransform(sry, [-14, 14], ['18%', '82%']);
  const fine = isFinePointer();

  const move = (e: React.PointerEvent) => {
    if (!isFinePointer() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 22);
    rx.set(-ny * 22);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="ic-tiltWrap">
      <motion.div
        ref={ref}
        className="ic-tilt"
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
        onPointerMove={move}
        onPointerLeave={reset}
        animate={!fine ? { rotateX: [-6, 6, -6], rotateY: [10, -10, 10] } : undefined}
        transition={!fine ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <motion.span className="ic-tilt__glare" style={{ left: glareX }} />
        <span className="ic-tilt__title">TILT</span>
        <span className="ic-tilt__sub">pointer - 3d</span>
      </motion.div>
    </div>
  );
}

/* 27 - Spotlight Card */
export function SpotlightCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [on, setOn] = useState(false);

  const move = (e: React.PointerEvent) => {
    if (!isFinePointer() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100
    });
  };

  return (
    <div
      ref={ref}
      className={on ? 'ic-spot is-on' : 'ic-spot'}
      onPointerMove={move}
      onPointerEnter={() => isFinePointer() && setOn(true)}
      onPointerLeave={() => setOn(false)}
      onPointerDown={() => !isFinePointer() && setOn((v) => !v)}
      style={{ ['--sx']: pos.x + '%', ['--sy']: pos.y + '%' } as React.CSSProperties}
    >
      <span className="ic-spot__glow" />
      <span className="ic-spot__grid" />
      <span className="ic-spot__label">SPOTLIGHT</span>
    </div>
  );
}

/* 28 - Flip Card */
export function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button className="ic-flipWrap" onClick={() => setFlipped((v) => !v)} aria-pressed={flipped}>
      <motion.div
        className="ic-flip"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{ transformPerspective: 1200 }}
      >
        <span className="ic-flip__face ic-flip__face--front">
          <span className="ic-flip__k">FRONT</span>
          <span className="ic-flip__h">tap</span>
        </span>
        <span className="ic-flip__face ic-flip__face--back">
          <span className="ic-flip__k">BACK</span>
          <span className="ic-flip__h">tap</span>
        </span>
      </motion.div>
    </button>
  );
}

/* 29 - Fan Stack */
export function FanStack() {
  const { active, bind } = useActive();
  const items = ['01', '02', '03', '04'];
  return (
    <div className="ic-fan" {...bind}>
      {items.map((n, i) => {
        const spread = active ? (i - 1.5) * 58 : (i - 1.5) * 12;
        const rot = active ? (i - 1.5) * 7 : (i - 1.5) * 2;
        return (
          <motion.div
            className="ic-fan__card"
            key={n}
            style={{ zIndex: 10 - Math.abs(i - 1.5) }}
            animate={{ x: spread, rotate: rot, y: active ? -Math.abs(i - 1.5) * 10 : 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            {n}
          </motion.div>
        );
      })}
    </div>
  );
}

/* 30 - Magnetic Grid */
export function MagneticGrid() {
  const pointer = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointercancel', onLeave);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointercancel', onLeave);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const px = pointer.current.x - rect.left;
    const py = pointer.current.y - rect.top;
    const gap = 30;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ox = x * gap;
        const oy = y * gap;
        const dx = ox - px;
        const dy = oy - py;
        const d = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - d / 165);
        const push = force * 26;
        const bx = ox + (dx / (d || 1)) * push;
        const by = oy + (dy / (d || 1)) * push;
        const wave = Math.sin(t * 1.4 + x * 0.25 + y * 0.25) * 0.5 + 0.5;
        const r = 1.1 + force * 2.6 + wave * 0.5;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,237,240,' + (0.12 + force * 0.75).toFixed(3) + ')';
        ctx.fill();
      }
    }
  }, []);

  const ref = useCanvas(draw);
  return <canvas ref={ref} className="ic-canvas" />;
}

/* 31 - Noise Field */
export function NoiseField() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const step = 9;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const n =
          Math.sin(x * 0.17 + t * 1.1) * Math.cos(y * 0.19 - t * 0.9) +
          Math.sin((x + y) * 0.09 + t * 1.7) * 0.6;
        const v = (n + 1.6) / 3.2;
        if (v < 0.34) continue;
        const s = 1 + v * 2.6;
        ctx.fillStyle = 'rgba(237,237,240,' + ((v - 0.34) * 0.85).toFixed(3) + ')';
        ctx.fillRect(x * step, y * step, s, s);
      }
    }
  }, []);

  const ref = useCanvas(draw);
  return <canvas ref={ref} className="ic-canvas ic-canvas--fill" />;
}

/* 32 - Morph Toggle */
export function MorphToggle() {
  const [on, setOn] = useState(false);
  return (
    <button className="ic-toggleWrap" onClick={() => setOn((v) => !v)} aria-pressed={on} aria-label="Toggle">
      <motion.div
        className="ic-toggle"
        animate={{
          backgroundColor: on ? '#ededf0' : '#16161b',
          borderColor: on ? '#ededf0' : '#2e2e36'
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.span
          className="ic-toggle__knob"
          animate={{
            x: on ? 46 : 0,
            borderRadius: on ? '12px' : '50%',
            backgroundColor: on ? '#08080a' : '#ededf0'
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        />
      </motion.div>
      <span className="ic-toggleWrap__label">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}

/* 33 - Odometer Roll */
export function OdometerRoll() {
  const [value, setValue] = useState(1284);

  useEffect(() => {
    const t = window.setInterval(() => {
      setValue((v) => (v + 1 + Math.floor(Math.random() * 7)) % 10000);
    }, 2100);
    return () => window.clearInterval(t);
  }, []);

  const digits = String(value).padStart(4, '0').split('');

  return (
    <div className="ic-odo">
      {digits.map((d, i) => (
        <span className="ic-odo__cell" key={i}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={i + '-' + d}
              className="ic-odo__digit"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </div>
  );
}
