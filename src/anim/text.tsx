import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { isFinePointer } from '../lib/hooks';

const EASE = [0.16, 1, 0.3, 1] as const;
const NBSP = String.fromCharCode(160);

/* 09 — Character Wave */
export function CharWave() {
  const [key, setKey] = useState(0);
  const word = 'RIPPLE';
  return (
    <button className="tw" onClick={() => setKey((k) => k + 1)} aria-label="Replay">
      <span className="tw__row">
        {word.split('').map((c, i) => (
          <motion.span
            key={key + '-' + i}
            className="tw__char"
            initial={{ y: 0 }}
            animate={{ y: [0, -34, 0] }}
            transition={{
              duration: 0.95,
              delay: i * 0.065,
              ease: EASE,
              repeat: Infinity,
              repeatDelay: 1.4
            }}
          >
            {c}
          </motion.span>
        ))}
      </span>
    </button>
  );
}

/* 10 — Type Loop */
export function TypeLoop() {
  const phrase = 'handmade motion';
  const [n, setN] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    const hold = n === phrase.length && dir === 1;
    const wait = hold ? 1200 : n === 0 && dir === -1 ? 600 : 62;
    const t = window.setTimeout(() => {
      if (dir === 1) {
        if (n < phrase.length) setN(n + 1);
        else setDir(-1);
      } else {
        if (n > 0) setN(n - 1);
        else setDir(1);
      }
    }, wait);
    return () => window.clearTimeout(t);
  }, [n, dir, phrase.length]);

  return (
    <div className="tw tw--mono" aria-label={phrase}>
      <span>{phrase.slice(0, n)}</span>
      <motion.span
        className="tw__caret"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* 11 — Mask Reveal */
export function MaskReveal() {
  const lines = ['Every frame', 'is drawn', 'by hand'];
  const [key, setKey] = useState(0);
  return (
    <button className="tw tw--stack" onClick={() => setKey((k) => k + 1)} aria-label="Replay">
      {lines.map((l, i) => (
        <span className="tw__mask" key={key + '-' + i}>
          <motion.span
            className="tw__maskline"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 0.09 * i, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </button>
  );
}

/* 12 — Scramble Decode */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+-';

export function Scramble() {
  const target = 'DECODE';
  const [display, setDisplay] = useState(target.split(''));
  const frame = useRef(0);
  const raf = useRef(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    frame.current = 0;
    const tick = () => {
      frame.current += 1;
      const f = frame.current;
      setDisplay(
        target.split('').map((c, i) => {
          if (c === ' ') return ' ';
          if (f > i * 5 + 14) return c;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
      );
      if (f < target.length * 5 + 20) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <button className="tw tw--mono" onClick={run} aria-label="Replay">
      {display.join('')}
    </button>
  );
}

/* 13 — Sheen Chrome */
export function SheenText() {
  return (
    <div className="tw__sheenWrap">
      <span className="tw__sheen">CHROME</span>
    </div>
  );
}

/* 14 — Counter Marquee */
export function CounterMarquee() {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(top.current, { xPercent: -50, duration: 18, ease: 'none', repeat: -1 });
      gsap.fromTo(
        bottom.current,
        { xPercent: -50 },
        { xPercent: 0, duration: 22, ease: 'none', repeat: -1 }
      );
    });
    return () => ctx.revert();
  }, []);

  const row = Array.from({ length: 8 }).map((_, i) => (
    <span className="tw__mqItem" key={i}>
      MONO<span className="tw__mqDot">/</span>
    </span>
  ));

  return (
    <div className="tw__mq">
      <div className="tw__mqRow" ref={top}>{row}{row}</div>
      <div className="tw__mqRow tw__mqRow--outline" ref={bottom}>{row}{row}</div>
    </div>
  );
}

/* 15 — Flip Words */
export function FlipWords() {
  const words = ['FLIP', 'TURN', 'SPIN', 'ROLL'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % words.length), 1900);
    return () => window.clearInterval(t);
  }, [words.length]);

  return (
    <div className="tw__flip">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className="tw__flipWord"
          initial={{ rotateX: -92, opacity: 0, y: '40%' }}
          animate={{ rotateX: 0, opacity: 1, y: '0%' }}
          exit={{ rotateX: 92, opacity: 0, y: '-40%' }}
          transition={{ duration: 0.62, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* 16 — Letter Repel */
export function LetterRepel() {
  const wrap = useRef<HTMLDivElement>(null);
  const letters = useMemo(() => 'PUSH AWAY'.split(''), []);

  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-letter]'));
    let raf = 0;
    let px = -9999;
    let py = -9999;

    const apply = () => {
      raf = 0;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        const dx = r.left + r.width / 2 - px;
        const dy = r.top + r.height / 2 - py;
        const d = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - d / 190);
        const ox = (dx / (d || 1)) * force * 42;
        const oy = (dy / (d || 1)) * force * 42;
        n.style.transform = 'translate3d(' + ox.toFixed(2) + 'px, ' + oy.toFixed(2) + 'px, 0)';
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!isFinePointer()) return;
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const reset = () => {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="tw tw--repel" ref={wrap}>
      {letters.map((c, i) => (
        <span className="tw__repelChar" data-letter key={i}>
          {c === ' ' ? NBSP : c}
        </span>
      ))}
    </div>
  );
}
