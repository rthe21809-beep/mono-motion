import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useActive, useHover, usePlay } from '../lib/hooks';
import { EASE_IN_OUT, EASE_OUT, SPRING } from '../lib/motion';

export function MagneticPull() {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.16);
    my.set((e.clientY - r.top - r.height / 2) * 0.16);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
    setPressed(false);
  };

  return (
    <motion.button
      ref={ref}
      className="btn btn--magnet"
      style={{ x, y }}
      animate={{ scale: pressed ? 0.97 : 1 }}
      transition={SPRING}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={reset}
    >
      <span className="btn__label">Magnetic</span>
    </motion.button>
  );
}

type Ripple = { id: number; x: number; y: number };

export function RippleBloom() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);

  const spawn = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
  };

  return (
    <button className="btn btn--ripple" onPointerDown={spawn}>
      <span className="btn__label btn__label--dim">Tap anywhere</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.95, ease: EASE_OUT }}
            onAnimationComplete={() => setRipples((p) => p.filter((v) => v.id !== r.id))}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}

export function LiquidFill() {
  const { active, handlers } = useActive(1100);
  return (
    <button className="btn btn--liquid" {...handlers}>
      <motion.span
        className="liquid__fill"
        animate={{ y: active ? '0%' : '103%' }}
        transition={{ duration: 0.55, ease: EASE_IN_OUT }}
      >
        <svg className="liquid__wave" viewBox="0 0 240 16" preserveAspectRatio="none" aria-hidden>
          <path d="M0 8C30 0 45 16 75 8s45-16 75 0 45 16 90 0v8H0z" fill="currentColor" />
        </svg>
      </motion.span>
      <span className="liquid__label">Liquid</span>
    </button>
  );
}

export function SlideLabel() {
  const { active, handlers } = useActive(900);
  return (
    <button className="btn btn--slide" {...handlers}>
      <motion.span
        className="slide__inner"
        animate={{ y: active ? '-50%' : '0%' }}
        transition={{ duration: 0.46, ease: EASE_OUT }}
      >
        <span className="slide__line">Slide</span>
        <span className="slide__line slide__line--alt">Slide</span>
      </motion.span>
    </button>
  );
}

export function BorderDraw() {
  const { active, handlers } = useActive(1200);
  return (
    <button className="btn btn--draw" {...handlers}>
      <svg className="draw__svg" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden>
        <rect x="0.75" y="0.75" width="198.5" height="58.5" rx="29" fill="none" stroke="#26262e" strokeWidth="1.5" />
        <motion.rect
          x="0.75" y="0.75" width="198.5" height="58.5" rx="29"
          fill="none" stroke="#ededf0" strokeWidth="1.6" strokeLinecap="round"
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ pathLength: { duration: 0.9, ease: EASE_IN_OUT }, opacity: { duration: 0.18 } }}
        />
      </svg>
      <span className="draw__label">Draw</span>
    </button>
  );
}

export function SoftPress() {
  const [down, setDown] = useState(false);
  return (
    <motion.button
      className="btn btn--press"
      animate={{
        y: down ? 4 : 0,
        boxShadow: down
          ? '0 1px 0 0 #2a2a32, 0 3px 10px rgba(0,0,0,.55)'
          : '0 6px 0 0 #2a2a32, 0 16px 26px rgba(0,0,0,.45)'
      }}
      transition={SPRING}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
    >
      <span className="btn__label">Press</span>
    </motion.button>
  );
}

export function MorphCapsule() {
  const { active, handlers } = useActive(1200);
  return (
    <motion.button
      className="btn btn--capsule"
      {...handlers}
      animate={{
        width: active ? 214 : 158,
        borderRadius: active ? 18 : 999,
        backgroundColor: active ? '#ededf0' : '#14141a',
        borderColor: active ? '#ededf0' : '#2c2c34'
      }}
      transition={{ duration: 0.5, ease: EASE_IN_OUT }}
    >
      <motion.span
        className="capsule__label"
        animate={{
          color: active ? '#08080a' : '#a1a1ab',
          letterSpacing: active ? '0.18em' : '0.06em'
        }}
        transition={{ duration: 0.35 }}
      >
        Morph
      </motion.span>
    </motion.button>
  );
}

export function GlitchSlice() {
  const { playing, play } = usePlay(520);
  const { hovered, handlers } = useHover();
  const on = playing || hovered;
  return (
    <button className={on ? 'btn btn--glitch is-on' : 'btn btn--glitch'} {...handlers} onPointerDown={play}>
      <span className="glitch__base">Glitch</span>
      <span className="glitch__slice glitch__slice--a" aria-hidden>Glitch</span>
      <span className="glitch__slice glitch__slice--b" aria-hidden>Glitch</span>
      <span className="glitch__slice glitch__slice--c" aria-hidden>Glitch</span>
    </button>
  );
}
