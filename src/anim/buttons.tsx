import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { isFinePointer, useActive } from '../lib/hooks';

const SPRING = { type: 'spring', stiffness: 320, damping: 26, mass: 0.6 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/* 01 — Magnetic Pull */
export function MagneticPull() {
  const ref = useRef<HTMLButtonElement>(null);
  const [down, setDown] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 20, mass: 0.5 });
  const lx = useTransform(x, (v) => v * 0.42);
  const ly = useTransform(y, (v) => v * 0.42);

  const move = (e: React.PointerEvent) => {
    if (!isFinePointer() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.24);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.24);
  };

  const release = () => {
    mx.set(0);
    my.set(0);
    setDown(false);
  };

  return (
    <motion.button
      ref={ref}
      className="mm-btn"
      style={{ x, y }}
      animate={{ scale: down ? 0.955 : 1 }}
      transition={SPRING}
      onPointerMove={move}
      onPointerLeave={release}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerCancel={release}
    >
      <span className="mm-btn__ring" />
      <motion.span className="mm-btn__label" style={{ x: lx, y: ly }}>
        Magnetic
      </motion.span>
    </motion.button>
  );
}

/* 02 — Ripple Field */
type Ripple = { id: number; x: number; y: number };

export function RippleField() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);

  const spawn = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    setRipples((p) => [...p.slice(-4), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
  };

  return (
    <button className="mm-ripple" onPointerDown={spawn}>
      <span className="mm-ripple__label">Tap anywhere</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="mm-ripple__wave"
            style={{ left: r.x, top: r.y }}
            initial={{ scale: 0.1, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1.05, ease: EASE }}
            onAnimationComplete={() => setRipples((p) => p.filter((v) => v.id !== r.id))}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}

/* 03 — Liquid Rise */
export function LiquidRise() {
  const { active, bind } = useActive();
  return (
    <button className="mm-liquid" {...bind}>
      <motion.span
        className="mm-liquid__fill"
        animate={{ y: active ? '0%' : '101%' }}
        transition={{ duration: 0.62, ease: EASE }}
      >
        <svg className="mm-liquid__wave" viewBox="0 0 240 14" preserveAspectRatio="none">
          <path
            d="M0 7 C 20 0, 40 14, 60 7 S 100 0, 120 7 S 160 14, 180 7 S 220 0, 240 7 L240 14 L0 14 Z"
            fill="currentColor"
          />
        </svg>
      </motion.span>
      <span className="mm-liquid__label">Liquid</span>
    </button>
  );
}

/* 04 — Split Stack */
export function SplitStack() {
  const { active, bind } = useActive();
  return (
    <button className="mm-split" {...bind}>
      <motion.span
        className="mm-split__inner"
        animate={{ y: active ? '-50%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="mm-split__line">Split</span>
        <span className="mm-split__line mm-split__line--alt">Split</span>
      </motion.span>
    </button>
  );
}

/* 05 — Border Trace */
export function BorderTrace() {
  const { active, bind } = useActive();
  return (
    <button className="mm-trace" {...bind}>
      <svg className="mm-trace__svg" viewBox="0 0 220 62" preserveAspectRatio="none">
        <rect x="1" y="1" width="218" height="60" rx="31" fill="none" stroke="#2b2b33" strokeWidth="1.5" />
        <motion.rect
          x="1"
          y="1"
          width="218"
          height="60"
          rx="31"
          fill="none"
          stroke="#f0f0f3"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ pathLength: { duration: 0.85, ease: EASE }, opacity: { duration: 0.15 } }}
        />
      </svg>
      <span className="mm-trace__label">Trace</span>
    </button>
  );
}

/* 06 — Depth Press */
export function DepthPress() {
  const [down, setDown] = useState(false);
  return (
    <motion.button
      className="mm-depth"
      animate={{
        y: down ? 5 : 0,
        boxShadow: down
          ? '0 1px 0 0 #2e2e36, 0 2px 8px rgba(0,0,0,.6)'
          : '0 7px 0 0 #2e2e36, 0 14px 24px rgba(0,0,0,.55)'
      }}
      transition={SPRING}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
    >
      <span className="mm-depth__label">Press</span>
    </motion.button>
  );
}

/* 07 — Morph Pill */
export function MorphPill() {
  const { active, bind } = useActive();
  return (
    <motion.button
      className="mm-pill"
      {...bind}
      animate={{
        width: active ? 228 : 152,
        borderRadius: active ? 22 : 999,
        backgroundColor: active ? '#ededf0' : '#121216'
      }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <motion.span
        className="mm-pill__label"
        animate={{
          color: active ? '#08080a' : '#ededf0',
          letterSpacing: active ? '0.16em' : '0.04em'
        }}
        transition={{ duration: 0.4 }}
      >
        Morph
      </motion.span>
    </motion.button>
  );
}

/* 08 — Slice Glitch */
export function SliceGlitch() {
  const { active, bind } = useActive();
  return (
    <button className={active ? 'mm-glitch is-on' : 'mm-glitch'} {...bind}>
      <span className="mm-glitch__base">Glitch</span>
      <span className="mm-glitch__layer mm-glitch__layer--a" aria-hidden>Glitch</span>
      <span className="mm-glitch__layer mm-glitch__layer--b" aria-hidden>Glitch</span>
      <span className="mm-glitch__layer mm-glitch__layer--c" aria-hidden>Glitch</span>
    </button>
  );
}
