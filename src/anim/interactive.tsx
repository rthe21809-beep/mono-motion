import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useActive, useCanvas, useFinePointer, usePlay } from '../lib/hooks';
import { EASE_IN_OUT, EASE_OUT, SPRING, SPRING_SOFT } from '../lib/motion';

export function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING);
  const sry = useSpring(ry, SPRING);
  const glareX = useTransform(sry, [-12, 12], ['20%', '80%']);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 18);
    rx.set(-ny * 18);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="tiltWrap">
      <motion.div
        ref={ref}
        className="tilt"
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
        onPointerMove={onMove}
        onPointerLeave={reset}
        animate={fine ? undefined : { rotateZ: [-2, 2, -2] }}
        transition={fine ? undefined : { duration: 7, repeat: Infinity, ease: EASE_IN_OUT }}
      >
        <motion.span className="tilt__glare" style={{ left: glareX }} />
        <span className="tilt__title">TILT</span>
        <span className="tilt__sub">{fine ? 'move the cursor' : 'idle float'}</span>
      </motion.div>
    </div>
  );
}

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const { playing, play } = usePlay(1500);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const on = fine ? hover : playing;

  return (
    <div
      ref={ref}
      className={on ? 'spot is-on' : 'spot'}
      onPointerMove={onMove}
      onPointerEnter={() => fine && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerDown={() => !fine && play()}
      style={{ ['--sx' as string]: `${pos.x}%`, ['--sy' as string]: `${pos.y}%` }}
    >
      <span className="spot__glow" />
      <span className="spot__grid" />
      <span className="spot__label">SPOTLIGHT</span>
    </div>
  );
}

export function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button className="flipCard" onClick={() => setFlipped((v) => !v)} aria-pressed={flipped}>
      <motion.div
        className="flipCard__inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: EASE_IN_OUT }}
        style={{ transformPerspective: 1200 }}
      >
        <span className="flipCard__face flipCard__face--front">
          <span className="flipCard__k">FRONT</span>
          <span className="flipCard__h">tap</span>
        </span>
        <span className="flipCard__face flipCard__face--back">
          <span className="flipCard__k">BACK</span>
          <span className="flipCard__h">tap</span>
        </span>
      </motion.div>
    </button>
  );
}

export function FanCards() {
  const { active, handlers } = useActive(1600);
  const items = ['01', '02', '03', '04'];
  return (
    <div className="fan" {...handlers}>
      {items.map((n, i) => {
        const k = i - 1.5;
        return (
          <motion.div
            className="fan__card"
            key={n}
            style={{ zIndex: 10 - Math.abs(k) }}
            animate={{
              x: active ? k * 54 : k * 10,
              rotate: active ? k * 6 : k * 2,
              y: active ? -Math.abs(k) * 8 : 0
            }}
            transition={SPRING_SOFT}
          >
            {n}
          </motion.div>
        );
      })}
    </div>
  );
}

export function MagneticGrid() {
  const pointer = useRef({ x: -9999, y: -9999, has: false });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current = { x: e.clientX, y: e.clientY, has: true };
    };
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999, has: false };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const px = pointer.current.x - rect.left;
    const py = pointer.current.y - rect.top;
    const gap = 28;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const ox = x * gap;
        const oy = y * gap;
        const dx = ox - px;
        const dy = oy - py;
        const d = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - d / 150);
        const push = force * 22;
        const bx = ox + (dx / (d || 1)) * push;
        const by = oy + (dy / (d || 1)) * push;
        const wave = Math.sin(t * 1.2 + x * 0.28 + y * 0.28) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(bx, by, 1 + force * 2.4 + wave * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237,237,240,${(0.1 + force * 0.7).toFixed(3)})`;
        ctx.fill();
      }
    }
  }, []);

  const ref = useCanvas(draw);
  return <canvas ref={ref} className="cv cv--grid" />;
}

export function NoiseField() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const step = 10;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const n =
          Math.sin(x * 0.16 + t) * Math.cos(y * 0.18 - t * 0.8) +
          Math.sin((x + y) * 0.08 + t * 1.6) * 0.55;
        const v = (n + 1.55) / 3.1;
        if (v < 0.36) continue;
        const s = 1 + v * 2.4;
        ctx.fillStyle = `rgba(237,237,240,${((v - 0.36) * 0.8).toFixed(3)})`;
        ctx.fillRect(x * step, y * step, s, s);
      }
    }
  }, []);
  const ref = useCanvas(draw);
  return <canvas ref={ref} className="cv cv--noise" />;
}

export function MorphSwitch() {
  const [on, setOn] = useState(false);
  return (
    <button className="sw" onClick={() => setOn((v) => !v)} aria-pressed={on} aria-label="Toggle">
      <motion.div
        className="sw__track"
        animate={{
          backgroundColor: on ? '#ededf0' : '#16161c',
          borderColor: on ? '#ededf0' : '#2c2c34'
        }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <motion.span
          className="sw__knob"
          animate={{ x: on ? 44 : 0, borderRadius: on ? '11px' : '50%', backgroundColor: on ? '#08080a' : '#ededf0' }}
          transition={SPRING}
        />
      </motion.div>
      <span className="sw__label">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export function Odometer() {
  const [value, setValue] = useState(1284);
  useEffect(() => {
    const t = window.setInterval(() => {
      setValue((v) => (v + 1 + Math.floor(Math.random() * 6)) % 10000);
    }, 2400);
    return () => window.clearInterval(t);
  }, []);
  const digits = String(value).padStart(4, '0').split('');
  return (
    <div className="odo">
      {digits.map((d, i) => (
        <span className="odo__cell" key={i}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${d}`}
              className="odo__digit"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </div>
  );
}
